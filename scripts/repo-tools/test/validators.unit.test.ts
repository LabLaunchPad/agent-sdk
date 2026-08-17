import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { contextStalenessValidator } from '../src/validators/context-staleness.js';
import { okfConformanceValidator } from '../src/validators/okf-conformance.js';
import { packageBoundaryValidator } from '../src/validators/package-boundary.js';
import { repositoryPolicyValidator } from '../src/validators/repository-policy.js';
import { researchIntegrityValidator } from '../src/validators/research-integrity.js';
import { schemaContractValidator } from '../src/validators/schema-contract.js';

const FIXTURES = path.resolve(import.meta.dirname, '../../../tests/fixtures');

const fixture = (...segments: string[]): string => path.join(FIXTURES, ...segments);

describe('package-boundary-validator — positive', () => {
  it('accepts a workspace whose dependencies point outward', async () => {
    const result = await packageBoundaryValidator({
      rootDir: fixture('boundaries', 'valid'),
    });

    expect(result.findings).toEqual([]);
    expect(result.status).toBe('PASS');
  });
});

describe('context-staleness-validator — positive', () => {
  it('accepts a record whose hash matches its source', async () => {
    const result = await contextStalenessValidator({
      rootDir: fixture('context', 'valid'),
    });

    expect(result.findings).toEqual([]);
    expect(result.stats?.ACTIVE).toBe(1);
  });

  it('accepts a NOT_REQUIRED record without hashing its source', async () => {
    // A deliberately unmaintained entry must stay visible in the inventory
    // without failing CI — otherwise the only way to silence it is deletion,
    // and deletion hides it.
    const result = await contextStalenessValidator({
      rootDir: fixture('context', 'not-required'),
    });

    expect(result.status).toBe('PASS');
    expect(result.stats?.NOT_REQUIRED).toBe(1);
  });
});

describe('repository-policy-validator — positive', () => {
  it('accepts an adapter document that references rather than restates', async () => {
    const result = await repositoryPolicyValidator({
      rootDir: fixture('policy', 'valid'),
    });

    expect(result.findings).toEqual([]);
    expect(result.status).toBe('PASS');
  });
});

describe('schema-contract-validator — positive', () => {
  it('accepts a projection that faithfully mirrors its runtime schema', async () => {
    const result = await schemaContractValidator({
      rootDir: fixture('schema', 'faithful'),
      modules: [fixture('schema', 'faithful', 'index.js')],
    });

    expect(result.findings).toEqual([]);
    expect(result.stats?.contractsChecked).toBe(1);
    expect(result.stats?.samplesChecked).toBe(6);
  });
});

describe('okf-conformance-validator — positive', () => {
  it('accepts a concept document with valid frontmatter', async () => {
    const result = await okfConformanceValidator({ rootDir: fixture('okf', 'valid') });

    expect(result.findings).toEqual([]);
    expect(result.status).toBe('PASS');
  });
});

describe('okf-conformance-validator — leniency (must NOT reject)', () => {
  // OKF v0.2 is explicit that consumers must not reject unknown `type` values,
  // unknown additional keys, or broken cross-links. A validator stricter than
  // the spec it claims to enforce breaks portability as surely as one that is
  // too lax — these fixtures exist to catch exactly that regression.
  it('accepts an unknown type value, an unknown key, and a broken link', async () => {
    const result = await okfConformanceValidator({
      rootDir: fixture('okf', 'leniency-unknown-type-and-keys'),
    });

    expect(result.findings).toEqual([]);
    expect(result.status).toBe('PASS');
  });

  it('accepts a bare `verified` mapping as a one-element list', async () => {
    const result = await okfConformanceValidator({
      rootDir: fixture('okf', 'leniency-bare-verified'),
    });

    expect(result.findings).toEqual([]);
    expect(result.status).toBe('PASS');
  });

  it('accepts index.md/log.md with and without the one frontmatter field they permit', async () => {
    const result = await okfConformanceValidator({
      rootDir: fixture('okf', 'leniency-reserved-files'),
    });

    expect(result.findings).toEqual([]);
    expect(result.status).toBe('PASS');
  });
});

describe('research-integrity-validator — positive', () => {
  it('accepts a resolvable link and a fully cross-referenced canonical graph', async () => {
    const result = await researchIntegrityValidator({
      rootDir: fixture('research-integrity', 'valid'),
    });

    expect(result.findings).toEqual([]);
    expect(result.status).toBe('PASS');
    expect(result.stats?.linksChecked).toBe(1);
    expect(result.stats?.idsChecked).toBe(15);
  });
});
