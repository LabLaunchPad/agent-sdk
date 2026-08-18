import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { checkNodeBaseline } from '../src/lib/toolchain.js';

/**
 * Closes the one adversarial attack the repository integrity audit recorded as
 * MISSED (docs/audit/REPOSITORY-INTEGRITY-AUDIT.md, Part K attack 4): running
 * the validator CLI directly with `node` on a non-baseline version printed an
 * ordinary PASS, because the baseline was enforced only by `package.json`'s
 * `engines` field - which `pnpm` checks and a direct `node` invocation does
 * not. `.context/state/runtime.json` states the rule this protects: "A green
 * run on a Node version other than the baseline is not evidence."
 */
const created: string[] = [];

async function repoWithNvmrc(contents: string | null): Promise<string> {
  const dir = await mkdtemp(path.join(tmpdir(), 'toolchain-gate-'));
  created.push(dir);
  if (contents !== null) await writeFile(path.join(dir, '.nvmrc'), contents, 'utf8');
  return dir;
}

afterEach(async () => {
  await Promise.all(
    created.splice(0).map((dir) => rm(dir, { recursive: true, force: true })),
  );
});

describe('toolchain baseline gate (§14)', () => {
  it('passes when .nvmrc matches the running Node version', async () => {
    const running = process.version.replace(/^v/, '');
    const check = await checkNodeBaseline(await repoWithNvmrc(`${running}\n`));

    expect(check.ok).toBe(true);
    expect(check.expected).toBe(running);
    expect(check.actual).toBe(running);
  });

  it('BLOCKS when .nvmrc declares a different Node version', async () => {
    // The exact shape of attack 4: a real repository, a real validator run,
    // but an environment whose result cannot be evidence.
    const check = await checkNodeBaseline(await repoWithNvmrc('18.20.4\n'));

    expect(check.ok).toBe(false);
    expect(check.expected).toBe('18.20.4');
    expect(check.actual).toBe(process.version.replace(/^v/, ''));
  });

  it('BLOCKS on a patch-level mismatch, not just a major one', async () => {
    const [major, minor] = process.version.replace(/^v/, '').split('.');
    const check = await checkNodeBaseline(
      await repoWithNvmrc(`${String(major)}.${String(minor)}.999\n`),
    );

    // runtime.json's rule is "other than the baseline", not "close enough".
    expect(check.ok).toBe(false);
  });

  it('tolerates surrounding whitespace in .nvmrc', async () => {
    const running = process.version.replace(/^v/, '');
    const check = await checkNodeBaseline(await repoWithNvmrc(`  ${running}  \n\n`));

    expect(check.ok).toBe(true);
  });

  it('reports no declared baseline rather than inventing one when .nvmrc is absent', async () => {
    const check = await checkNodeBaseline(await repoWithNvmrc(null));

    expect(check.ok).toBe(true);
    expect(check.expected).toBe('(no .nvmrc)');
  });
});
