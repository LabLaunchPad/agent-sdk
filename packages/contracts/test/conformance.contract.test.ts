import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  VersionTagContract,
  checkConformance,
  defineContract,
  scaffoldEcho,
  serializeContract,
} from '../src/index.js';

describe('defineContract', () => {
  it('derives a JSON Schema projection from the Zod schema', () => {
    expect(VersionTagContract.jsonSchema).toMatchObject({ type: 'object' });
    expect(VersionTagContract.name).toBe('__scaffold__/VersionTag');
    expect(VersionTagContract.schemaVersion).toBe('1.0.0');
  });

  it('serializes deterministically regardless of property declaration order', () => {
    // Reordering fields changes nothing a consumer can observe, so it must not
    // change the hash — otherwise every derived cache entry invalidates for no
    // reason. This is what ORDER_INSENSITIVE_KEYWORDS exists for.
    const a = defineContract({
      name: 'ordering',
      schemaVersion: '1.0.0',
      schema: z.object({ alpha: z.string(), beta: z.string() }).strict(),
    });
    const b = defineContract({
      name: 'ordering',
      schemaVersion: '1.0.0',
      schema: z.object({ beta: z.string(), alpha: z.string() }).strict(),
    });

    expect(serializeContract(a)).toBe(serializeContract(b));
  });

  it('does not canonicalize away a real semantic difference', () => {
    const required = defineContract({
      name: 'shape',
      schemaVersion: '1.0.0',
      schema: z.object({ alpha: z.string() }).strict(),
    });
    const optional = defineContract({
      name: 'shape',
      schemaVersion: '1.0.0',
      schema: z.object({ alpha: z.string().optional() }).strict(),
    });

    expect(serializeContract(required)).not.toBe(serializeContract(optional));
  });

  it('preserves order inside literal value keywords', () => {
    // `default` carries user data, not schema structure. Sorting arrays there
    // would silently rewrite the author's value.
    const contract = defineContract({
      name: 'literal',
      schemaVersion: '1.0.0',
      schema: z.object({ items: z.array(z.string()).default(['b', 'a']) }).strict(),
    });

    expect(serializeContract(contract)).toContain('["b","a"]');
  });
});

describe('checkConformance', () => {
  it('reports agreement between Zod and JSON Schema on valid and invalid samples', () => {
    const report = checkConformance(VersionTagContract, [
      // must be accepted
      { major: 1, minor: 0, patch: 0 },
      { major: 0, minor: 0, patch: 0 },
      // must be rejected — the half that actually proves something
      { major: -1, minor: 0, patch: 0 },
      { major: 1.5, minor: 0, patch: 0 },
      { major: 1, minor: 0 },
      { major: 1, minor: 0, patch: 0, extra: true },
      { major: '1', minor: 0, patch: 0 },
      null,
      [],
    ]);

    expect(report.disagreements).toEqual([]);
    expect(report.agrees).toBe(true);
    expect(report.serializationStable).toBe(true);
  });

  it('detects a projection that is more permissive than its schema', () => {
    // A Zod refinement has no JSON Schema equivalent, so the projection accepts
    // values the schema rejects. This is the exact defect class the harness
    // exists to surface, and it must not pass silently.
    const leaky = defineContract({
      name: 'leaky',
      schemaVersion: '1.0.0',
      schema: z.object({ value: z.string().refine((v) => v.startsWith('ok')) }).strict(),
    });

    const report = checkConformance(leaky, [{ value: 'nope' }]);

    expect(report.agrees).toBe(false);
    expect(report.disagreements).toHaveLength(1);
    expect(report.disagreements[0]).toMatchObject({
      zodAccepts: false,
      jsonSchemaAccepts: true,
    });
  });
});

describe('scaffoldEcho', () => {
  it('is deterministic', () => {
    expect(scaffoldEcho('x')).toBe('@lablaunchpad/contracts:x');
    expect(scaffoldEcho('x')).toBe(scaffoldEcho('x'));
  });
});
