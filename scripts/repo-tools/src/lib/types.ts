/** Deterministic exit codes. Consumed by CI; do not renumber. */
export const EXIT_OK = 0;
export const EXIT_VALIDATION_FAILED = 1;
export const EXIT_USAGE_ERROR = 2;

export type ValidatorName =
  | 'schema-contract'
  | 'package-boundary'
  | 'context-staleness'
  | 'okf-conformance'
  | 'package-exports'
  | 'repository-policy'
  | 'research-integrity'
  | 'derived-projection-consistency';

export const VALIDATOR_NAMES: readonly ValidatorName[] = [
  'schema-contract',
  'package-boundary',
  'context-staleness',
  'okf-conformance',
  'package-exports',
  'repository-policy',
  'research-integrity',
  'derived-projection-consistency',
];

export interface Finding {
  /** Stable machine-readable rule id, e.g. `boundary/inward-dependency`. */
  readonly rule: string;
  /** Human-readable failure message. States what is wrong and where. */
  readonly message: string;
  /** Repository-relative path the finding anchors to, when it has one. */
  readonly path?: string;
}

export interface ValidatorResult {
  readonly validator: ValidatorName;
  readonly status: 'PASS' | 'FAIL';
  readonly findings: readonly Finding[];
  /** Free-form counters surfaced in output, e.g. entries scanned by freshness. */
  readonly stats?: Readonly<Record<string, number | string>>;
}

export interface ValidatorOptions {
  /** Repository root the validator runs against. Fixtures pass their own root. */
  readonly rootDir: string;
}

export function pass(
  validator: ValidatorName,
  stats?: Record<string, number | string>,
): ValidatorResult {
  return stats
    ? { validator, status: 'PASS', findings: [], stats }
    : { validator, status: 'PASS', findings: [] };
}

export function result(
  validator: ValidatorName,
  findings: readonly Finding[],
  stats?: Record<string, number | string>,
): ValidatorResult {
  const status = findings.length === 0 ? 'PASS' : 'FAIL';
  return stats ? { validator, status, findings, stats } : { validator, status, findings };
}
