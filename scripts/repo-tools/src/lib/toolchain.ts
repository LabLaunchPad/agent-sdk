import { readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Baseline-toolchain gate.
 *
 * `.context/state/runtime.json` states the rule this enforces verbatim:
 * "A green run on a Node version other than the baseline is not evidence."
 * That rule was previously enforced only by `package.json`'s `engines` field,
 * which `pnpm` checks - so `pnpm validate` was gated, but invoking
 * `node scripts/repo-tools/dist/cli.js validate` directly bypassed it
 * entirely and printed an ordinary PASS. An adversarial pass during the
 * repository integrity audit recorded that as MISSED (see
 * docs/audit/REPOSITORY-INTEGRITY-AUDIT.md, Part K attack 4).
 *
 * A decision-critical entry point must establish its own environment rather
 * than assume a wrapper did it, so the gate lives here, at the executable
 * boundary. `.nvmrc` is the authority: it is what CI's `setup-node`
 * (`node-version-file: .nvmrc`) actually reads, so gating on anything else
 * would check a different thing than CI runs.
 */
export interface ToolchainCheck {
  readonly ok: boolean;
  readonly expected: string;
  readonly actual: string;
}

export async function checkNodeBaseline(rootDir: string): Promise<ToolchainCheck> {
  const actual = process.version.replace(/^v/, '');
  let expected: string;

  try {
    expected = (await readFile(path.join(rootDir, '.nvmrc'), 'utf8')).trim();
  } catch {
    // No .nvmrc means no declared baseline to enforce. Report the fact rather
    // than inventing one; the repository-policy-validator separately requires
    // .nvmrc to exist, so its absence is already a failure elsewhere.
    return { ok: true, expected: '(no .nvmrc)', actual };
  }

  return { ok: expected === actual, expected, actual };
}
