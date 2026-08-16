/**
 * @lablaunchpad/contracts — Phase 0 placeholder.
 *
 * This package contains **no agent contracts**. It carries the schema
 * conformance harness that Phase 3 will use to define the real contract kernel,
 * plus one deterministic exported function used as the publication smoke-test
 * target.
 *
 * Canonical wire format is JSON Schema. Zod is the TypeScript runtime
 * representation of it, never the other way round.
 */

export { defineContract, serializeContract } from './harness/define-contract.js';
export type { Contract, DefineContractOptions } from './harness/define-contract.js';

export { checkConformance } from './harness/conformance.js';
export type { ConformanceReport, Disagreement } from './harness/conformance.js';

export { VersionTagSchema, VersionTagContract } from './__scaffold__/version-tag.js';
export type { VersionTag } from './__scaffold__/version-tag.js';

/**
 * Samples `schema-contract-validator` uses to prove each exported contract's
 * JSON Schema projection agrees with its runtime schema, keyed by contract name.
 *
 * Values that must be REJECTED are the half that carries the evidence. A sample
 * set containing only valid values cannot detect a projection that is more
 * permissive than the schema it was derived from — the exact defect that makes
 * a TypeScript consumer and a Python consumer disagree about one contract.
 */
export const conformanceSamples: Readonly<Record<string, readonly unknown[]>> = {
  '__scaffold__/VersionTag': [
    // accepted
    { major: 1, minor: 0, patch: 0 },
    { major: 0, minor: 0, patch: 0 },
    { major: 12, minor: 34, patch: 56 },
    // rejected
    { major: -1, minor: 0, patch: 0 },
    { major: 1.5, minor: 0, patch: 0 },
    { major: 1, minor: 0 },
    { major: 1, minor: 0, patch: 0, extra: true },
    { major: '1', minor: 0, patch: 0 },
    null,
    [],
    'not-an-object',
  ],
};

/**
 * Deterministic function used by `package-exports-validator` to prove that a
 * packed tarball installs into a clean consumer and executes when imported by
 * public package name.
 *
 * It has no SDK semantics and is not part of any contract. Phase 3 removes it
 * once real exported surface exists to smoke-test instead.
 *
 * @scaffold — delete in Phase 3.
 */
export function scaffoldEcho(input: string): string {
  return `@lablaunchpad/contracts:${input}`;
}
