import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { VALIDATOR_NAMES } from '../src/lib/types.js';

const ROOT = path.resolve(import.meta.dirname, '../../..');

/**
 * The meta-guard for a defect class this repository has now hit once for
 * real: `okf-conformance-validator` existed, passed locally, was part of
 * `pnpm validate`, and was still never executed in CI for a full
 * Workstream because `.github/workflows/ci.yml` simply never named it as
 * a step.
 *
 * "A validator that is not in the execution path is equivalent to no
 * validator." This test makes that a checked invariant rather than
 * something discovered by accident a second time: every name in
 * `VALIDATOR_NAMES` (and the core build/typecheck/lint/format/test
 * stages) must actually appear as an executed step in the authoritative
 * CI workflow.
 */
describe('CI control coverage', () => {
  const ciYaml = readFileSync(path.join(ROOT, '.github/workflows/ci.yml'), 'utf8');

  it('runs every declared validator as an authoritative CI step', () => {
    const missing = VALIDATOR_NAMES.filter(
      (name) => !ciYaml.includes(`validate ${name}`),
    );

    expect(missing).toEqual([]);
  });

  it('runs the core verify pipeline stages', () => {
    const requiredStages = [
      'pnpm build',
      'pnpm typecheck',
      'pnpm lint',
      'pnpm format:check',
      'pnpm test',
    ];
    const missing = requiredStages.filter((stage) => !ciYaml.includes(stage));

    expect(missing).toEqual([]);
  });
});
