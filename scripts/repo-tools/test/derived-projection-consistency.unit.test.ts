import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { derivedProjectionConsistencyValidator } from '../src/validators/derived-projection-consistency.js';
import { parseGeneratedRegions, renderWithFacts } from '../src/lib/generated-regions.js';

const FIXTURES = path.resolve(import.meta.dirname, '../../../tests/fixtures/facts');
const ROOT = path.resolve(import.meta.dirname, '../../..');
const fixture = (...segments: string[]): string => path.join(FIXTURES, ...segments);

/**
 * Makes the repository integrity audit's mutation experiment
 * (docs/audit/REPOSITORY-INTEGRITY-AUDIT.md, finding A1) permanent: before
 * this validator existed, `pnpm validate` passed 7/7 while `.context/
 * index.md` and `README.md` stated a validator count that did not match
 * reality. Each "Test A-E" case below is a named case from the
 * implementation-authorization prompt's Part E, reproducing that exact
 * shape of defect for a different fact and asserting the validator now
 * catches it.
 */
describe('derived-projection-consistency-validator — mutation tests (Part E)', () => {
  it('Test A: canonical validator_count=7, projection says 6 -> FAILS', async () => {
    const result = await derivedProjectionConsistencyValidator({
      rootDir: fixture('mutated-validator-count-6'),
    });
    expect(result.status).toBe('FAIL');
    expect(result.findings[0]?.rule).toBe('derived-projection-consistency/mismatch');
    expect(result.findings[0]?.message).toContain('canonical: 7');
    expect(result.findings[0]?.message).toContain('observed: 6');
  });

  it('Test B: canonical validator_count=7, projection says 5 -> FAILS', async () => {
    const result = await derivedProjectionConsistencyValidator({
      rootDir: fixture('mutated-validator-count-5'),
    });
    expect(result.status).toBe('FAIL');
    expect(result.findings[0]?.message).toContain('canonical: 7');
    expect(result.findings[0]?.message).toContain('observed: 5');
  });

  it('Test C: canonical phase=P2, projection says P1A -> FAILS', async () => {
    const result = await derivedProjectionConsistencyValidator({
      rootDir: fixture('mutated-phase'),
    });
    expect(result.status).toBe('FAIL');
    expect(result.findings[0]?.message).toContain('fact: phase_id');
    expect(result.findings[0]?.message).toContain('canonical: P2');
    expect(result.findings[0]?.message).toContain('observed: P1A');
  });

  it('Test D: canonical research status=17/17, projection says 9/17 -> FAILS', async () => {
    const result = await derivedProjectionConsistencyValidator({
      rootDir: fixture('mutated-research-status'),
    });
    expect(result.status).toBe('FAIL');
    expect(result.findings[0]?.message).toContain('canonical: 17/17');
    expect(result.findings[0]?.message).toContain('observed: 9/17');
  });

  it('Test E: canonical ADR inventory has 2 entries, projection has a stale 1-entry list -> FAILS', async () => {
    const result = await derivedProjectionConsistencyValidator({
      rootDir: fixture('mutated-adr-inventory'),
    });
    expect(result.status).toBe('FAIL');
    expect(result.findings[0]?.message).toContain('fact: adr_list');
    expect(result.findings[0]?.message).toContain('ADR-0002 Bar Decision');
  });

  it('accepts a projection whose regions match their canonical facts', async () => {
    const result = await derivedProjectionConsistencyValidator({
      rootDir: fixture('valid'),
    });
    expect(result.status).toBe('PASS');
    expect(result.findings).toEqual([]);
    expect(result.stats?.regionsChecked).toBe(1);
  });

  it('is a no-op on a projection that declares no facts', async () => {
    const result = await derivedProjectionConsistencyValidator({
      rootDir: fixture('no-regions'),
    });
    expect(result.status).toBe('PASS');
    expect(result.stats?.regionsChecked).toBe(0);
  });
});

describe('derived-projection-consistency-validator — adversarial: corrupted markers (Part K)', () => {
  it('BLOCKS an unterminated GENERATED:START (marker removed/truncated)', async () => {
    const result = await derivedProjectionConsistencyValidator({
      rootDir: fixture('malformed-unterminated'),
    });
    expect(result.status).toBe('FAIL');
    expect(result.findings[0]?.rule).toBe(
      'derived-projection-consistency/malformed-unterminated',
    );
  });

  it('BLOCKS a GENERATED:END with no matching START', async () => {
    const result = await derivedProjectionConsistencyValidator({
      rootDir: fixture('malformed-unexpected-end'),
    });
    expect(result.status).toBe('FAIL');
    expect(result.findings[0]?.rule).toBe(
      'derived-projection-consistency/malformed-unexpected-end',
    );
  });

  it('BLOCKS a nested GENERATED:START (duplicated/corrupted marker)', async () => {
    const result = await derivedProjectionConsistencyValidator({
      rootDir: fixture('malformed-nested'),
    });
    expect(result.status).toBe('FAIL');
    expect(
      result.findings.some(
        (f) => f.rule === 'derived-projection-consistency/malformed-nested-start',
      ),
    ).toBe(true);
  });

  it('BLOCKS a region referencing a fact id that does not exist', async () => {
    const result = await derivedProjectionConsistencyValidator({
      rootDir: fixture('unknown-fact'),
    });
    expect(result.status).toBe('FAIL');
    expect(result.findings[0]?.rule).toBe('derived-projection-consistency/unknown-fact');
  });
});

/**
 * Registry semantics (§12). The first implementation scanned every `.md` file,
 * which meant documentation explaining the marker convention was parsed as a
 * control artifact - and the "fix" applied at the time was to reword the
 * documentation until the tool passed. These cases pin the corrected model:
 * the registry decides what is a control artifact, in both directions.
 */
describe('derived-projection-consistency-validator — projection registry (§12)', () => {
  it('BLOCKS when projections.json is absent (no registry = nothing checked)', async () => {
    const result = await derivedProjectionConsistencyValidator({
      rootDir: fixture('registry-missing'),
    });
    expect(result.status).toBe('FAIL');
    expect(result.findings[0]?.rule).toBe(
      'derived-projection-consistency/registry-missing',
    );
  });

  it('BLOCKS a declared fact whose region was deleted from the file', async () => {
    const result = await derivedProjectionConsistencyValidator({
      rootDir: fixture('missing-region'),
    });
    expect(result.status).toBe('FAIL');
    expect(result.findings[0]?.rule).toBe(
      'derived-projection-consistency/missing-region',
    );
    expect(result.findings[0]?.message).toContain('validator_count');
  });

  it('BLOCKS a region whose fact is not declared for that projection', async () => {
    const result = await derivedProjectionConsistencyValidator({
      rootDir: fixture('undeclared-region'),
    });
    expect(result.status).toBe('FAIL');
    expect(
      result.findings.some(
        (f) => f.rule === 'derived-projection-consistency/undeclared-region',
      ),
    ).toBe(true);
  });

  it('pins registry membership so a projection cannot be silenced by de-registering it', async () => {
    // Adversarial pass found this: the registry closes the scan-based defect
    // but becomes an unprotected surface itself - deleting an entry from
    // projections.json silences that projection and no validator notices,
    // because the validator can only check what the registry declares. This
    // meta-guard is the same shape as ci-coverage.unit.test.ts's "a validator
    // not in the execution path is equivalent to no validator".
    const registry = JSON.parse(
      await readFile(path.join(ROOT, 'projections.json'), 'utf8'),
    ) as { projections: { id: string; file: string; facts: string[] }[] };

    const byFile = new Map(registry.projections.map((p) => [p.file, p]));

    // The three agent-facing surfaces that actually drifted in the incident
    // this whole control exists to prevent. Removing any is a deliberate
    // decision that must break CI and be argued for, not a silent edit.
    for (const [file, requiredFacts] of [
      ['.context/index.md', ['phase_id', 'validator_count']],
      ['README.md', ['phase_id', 'validator_count']],
      ['docs/agent/STATE.md', ['phase_id', 'validator_count']],
    ] as const) {
      const entry = byFile.get(file);
      expect(entry, `projections.json must register ${file}`).toBeDefined();
      for (const factId of requiredFacts) {
        expect(entry?.facts, `${file} must declare fact ${factId}`).toContain(factId);
      }
    }
  });

  it('IGNORES marker syntax in an unregistered file, even with a wrong value', async () => {
    // EXPLAINER.md contains a region claiming 999 validators. It is not
    // registered, so it is prose about the convention - not a claim about the
    // repository. Documentation must be able to describe the mechanism without
    // being bent to satisfy it.
    const result = await derivedProjectionConsistencyValidator({
      rootDir: fixture('unregistered-file-with-marker'),
    });
    expect(result.status).toBe('PASS');
    expect(result.stats?.regionsChecked).toBe(1);
  });
});

describe('generated-regions — parser/renderer unit tests', () => {
  it('round-trips: render then re-parse yields the rendered value as content', () => {
    const text = 'X = <!-- GENERATED:START fact=foo -->old<!-- GENERATED:END --> end.';
    const next = renderWithFacts(text, new Map([['foo', 'new']]));
    expect(next).toBe(
      'X = <!-- GENERATED:START fact=foo -->new<!-- GENERATED:END --> end.',
    );

    const reparsed = parseGeneratedRegions(next);
    expect(reparsed.errors).toEqual([]);
    expect(reparsed.regions[0]?.content).toBe('new');
  });

  it('renderWithFacts refuses to render over a malformed region rather than guessing', () => {
    const text = '<!-- GENERATED:START fact=foo -->no end marker';
    expect(() => renderWithFacts(text, new Map([['foo', 'x']]))).toThrow(/malformed/);
  });

  it('renderWithFacts refuses to render an unregistered fact id', () => {
    const text = '<!-- GENERATED:START fact=foo -->x<!-- GENERATED:END -->';
    expect(() => renderWithFacts(text, new Map())).toThrow(/unknown fact/);
  });

  it('handles multiple independent regions in one document', () => {
    const text =
      'A=<!-- GENERATED:START fact=a -->1<!-- GENERATED:END --> B=<!-- GENERATED:START fact=b -->2<!-- GENERATED:END -->';
    const { regions, errors } = parseGeneratedRegions(text);
    expect(errors).toEqual([]);
    expect(regions.map((r) => [r.factId, r.content])).toEqual([
      ['a', '1'],
      ['b', '2'],
    ]);
  });
});
