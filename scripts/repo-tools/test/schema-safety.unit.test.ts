import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { schemaContractValidator } from '../src/validators/schema-contract.js';

const FIXTURES = path.resolve(import.meta.dirname, '../../../tests/fixtures/schema');
const ROOT = path.resolve(import.meta.dirname, '../../..');
const fixture = (...segments: string[]): string => path.join(FIXTURES, ...segments);

/**
 * Part G/H regression corpus: one fixture per draft-07 construct the
 * differential test (docs/audit/REPOSITORY-INTEGRITY-AUDIT.md, finding A4)
 * proved was silently ignored. Before schema-contract.ts's
 * `assertSupportedSchema`, every one of these fixtures would PASS - the
 * custom evaluator accepted samples the construct should have rejected,
 * which "agreed" with the (deliberately wrong) `success: true` sample
 * pinned in each fixture's `schema.safeParse`. Now every one must FAIL
 * CLOSED with an explicit `schema/unsupported-construct` finding, never a
 * silent pass and never a `schema/projection-disagreement` (that finding
 * means "both sides understood the schema and disagreed on a value" -
 * distinct from "one side could not understand the schema at all").
 */
describe('schema-contract-validator — unsupported-construct regression corpus (Part G)', () => {
  const cases = [
    'unsupported-oneOf',
    'unsupported-anyOf',
    'unsupported-allOf',
    'unsupported-not',
    'unsupported-ref',
    'unsupported-format',
    'unsupported-exclusiveMinimum',
    'unsupported-exclusiveMaximum',
    'unsupported-multipleOf',
    'unsupported-minItems',
    'unsupported-maxItems',
    'unsupported-patternProperties',
  ] as const;

  for (const name of cases) {
    it(`fails closed on ${name.replace('unsupported-', '')} rather than silently accepting`, async () => {
      const modulePath = fixture(name, 'index.js');
      const result = await schemaContractValidator({
        rootDir: fixture(name),
        modules: [modulePath],
      });

      expect(result.status).toBe('FAIL');
      expect(result.findings).toHaveLength(1);
      expect(result.findings[0]?.rule).toBe('schema/unsupported-construct');
      // Must never be misclassified as an ordinary disagreement, which would
      // imply both sides understood the schema and merely reached different
      // verdicts - not true here.
      expect(
        result.findings.some((f) => f.rule === 'schema/projection-disagreement'),
      ).toBe(false);
    });
  }

  it('fails closed on an unsupported keyword nested inside properties, not just the top level', async () => {
    const modulePath = fixture('unsupported-nested-in-properties', 'index.js');
    const result = await schemaContractValidator({
      rootDir: fixture('unsupported-nested-in-properties'),
      modules: [modulePath],
    });

    expect(result.status).toBe('FAIL');
    expect(result.findings[0]?.rule).toBe('schema/unsupported-construct');
    expect(result.findings[0]?.message).toContain('oneOf');
    expect(result.findings[0]?.message).toContain('/properties/a');
  });

  it('still accepts a schema using only supported keywords (no regression on the happy path)', async () => {
    const result = await schemaContractValidator({
      rootDir: fixture('faithful'),
      modules: [fixture('faithful', 'index.js')],
    });
    expect(result.status).toBe('PASS');
  });
});

/**
 * Differential test (Part H): for every SUPPORTED_SCHEMA_KEYWORDS keyword,
 * the custom evaluator must agree with Ajv 8.20.0 - the same reference
 * implementation `packages/contracts` already depends on - across a set of
 * accept/reject sample pairs. This is the permanent form of the ad hoc
 * probe run during the audit (finding A4).
 */
describe('schema-contract-validator — differential agreement with Ajv (Part H)', () => {
  const ajvDistPath = findAjvDist();

  it.runIf(ajvDistPath !== undefined)(
    'agrees with Ajv on every supported-keyword sample',
    async () => {
      // runIf above guarantees this, but narrow explicitly rather than assert.
      if (ajvDistPath === undefined) throw new Error('unreachable: guarded by runIf');
      const { Ajv } = await importAjv(ajvDistPath);
      const ajv = new Ajv({ allErrors: true, strict: false });

      const cases: {
        readonly name: string;
        readonly schema: object;
        readonly sample: unknown;
      }[] = [
        { name: 'type:string ok', schema: { type: 'string' }, sample: 'x' },
        { name: 'type:string reject', schema: { type: 'string' }, sample: 1 },
        { name: 'const ok', schema: { const: 'x' }, sample: 'x' },
        { name: 'const reject', schema: { const: 'x' }, sample: 'y' },
        { name: 'enum ok', schema: { enum: ['a', 'b'] }, sample: 'a' },
        { name: 'enum reject', schema: { enum: ['a', 'b'] }, sample: 'c' },
        { name: 'minimum ok', schema: { type: 'number', minimum: 5 }, sample: 5 },
        { name: 'minimum reject', schema: { type: 'number', minimum: 5 }, sample: 4 },
        { name: 'maximum ok', schema: { type: 'number', maximum: 5 }, sample: 5 },
        { name: 'maximum reject', schema: { type: 'number', maximum: 5 }, sample: 6 },
        { name: 'minLength ok', schema: { type: 'string', minLength: 2 }, sample: 'ab' },
        {
          name: 'minLength reject',
          schema: { type: 'string', minLength: 2 },
          sample: 'a',
        },
        { name: 'maxLength ok', schema: { type: 'string', maxLength: 2 }, sample: 'ab' },
        {
          name: 'maxLength reject',
          schema: { type: 'string', maxLength: 2 },
          sample: 'abc',
        },
        { name: 'pattern ok', schema: { type: 'string', pattern: '^a' }, sample: 'ab' },
        {
          name: 'pattern reject',
          schema: { type: 'string', pattern: '^a' },
          sample: 'b',
        },
        {
          name: 'items ok',
          schema: { type: 'array', items: { type: 'string' } },
          sample: ['a', 'b'],
        },
        {
          name: 'items reject',
          schema: { type: 'array', items: { type: 'string' } },
          sample: ['a', 1],
        },
        {
          name: 'properties+required ok',
          schema: {
            type: 'object',
            properties: { a: { type: 'string' } },
            required: ['a'],
          },
          sample: { a: 'x' },
        },
        {
          name: 'properties+required reject (missing)',
          schema: {
            type: 'object',
            properties: { a: { type: 'string' } },
            required: ['a'],
          },
          sample: {},
        },
        {
          name: 'additionalProperties:false ok',
          schema: {
            type: 'object',
            properties: { a: { type: 'string' } },
            additionalProperties: false,
          },
          sample: { a: 'x' },
        },
        {
          name: 'additionalProperties:false reject',
          schema: {
            type: 'object',
            properties: { a: { type: 'string' } },
            additionalProperties: false,
          },
          sample: { a: 'x', b: 1 },
        },
      ];

      let caseIndex = 0;
      for (const { name, schema, sample } of cases) {
        const ajvAccepts = ajv.compile(schema)(sample);
        caseIndex += 1;

        // Drive the real custom evaluator through the public validator, the
        // same path production code exercises - not the internal function
        // directly, so this proves what actually ships. Each case gets a
        // uniquely-named module file: dynamic import() caches by resolved
        // URL, so re-importing one fixed path across cases would silently
        // keep returning the FIRST case's content for every case after it.
        const modulePath = path.join(
          import.meta.dirname,
          `.differential-probe-${String(caseIndex)}.mjs`,
        );
        const contractModule = await buildProbeModule(
          schema,
          sample,
          ajvAccepts,
          modulePath,
        );
        try {
          const result = await schemaContractValidator({
            rootDir: path.dirname(modulePath),
            modules: [contractModule],
          });
          expect(result.findings, `case: ${name}`).toEqual([]);
        } finally {
          await cleanupProbeModule(contractModule);
        }
      }
    },
  );

  it.runIf(ajvDistPath === undefined)(
    'VERIFY-BLOCKED: Ajv not found in node_modules',
    () => {
      // Do not silently upgrade this to a pass. If this fires, the
      // differential test above did not run - report it, don't hide it.
      expect.fail(
        'Ajv 8.20.0 could not be located under node_modules/.pnpm - the differential test could not execute. This is VERIFY-BLOCKED, not PASS.',
      );
    },
  );
});

function findAjvDist(): string | undefined {
  const pnpmDir = path.join(ROOT, 'node_modules/.pnpm');
  if (!existsSync(pnpmDir)) return undefined;
  const match = readdirSync(pnpmDir).find((entry) => entry.startsWith('ajv@8.'));
  if (!match) return undefined;
  const distPath = path.join(pnpmDir, match, 'node_modules/ajv/dist/ajv.js');
  return existsSync(distPath) ? distPath : undefined;
}

async function importAjv(distPath: string): Promise<{
  Ajv: new (options: object) => {
    compile: (schema: object) => (value: unknown) => boolean;
  };
}> {
  const mod = (await import(pathToFileURL(distPath).href)) as {
    Ajv?: unknown;
    default?: { Ajv?: unknown };
  };
  const Ajv = (mod.Ajv ?? mod.default?.Ajv ?? mod.default) as new (options: object) => {
    compile: (schema: object) => (value: unknown) => boolean;
  };
  return { Ajv };
}

const { writeFile, unlink } = await import('node:fs/promises');

async function buildProbeModule(
  schema: object,
  sample: unknown,
  ajvAccepts: boolean,
  modulePath: string,
): Promise<string> {
  const source = `export const C = {
  name: 'probe/case',
  schemaVersion: '1.0.0',
  schema: { safeParse: () => ({ success: ${JSON.stringify(ajvAccepts)} }) },
  jsonSchema: ${JSON.stringify(schema)},
};
export const conformanceSamples = { 'probe/case': [${JSON.stringify(sample)}] };
`;
  await writeFile(modulePath, source, 'utf8');
  return modulePath;
}

async function cleanupProbeModule(modulePath: string): Promise<void> {
  await unlink(modulePath).catch(() => undefined);
}
