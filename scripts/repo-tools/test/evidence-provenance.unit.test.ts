import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { evidenceProvenanceValidator } from '../src/validators/evidence-provenance.js';

const FIXTURES = path.resolve(import.meta.dirname, '../../../tests/fixtures/evidence');
const REPO_ROOT = path.resolve(import.meta.dirname, '../../..');
const fixture = (name: string): string => path.join(FIXTURES, name);

const temporary: string[] = [];
afterAll(async () => {
  await Promise.all(
    temporary.splice(0).map((dir) => rm(dir, { recursive: true, force: true })),
  );
});

/**
 * M4 adversarial matrix (E1-E20). Fixtures live inside this repository's
 * worktree, so `git cat-file` resolves real commit ids against the real object
 * database while fabricated ones fail - which is the property under test.
 *
 * Cases deliberately NOT implemented, with reasons rather than silence:
 *   E3/E4  execution id      - no gate consumes an execution id today; adding a
 *                              required field no decision reads would be
 *                              provenance theatre. Covered indirectly by
 *                              producer.kind + repository.sha.
 *   E9/E10 command / input hashes - same: nothing re-executes a receipt, so a
 *                              recorded command cannot yet be checked against
 *                              anything. Deferred to whenever a gate replays.
 *   E11    "claims PASS but never ran" - not decidable from the artifact alone;
 *                              the repository's existing NOT_EXECUTED label is
 *                              the honest control, and the phase-2 receipt
 *                              already uses it.
 *   E12    receipt not consumed by a gate - CONFIRMED TRUE and unfixable here:
 *                              no executable gate consumes receipts at all
 *                              (M4.2). Recorded as a residual risk, not a test.
 *   E16    duplicate receipt  - a directory cannot hold two files of one name;
 *                              duplication would mean two distinct receipts,
 *                              which is legitimate.
 */
describe('evidence-provenance-validator — provenance identity (M4)', () => {
  it('accepts a receipt whose recorded revision resolves in this repository', async () => {
    const result = await evidenceProvenanceValidator({ rootDir: fixture('valid') });

    expect(result.status).toBe('PASS');
    expect(result.stats?.shaVerified).toBe(1);
  });

  it('E2: BLOCKS a receipt with no repository.sha', async () => {
    const result = await evidenceProvenanceValidator({ rootDir: fixture('missing-sha') });

    expect(result.status).toBe('FAIL');
    expect(result.findings[0]?.rule).toBe('evidence-provenance/missing-sha');
  });

  it('E1/E6: BLOCKS a well-formed revision that does not exist here (fabricated or foreign)', async () => {
    const result = await evidenceProvenanceValidator({
      rootDir: fixture('unresolvable-sha'),
    });

    expect(result.status).toBe('FAIL');
    expect(result.findings[0]?.rule).toBe('evidence-provenance/unresolvable-sha');
  });

  it('BLOCKS an abbreviated revision, which no reader can resolve unambiguously', async () => {
    const result = await evidenceProvenanceValidator({
      rootDir: fixture('malformed-sha'),
    });

    expect(result.status).toBe('FAIL');
    expect(result.findings[0]?.rule).toBe('evidence-provenance/malformed-sha');
  });

  it('ACCEPTS an honestly UNKNOWN revision — recorded ignorance is not a defect', async () => {
    // The distinction this whole validator protects: "we never captured it"
    // must remain sayable, and must look different from "we captured it".
    const result = await evidenceProvenanceValidator({ rootDir: fixture('unknown-sha') });

    expect(result.status).toBe('PASS');
    expect(result.stats?.unknownProvenance).toBe(1);
    expect(result.stats?.shaVerified).toBe(0);
  });

  it('BLOCKS a decision-critical receipt with no provenance block at all', async () => {
    const result = await evidenceProvenanceValidator({
      rootDir: fixture('no-provenance'),
    });

    expect(result.status).toBe('FAIL');
    expect(result.findings[0]?.rule).toBe('evidence-provenance/missing-provenance');
  });

  it('BLOCKS an omitted toolchain, while UNKNOWN would pass', async () => {
    const result = await evidenceProvenanceValidator({
      rootDir: fixture('omitted-toolchain'),
    });

    expect(result.status).toBe('FAIL');
    expect(
      result.findings.some((f) => f.rule === 'evidence-provenance/missing-field'),
    ).toBe(true);
  });

  it('E17: BLOCKS an unparseable receipt rather than skipping it', async () => {
    const result = await evidenceProvenanceValidator({
      rootDir: fixture('malformed-json'),
    });

    expect(result.status).toBe('FAIL');
    expect(result.findings[0]?.rule).toBe('evidence-provenance/unreadable');
  });

  it('is a no-op when no receipts exist', async () => {
    const result = await evidenceProvenanceValidator({ rootDir: fixture('no-receipts') });

    expect(result.status).toBe('PASS');
    expect(result.stats?.receipts).toBe(0);
  });
});

describe('evidence-provenance-validator — freshness is a property of the claim (M4 §10)', () => {
  /**
   * These two cases must build their fixture at run time. A CURRENT_HEAD
   * receipt names whatever HEAD is *now*, so a fixture with a baked-in sha
   * silently rots the moment anyone commits - which is exactly the drift
   * class this repository's controls exist to eliminate, and it was caught
   * here by committing.
   */
  const write = async (scope: string, sha: string): Promise<string> => {
    // Inside the worktree on purpose: the validator resolves a recorded
    // revision with `git cat-file` relative to the root it is given, and a
    // directory under /tmp is not in any repository, so every sha would come
    // back unresolvable and the test would prove nothing about freshness.
    const dir = await mkdtemp(path.join(FIXTURES, '.runtime-'));
    temporary.push(dir);
    await mkdir(path.join(dir, '.context', 'evidence'), { recursive: true });
    await writeFile(
      path.join(dir, '.context', 'evidence', 'r.json'),
      JSON.stringify({
        receipt_id: 'R',
        provenance: {
          claim_scope: scope,
          producer: { kind: 'CI', id: 'x' },
          repository: { sha },
          toolchain: { node: '24.19.0' },
          recorded_at: '2026-08-18',
        },
      }),
      'utf8',
    );
    return dir;
  };

  const git = (args: string): string =>
    execFileSync('git', args.split(' '), { cwd: REPO_ROOT, encoding: 'utf8' }).trim();

  it('E5: BLOCKS a CURRENT_HEAD claim made at an older revision', async () => {
    const result = await evidenceProvenanceValidator({
      rootDir: await write('CURRENT_HEAD', git('rev-parse HEAD~1')),
    });

    expect(result.status).toBe('FAIL');
    expect(result.findings[0]?.rule).toBe('evidence-provenance/stale-current-head-claim');
  });

  it('ACCEPTS a CURRENT_HEAD claim made at HEAD', async () => {
    const result = await evidenceProvenanceValidator({
      rootDir: await write('CURRENT_HEAD', git('rev-parse HEAD')),
    });

    expect(result.status).toBe('PASS');
  });

  it('ACCEPTS a HISTORICAL claim at an old revision — history is not staleness', async () => {
    // The counter-rule that stops this becoming a universal timestamp check: a
    // phase receipt records what happened at a revision, and stays true after
    // later commits. Forcing every receipt to HEAD would destroy that.
    const result = await evidenceProvenanceValidator({
      rootDir: await write('HISTORICAL', git('rev-parse HEAD~1')),
    });

    expect(result.status).toBe('PASS');
  });

  it('BLOCKS an unrecognised claim_scope instead of guessing a freshness policy', async () => {
    const result = await evidenceProvenanceValidator({ rootDir: fixture('bad-scope') });

    expect(result.status).toBe('FAIL');
    expect(result.findings[0]?.rule).toBe('evidence-provenance/invalid-claim-scope');
  });
});

describe('evidence-provenance-validator — local vs CI are not interchangeable (M4 §12)', () => {
  it('E13/E14: BLOCKS a producer kind outside the declared set', async () => {
    const result = await evidenceProvenanceValidator({
      rootDir: fixture('bad-producer'),
    });

    expect(result.status).toBe('FAIL');
    expect(result.findings[0]?.rule).toBe('evidence-provenance/invalid-producer');
  });

  it('requires the real repository receipt to declare its producer kind', async () => {
    const repoRoot = path.resolve(import.meta.dirname, '../../..');
    const result = await evidenceProvenanceValidator({ rootDir: repoRoot });

    expect(result.status).toBe('PASS');
    expect(result.stats?.receipts).toBeGreaterThan(0);
  });
});
