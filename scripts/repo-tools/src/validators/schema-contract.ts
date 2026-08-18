import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  type Finding,
  type ValidatorOptions,
  type ValidatorResult,
  result,
} from '../lib/types.js';
import { exists, readBoundaries } from '../lib/workspace.js';

const SEMVER = /^\d+\.\d+\.\d+$/;

/** Structural shape a contract must present. Duck-typed so fixtures need no deps. */
interface ContractLike {
  readonly name: string;
  readonly schemaVersion: string;
  readonly schema: { safeParse(value: unknown): { success: boolean } };
  readonly jsonSchema: Record<string, unknown>;
}

/**
 * Samples a module may export to prove its contracts agree with their
 * projections, keyed by contract name.
 */
type ConformanceSamples = Record<string, readonly unknown[]>;

interface ModuleExports {
  readonly conformanceSamples?: ConformanceSamples;
  readonly [key: string]: unknown;
}

export interface SchemaContractOptions extends ValidatorOptions {
  /** Explicit module list. Defaults to the built entry of every published package. */
  readonly modules?: readonly string[];
}

/**
 * Validates that every exported contract's JSON Schema projection is a faithful
 * representation of its runtime schema.
 *
 * The failure this exists to catch is a projection that is *more permissive*
 * than the schema it came from. TypeScript consumers would reject a value while
 * a Python or Go consumer validating against the published JSON Schema accepts
 * it — one contract, two behaviours, and no test that only feeds in valid data
 * would ever notice.
 */
export async function schemaContractValidator(
  options: SchemaContractOptions,
): Promise<ValidatorResult> {
  const { rootDir } = options;
  const findings: Finding[] = [];

  const modules = options.modules ?? (await defaultModules(rootDir));
  let contractsChecked = 0;
  let samplesChecked = 0;

  for (const modulePath of modules) {
    const relative = path.relative(rootDir, modulePath);
    if (!(await exists(modulePath))) {
      findings.push({
        rule: 'schema/module-missing',
        message: `${relative} does not exist. Build the package before validating its contracts.`,
        path: relative,
      });
      continue;
    }

    let exported: ModuleExports;
    try {
      exported = (await import(pathToFileURL(modulePath).href)) as ModuleExports;
    } catch (error) {
      findings.push({
        rule: 'schema/module-unloadable',
        message: `${relative} could not be imported: ${String(error)}`,
        path: relative,
      });
      continue;
    }

    const samples = exported.conformanceSamples ?? {};

    for (const [exportName, value] of Object.entries(exported)) {
      if (!isContractLike(value)) continue;
      contractsChecked += 1;

      if (!SEMVER.test(value.schemaVersion)) {
        findings.push({
          rule: 'schema/invalid-version',
          message: `${relative}#${exportName} has schemaVersion "${value.schemaVersion}"; contracts version independently of packages and must be semver.`,
          path: relative,
        });
      }

      const declaredSamples = samples[value.name];
      if (!declaredSamples || declaredSamples.length === 0) {
        findings.push({
          rule: 'schema/no-conformance-samples',
          message: `${relative}#${exportName} ("${value.name}") declares no conformance samples. Export \`conformanceSamples\` including values that must be REJECTED — samples that are all valid prove nothing.`,
          path: relative,
        });
        continue;
      }

      let jsonSchemaValidator: Validator;
      try {
        jsonSchemaValidator = compile(value.jsonSchema);
      } catch (error) {
        if (error instanceof UnsupportedSchemaKeywordError) {
          findings.push({
            rule: 'schema/unsupported-construct',
            message: `${relative}#${exportName} ("${value.name}"): ${error.message}`,
            path: relative,
          });
          continue;
        }
        throw error;
      }

      for (const sample of declaredSamples) {
        samplesChecked += 1;
        const schemaAccepts = value.schema.safeParse(sample).success;
        const projectionAccepts = jsonSchemaValidator(sample);

        if (schemaAccepts !== projectionAccepts) {
          findings.push({
            rule: 'schema/projection-disagreement',
            message: `${relative}#${exportName} ("${value.name}"): runtime schema ${schemaAccepts ? 'accepts' : 'rejects'} ${JSON.stringify(sample)} but the JSON Schema projection ${projectionAccepts ? 'accepts' : 'rejects'} it. The two describe one contract and must agree.`,
            path: relative,
          });
        }
      }
    }
  }

  return result('schema-contract', findings, {
    modules: modules.length,
    contractsChecked,
    samplesChecked,
  });
}

async function defaultModules(rootDir: string): Promise<string[]> {
  const manifest = await readBoundaries(rootDir);
  return Object.values(manifest.packages)
    .filter((declaration) => declaration.published)
    .map((declaration) => path.join(rootDir, declaration.path, 'dist', 'index.js'));
}

function isContractLike(value: unknown): value is ContractLike {
  if (typeof value !== 'object' || value === null) return false;

  // Deliberately typed as an unknown-valued record rather than
  // `Partial<ContractLike>`: this runs over arbitrary module exports, so
  // asserting the target shape up front would make the null guards below look
  // impossible to the type checker while remaining necessary at runtime
  // (`typeof null === 'object'`).
  const candidate = value as Record<string, unknown>;
  const schema = candidate.schema;

  return (
    typeof candidate.name === 'string' &&
    typeof candidate.schemaVersion === 'string' &&
    typeof candidate.jsonSchema === 'object' &&
    candidate.jsonSchema !== null &&
    typeof schema === 'object' &&
    schema !== null &&
    typeof (schema as Record<string, unknown>).safeParse === 'function'
  );
}

/**
 * The draft-07 keywords this evaluator actually implements. Deliberately a
 * subset, not an attempt at parity with a reference implementation (Ajv is
 * used only in differential tests, never at runtime - see
 * differential.unit.test.ts and docs/audit/REPOSITORY-INTEGRITY-AUDIT.md
 * finding A4/A5 for why runtime parity was rejected as scope creep, and the
 * `schemasafe` posture this adopts instead).
 */
const SUPPORTED_SCHEMA_KEYWORDS: ReadonlySet<string> = new Set([
  'type',
  'const',
  'enum',
  'minimum',
  'maximum',
  'minLength',
  'maxLength',
  'pattern',
  'items',
  'properties',
  'required',
  'additionalProperties',
]);

/**
 * Keywords that annotate a schema without constraining accepted values.
 * Safe to ignore: a validator that skips `description` cannot become more
 * permissive than the schema it describes, which is the property
 * SUPPORTED_SCHEMA_KEYWORDS exists to protect.
 */
const ANNOTATION_KEYWORDS: ReadonlySet<string> = new Set([
  '$schema',
  '$id',
  '$comment',
  'title',
  'description',
  'default',
  'examples',
  'readOnly',
  'writeOnly',
]);

export class UnsupportedSchemaKeywordError extends Error {
  readonly keyword: string;
  readonly atPath: string;

  constructor(keyword: string, atPath: string) {
    super(
      `Unsupported JSON Schema keyword "${keyword}" at ${atPath || '#'}. ` +
        'schema-contract-validator implements a deliberately narrow draft-07 ' +
        'subset (see SUPPORTED_SCHEMA_KEYWORDS) and fails closed on a construct ' +
        'it cannot evaluate rather than silently accepting whatever the ' +
        'construct would have rejected.',
    );
    this.name = 'UnsupportedSchemaKeywordError';
    this.keyword = keyword;
    this.atPath = atPath;
  }
}

/**
 * Walks `schema` and throws `UnsupportedSchemaKeywordError` at the first
 * keyword outside `SUPPORTED_SCHEMA_KEYWORDS`/`ANNOTATION_KEYWORDS`, at any
 * nesting depth reachable through `items` or `properties`.
 *
 * This is the fail-closed half of the contract: before this existed, an
 * unrecognised keyword (`oneOf`, `$ref`, `multipleOf`, ...) was silently
 * ignored by `evaluate()`, which made the projection strictly more
 * permissive than the schema it was derived from on every sample that
 * keyword would have rejected - the exact defect this validator exists to
 * catch, now present inside the validator itself. See
 * docs/audit/REPOSITORY-INTEGRITY-AUDIT.md finding A4 for the differential
 * evidence (20 of 21 draft-07 constructs silently ignored) that this
 * function closes.
 */
function assertSupportedSchema(schema: unknown, atPath: string): void {
  if (typeof schema === 'boolean') return; // `true`/`false` schemas are valid draft-07.
  if (!isPlainObject(schema)) return;

  for (const key of Object.keys(schema)) {
    if (SUPPORTED_SCHEMA_KEYWORDS.has(key) || ANNOTATION_KEYWORDS.has(key)) continue;
    throw new UnsupportedSchemaKeywordError(key, atPath);
  }

  if (isSchema(schema.items)) {
    assertSupportedSchema(schema.items, `${atPath}/items`);
  }
  if (isPlainObject(schema.properties)) {
    for (const [key, propertySchema] of Object.entries(schema.properties)) {
      assertSupportedSchema(propertySchema, `${atPath}/properties/${key}`);
    }
  }
}

type Validator = (value: unknown) => boolean;

const compiled = new WeakMap<Record<string, unknown>, Validator>();

/**
 * Compiles `jsonSchema` into a `Validator`, first asserting it uses only
 * `SUPPORTED_SCHEMA_KEYWORDS`. Throws `UnsupportedSchemaKeywordError` rather
 * than compiling a validator that would silently under-enforce.
 */
function compile(jsonSchema: Record<string, unknown>): Validator {
  const cached = compiled.get(jsonSchema);
  if (cached) return cached;

  assertSupportedSchema(jsonSchema, '#');
  const validator = buildValidator(jsonSchema);
  compiled.set(jsonSchema, validator);
  return validator;
}

/**
 * A deliberately small JSON Schema evaluator covering the draft-07 keywords this
 * repository's contracts use.
 *
 * Using a dependency-free evaluator keeps the tooling package free of a schema
 * library, and — more importantly — means the projection is checked by
 * something other than the library that produced it. A projection validated by
 * its own generator can agree with itself while disagreeing with every other
 * consumer.
 *
 * Only ever called on schemas that already passed `assertSupportedSchema` -
 * every keyword this function reads is therefore known-supported at every
 * nesting depth, not just the top level.
 */
function buildValidator(schema: Record<string, unknown>): Validator {
  return (value: unknown): boolean => evaluate(schema, value);
}

function evaluate(schema: Record<string, unknown>, value: unknown): boolean {
  if (schema.const !== undefined) {
    return JSON.stringify(schema.const) === JSON.stringify(value);
  }
  if (Array.isArray(schema.enum)) {
    return schema.enum.some((entry) => JSON.stringify(entry) === JSON.stringify(value));
  }

  const types = schema.type;
  const typeList =
    typeof types === 'string' ? [types] : Array.isArray(types) ? types : [];
  if (typeList.length > 0 && !typeList.some((type) => matchesType(String(type), value))) {
    return false;
  }

  if (typeof value === 'number') {
    const minimum = schema.minimum;
    const maximum = schema.maximum;
    if (typeof minimum === 'number' && value < minimum) return false;
    if (typeof maximum === 'number' && value > maximum) return false;
  }

  if (typeof value === 'string') {
    const minLength = schema.minLength;
    const maxLength = schema.maxLength;
    const pattern = schema.pattern;
    if (typeof minLength === 'number' && value.length < minLength) return false;
    if (typeof maxLength === 'number' && value.length > maxLength) return false;
    if (typeof pattern === 'string' && !new RegExp(pattern).test(value)) return false;
  }

  if (Array.isArray(value)) {
    const items = schema.items;
    if (isSchema(items) && !value.every((entry) => evaluate(items, entry))) return false;
  }

  if (isPlainObject(value)) {
    const properties = isPlainObject(schema.properties) ? schema.properties : {};
    const required = Array.isArray(schema.required) ? schema.required : [];

    for (const key of required) {
      if (!(String(key) in value)) return false;
    }
    for (const [key, propertySchema] of Object.entries(properties)) {
      if (key in value && isSchema(propertySchema)) {
        if (!evaluate(propertySchema, value[key])) return false;
      }
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!(key in properties)) return false;
      }
    }
  }

  return true;
}

function matchesType(type: string, value: unknown): boolean {
  switch (type) {
    case 'object':
      return isPlainObject(value);
    case 'array':
      return Array.isArray(value);
    case 'string':
      return typeof value === 'string';
    case 'integer':
      return typeof value === 'number' && Number.isInteger(value);
    case 'number':
      return typeof value === 'number' && Number.isFinite(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'null':
      return value === null;
    default:
      return true;
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSchema(value: unknown): value is Record<string, unknown> {
  return isPlainObject(value);
}
