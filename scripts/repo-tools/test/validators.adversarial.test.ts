import path from 'node:path';
import { describe, expect, it } from 'vitest';
import type { ValidatorResult } from '../src/lib/types.js';
import { contextStalenessValidator } from '../src/validators/context-staleness.js';
import { okfConformanceValidator } from '../src/validators/okf-conformance.js';
import { packageBoundaryValidator } from '../src/validators/package-boundary.js';
import { packageExportsValidator } from '../src/validators/package-exports.js';
import { repositoryPolicyValidator } from '../src/validators/repository-policy.js';
import { schemaContractValidator } from '../src/validators/schema-contract.js';

/**
 * Every validator must prove it REJECTS its negative fixture.
 *
 * "The validator ran" is not evidence. A checker that silently accepts
 * everything passes exactly the same green CI as one that works, and is
 * discovered only when it fails to catch the defect it was written for.
 */

const FIXTURES = path.resolve(import.meta.dirname, '../../../tests/fixtures');
const fixture = (...segments: string[]): string => path.join(FIXTURES, ...segments);

const rules = (result: ValidatorResult): string[] =>
  result.findings.map((finding) => finding.rule);

describe('package-boundary-validator — negative fixtures', () => {
  it('rejects a dependency that points inward', async () => {
    const result = await packageBoundaryValidator({
      rootDir: fixture('boundaries', 'inward-dependency'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('boundary/inward-dependency');
  });

  it('rejects a node: import in a runtime-neutral package', async () => {
    const result = await packageBoundaryValidator({
      rootDir: fixture('boundaries', 'node-import'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('boundary/node-import-in-neutral-package');
  });

  it('rejects a relative import missing its .js extension', async () => {
    const result = await packageBoundaryValidator({
      rootDir: fixture('boundaries', 'missing-extension'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('boundary/missing-esm-extension');
  });

  it('rejects a vendor SDK dependency below the adapters layer', async () => {
    const result = await packageBoundaryValidator({
      rootDir: fixture('boundaries', 'vendor-in-core'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('boundary/vendor-in-core');
  });

  it('rejects a package that exists on disk but is unregistered', async () => {
    const result = await packageBoundaryValidator({
      rootDir: fixture('boundaries', 'unregistered'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('boundary/unregistered-package');
  });
});

describe('context-staleness-validator — negative fixtures', () => {
  it('rejects a record whose source changed after compilation', async () => {
    const result = await contextStalenessValidator({
      rootDir: fixture('context', 'stale'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('context/stale-record');
    expect(result.stats?.STALE).toBe(1);
  });

  it('rejects a record whose source no longer exists', async () => {
    const result = await contextStalenessValidator({
      rootDir: fixture('context', 'source-missing'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('context/source-missing');
  });

  it('rejects a record missing x_source_sha256', async () => {
    const result = await contextStalenessValidator({
      rootDir: fixture('context', 'malformed'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('context/missing-hash-fields');
  });

  it('rejects a record whose frontmatter does not parse as YAML', async () => {
    // The exact defect class caught live in ADR-0004 during this migration: an
    // unquoted `@` at the start of a plain scalar is invalid YAML.
    const result = await contextStalenessValidator({
      rootDir: fixture('context', 'malformed-frontmatter'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('context/malformed-record');
  });

  it('rejects a record whose stale_after date has elapsed, even with a matching hash', async () => {
    const result = await contextStalenessValidator({
      rootDir: fixture('context', 'stale-after-elapsed'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('context/stale-after-elapsed');
  });
});

describe('okf-conformance-validator — negative fixtures', () => {
  it('rejects a concept document with no type field', async () => {
    const result = await okfConformanceValidator({
      rootDir: fixture('okf', 'missing-type'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('okf/missing-type');
  });

  it('rejects a concept document with no frontmatter block at all', async () => {
    const result = await okfConformanceValidator({
      rootDir: fixture('okf', 'no-frontmatter'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('okf/missing-frontmatter');
  });

  it('rejects a frontmatter block that does not parse as YAML', async () => {
    const result = await okfConformanceValidator({
      rootDir: fixture('okf', 'malformed-frontmatter'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('okf/malformed-frontmatter');
  });

  it('rejects a status value outside draft/stable/deprecated', async () => {
    const result = await okfConformanceValidator({
      rootDir: fixture('okf', 'invalid-status'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('okf/invalid-status');
  });

  it('rejects a stale_after value that is not a YYYY-MM-DD date', async () => {
    const result = await okfConformanceValidator({
      rootDir: fixture('okf', 'invalid-stale-after'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('okf/invalid-stale-after');
  });

  it('rejects a generated.by actor that matches none of the three conventions', async () => {
    const result = await okfConformanceValidator({
      rootDir: fixture('okf', 'invalid-generated'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('okf/invalid-generated-by');
  });

  it('rejects a verified field that is neither a mapping nor a list of mappings', async () => {
    const result = await okfConformanceValidator({
      rootDir: fixture('okf', 'invalid-verified'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('okf/invalid-verified');
  });
});

describe('repository-policy-validator — negative fixtures', () => {
  it('rejects an adapter that repeats a canonical section heading', async () => {
    const result = await repositoryPolicyValidator({
      rootDir: fixture('policy', 'duplicate-heading'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('policy/adapter-duplicates-canonical-heading');
  });

  it('rejects an adapter that restates canonical prose verbatim', async () => {
    const result = await repositoryPolicyValidator({
      rootDir: fixture('policy', 'duplicate-text'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('policy/adapter-duplicates-canonical-text');
  });

  it('rejects a package outside the org namespace', async () => {
    const result = await repositoryPolicyValidator({
      rootDir: fixture('policy', 'namespace-violation'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('policy/namespace-violation');
  });

  it('rejects a repository missing required structure', async () => {
    const result = await repositoryPolicyValidator({
      rootDir: fixture('policy', 'missing-structure'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('policy/missing-directory');
    expect(rules(result)).toContain('policy/missing-file');
  });
});

describe('schema-contract-validator — negative fixtures', () => {
  it('rejects a projection more permissive than its runtime schema', async () => {
    // The defect that makes a TypeScript consumer and a Python consumer
    // disagree about one contract. Invisible to any test that feeds in only
    // valid data.
    const result = await schemaContractValidator({
      rootDir: fixture('schema', 'leaky'),
      modules: [fixture('schema', 'leaky', 'index.js')],
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('schema/projection-disagreement');
  });

  it('rejects a contract that declares no conformance samples', async () => {
    const result = await schemaContractValidator({
      rootDir: fixture('schema', 'no-samples'),
      modules: [fixture('schema', 'no-samples', 'index.js')],
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('schema/no-conformance-samples');
  });

  it('rejects a non-semver schema version', async () => {
    const result = await schemaContractValidator({
      rootDir: fixture('schema', 'bad-version'),
      modules: [fixture('schema', 'bad-version', 'index.js')],
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('schema/invalid-version');
  });
});

describe('package-exports-validator — negative fixtures', () => {
  it('rejects a published package with no smoke declaration', async () => {
    const result = await packageExportsValidator({
      rootDir: fixture('exports', 'no-smoke'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('exports/no-smoke-declaration');
  });

  it('rejects a published package that was never built', async () => {
    const result = await packageExportsValidator({
      rootDir: fixture('exports', 'not-built'),
    });

    expect(result.status).toBe('FAIL');
    expect(rules(result)).toContain('exports/not-built');
  });
});
