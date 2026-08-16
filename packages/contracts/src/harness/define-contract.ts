import { z } from 'zod';

/**
 * A contract pairs a Zod schema (the TypeScript runtime representation) with
 * its JSON Schema projection (the canonical, language-neutral wire format).
 *
 * The projection is derived, never hand-written. TypeScript is one
 * implementation of the contract; JSON Schema is the contract. Future Python or
 * Go bindings target the projection, not this module.
 */
export interface Contract<TOutput> {
  /** Stable identifier. Part of the contract's identity across languages. */
  readonly name: string;
  /**
   * Schema version, independent of the package version that ships it.
   * See docs/architecture/VERSIONING.md.
   */
  readonly schemaVersion: string;
  /** Runtime representation used by TypeScript consumers. */
  readonly schema: z.ZodType<TOutput>;
  /** Canonical wire format, derived from `schema`. */
  readonly jsonSchema: Readonly<Record<string, unknown>>;
}

export interface DefineContractOptions<TOutput> {
  readonly name: string;
  readonly schemaVersion: string;
  readonly schema: z.ZodType<TOutput>;
}

/**
 * Draft-07 is used for the projection because it is the most widely supported
 * JSON Schema dialect across language ecosystems, which is the entire point of
 * having a language-neutral wire format.
 */
const JSON_SCHEMA_TARGET = 'draft-7' as const;

export function defineContract<TOutput>(
  options: DefineContractOptions<TOutput>,
): Contract<TOutput> {
  const jsonSchema = z.toJSONSchema(options.schema, {
    target: JSON_SCHEMA_TARGET,
  }) as Record<string, unknown>;

  return Object.freeze({
    name: options.name,
    schemaVersion: options.schemaVersion,
    schema: options.schema,
    jsonSchema: Object.freeze(jsonSchema),
  });
}

/**
 * JSON Schema keywords whose array value is semantically a *set* — reordering
 * them does not change what the schema accepts.
 *
 * Deliberately narrow. `prefixItems`, `allOf`, `anyOf` and `oneOf` are left in
 * declared order: sorting them would change positional meaning or error
 * reporting, and a canonicalizer that quietly rewrites semantics is worse than
 * one that occasionally reports a spurious diff.
 */
const ORDER_INSENSITIVE_KEYWORDS: ReadonlySet<string> = new Set([
  'required',
  'enum',
  'type',
]);

/**
 * Keywords whose value is user data rather than schema structure. Array order
 * inside them is the author's data and must survive canonicalization intact.
 */
const LITERAL_VALUE_KEYWORDS: ReadonlySet<string> = new Set([
  'default',
  'const',
  'examples',
]);

/**
 * Deterministic serialization of a contract's wire format, used for hashing.
 *
 * Two properties matter here:
 *
 * 1. Object keys are emitted sorted, so insertion order never affects the hash.
 * 2. Set-valued keywords are sorted, so declaring `{ alpha, beta }` and
 *    `{ beta, alpha }` — which produce identical JSON Schema semantics but
 *    differently ordered `required` arrays — hash identically.
 *
 * Without (2), reordering two fields in a schema would invalidate every cache
 * entry derived from it while changing nothing a consumer can observe.
 */
export function serializeContract<TOutput>(contract: Contract<TOutput>): string {
  return JSON.stringify(
    canonicalize(
      {
        name: contract.name,
        schemaVersion: contract.schemaVersion,
        jsonSchema: contract.jsonSchema,
      },
      false,
    ),
  );
}

function canonicalize(value: unknown, insideLiteral: boolean): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => canonicalize(entry, insideLiteral));
  }
  if (value === null || typeof value !== 'object') {
    return value;
  }

  const source = value as Record<string, unknown>;
  const canonical: Record<string, unknown> = {};

  for (const key of Object.keys(source).sort()) {
    const literal = insideLiteral || LITERAL_VALUE_KEYWORDS.has(key);
    const child = canonicalize(source[key], literal);

    canonical[key] =
      !literal && ORDER_INSENSITIVE_KEYWORDS.has(key) && Array.isArray(child)
        ? sortBySerialization(child)
        : child;
  }

  return canonical;
}

function sortBySerialization(entries: readonly unknown[]): unknown[] {
  // Entries originate from `z.toJSONSchema`, so they are always JSON-serializable.
  return [...entries].sort((left, right) => {
    const a = JSON.stringify(left);
    const b = JSON.stringify(right);
    return a < b ? -1 : a > b ? 1 : 0;
  });
}
