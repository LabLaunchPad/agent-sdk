import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { derivedProjectionConsistencyValidator } from '../src/validators/derived-projection-consistency.js';
import { parseGeneratedRegions, renderWithFacts } from '../src/lib/generated-regions.js';

const FIXTURES = path.resolve(import.meta.dirname, '../../../tests/fixtures/facts');
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

  it('is a no-op on a file with no GENERATED regions', async () => {
    const result = await derivedProjectionConsistencyValidator({
      rootDir: fixture('no-regions'),
    });
    expect(result.status).toBe('PASS');
    expect(result.stats?.filesWithRegions).toBe(0);
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
