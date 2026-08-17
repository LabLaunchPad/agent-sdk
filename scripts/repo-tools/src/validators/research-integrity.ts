import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  type Finding,
  type ValidatorOptions,
  type ValidatorResult,
  result,
} from '../lib/types.js';
import { collectFiles, exists, readJson } from '../lib/workspace.js';

/**
 * The smallest deterministic check this repository's own `.context`
 * verification was actually missing: does an ID an OKF concept or the
 * canonical research graph *references* actually resolve, and does a
 * relative markdown link resolve to a real file.
 *
 * Deliberately narrower than it could be. `okf-conformance-validator` is
 * explicitly required by the OKF v0.2 spec to NOT reject broken cross-links
 * (leniency is part of the spec it enforces) — this validator exists
 * precisely because that leniency leaves a real gap this repository still
 * wants closed, under its own separate rule namespace, not by making
 * okf-conformance stricter than its spec.
 *
 * ID cross-reference checking is scoped to `research/canonical/
 * canonical-research.json` only — the one JSON ledger in this repository
 * with a single, well-defined ID schema (SRC-/CLM-/EVD-/BEN-/GAP- etc.).
 * The many imported-corpus JSON files under `.context/research/{batch}/`
 * each carry their own ad hoc shape from their source corpus; validating
 * those generically would require per-file schema knowledge nobody has
 * asked for and risks false positives on files never meant to follow this
 * shape. See docs/agent/NEXT.md for that as a possible future extension.
 */

interface OkfManifest {
  readonly scopes: readonly string[];
}

const DEFAULT_SCOPES = ['.context', 'research', 'specs', 'ADR'];
const MARKDOWN_LINK_PATTERN = /\[[^\]]*\]\(([^)]+)\)/g;

export async function researchIntegrityValidator(
  options: ValidatorOptions,
): Promise<ValidatorResult> {
  const { rootDir } = options;
  const findings: Finding[] = [];

  const linksChecked = await checkMarkdownLinks(rootDir, findings);
  const idsChecked = await checkCanonicalReferences(rootDir, findings);

  return result('research-integrity', findings, { linksChecked, idsChecked });
}

async function checkMarkdownLinks(rootDir: string, findings: Finding[]): Promise<number> {
  let manifest: OkfManifest;
  try {
    manifest = await readJson<OkfManifest>(path.join(rootDir, 'okf.json'));
  } catch {
    manifest = { scopes: DEFAULT_SCOPES };
  }

  let checked = 0;
  for (const scope of manifest.scopes) {
    const scopeDir = path.join(rootDir, scope);
    if (!(await exists(scopeDir))) continue;

    for (const filePath of await collectFiles(scopeDir, ['.md'])) {
      const relative = path.relative(rootDir, filePath);
      const text = await readFile(filePath, 'utf8');

      for (const match of text.matchAll(MARKDOWN_LINK_PATTERN)) {
        const target = match[1]?.trim();
        if (target === undefined || target === '' || shouldSkipLink(target)) continue;
        checked += 1;

        const withoutAnchor = target.split('#')[0] ?? target;
        if (withoutAnchor === '') continue; // pure in-page anchor, e.g. [text](#section)

        const resolved = withoutAnchor.startsWith('/')
          ? path.join(rootDir, withoutAnchor.slice(1))
          : path.resolve(path.dirname(filePath), withoutAnchor);

        if (!(await exists(resolved))) {
          findings.push({
            rule: 'research-integrity/broken-link',
            message: `${relative}: link target "${target}" does not resolve to a file on disk.`,
            path: relative,
          });
        }
      }
    }
  }
  return checked;
}

function shouldSkipLink(target: string): boolean {
  return (
    target.startsWith('http://') ||
    target.startsWith('https://') ||
    target.startsWith('mailto:') ||
    target.startsWith('#')
  );
}

interface CanonicalGraph {
  readonly sources?: readonly { source_id?: string }[];
  readonly evidence?: readonly { evidence_id?: string; source_id?: string }[];
  readonly ecosystems?: readonly {
    ecosystem_id?: string;
    source_ids?: readonly string[];
  }[];
  readonly claims?: readonly {
    id?: string;
    source_ids?: readonly string[];
    evidence_ids?: readonly string[];
    ecosystem?: string;
  }[];
  readonly versions?: readonly {
    source_ids?: readonly string[];
    ecosystem?: string;
  }[];
  readonly benchmarks?: readonly {
    benchmark_id?: string;
    source_ids?: readonly string[];
  }[];
  readonly security?: readonly { evidence_ids?: readonly string[] }[];
  readonly contradictions?: readonly {
    evidence_a?: readonly string[];
    evidence_b?: readonly string[];
  }[];
  readonly traceability?: {
    readonly decision_to_claim?: Readonly<Record<string, readonly string[]>>;
    readonly claim_to_evidence?: Readonly<Record<string, readonly string[]>>;
    readonly evidence_to_source?: Readonly<Record<string, readonly string[]>>;
    readonly claim_to_benchmark?: Readonly<Record<string, readonly string[]>>;
    readonly gap_to_evidence?: Readonly<Record<string, readonly string[]>>;
  };
}

async function checkCanonicalReferences(
  rootDir: string,
  findings: Finding[],
): Promise<number> {
  const canonicalPath = path.join(
    rootDir,
    'research',
    'canonical',
    'canonical-research.json',
  );
  if (!(await exists(canonicalPath))) return 0;

  const relative = path.relative(rootDir, canonicalPath);
  let graph: CanonicalGraph;
  try {
    graph = await readJson<CanonicalGraph>(canonicalPath);
  } catch (error) {
    findings.push({
      rule: 'research-integrity/unreadable-canonical-graph',
      message: `${relative} could not be parsed as JSON: ${String(error)}`,
      path: relative,
    });
    return 0;
  }

  const isDefined = (value: string | undefined): value is string => value !== undefined;
  const sourceIds = new Set(
    (graph.sources ?? []).map((s) => s.source_id).filter(isDefined),
  );
  const evidenceIds = new Set(
    (graph.evidence ?? []).map((e) => e.evidence_id).filter(isDefined),
  );
  const ecosystemIds = new Set(
    (graph.ecosystems ?? []).map((e) => e.ecosystem_id).filter(isDefined),
  );
  const claimIds = new Set((graph.claims ?? []).map((c) => c.id).filter(isDefined));
  const benchmarkIds = new Set(
    (graph.benchmarks ?? []).map((b) => b.benchmark_id).filter(isDefined),
  );

  let checked = 0;
  const checkRef = (
    ids: readonly (string | undefined)[] | undefined,
    universe: ReadonlySet<string>,
    kind: string,
    context: string,
  ): void => {
    for (const id of ids ?? []) {
      if (id === undefined) continue;
      checked += 1;
      if (!universe.has(id)) {
        findings.push({
          rule: 'research-integrity/broken-reference',
          message: `${relative}: ${context} references ${kind} "${id}", which does not exist in the graph.`,
          path: relative,
        });
      }
    }
  };

  for (const [index, e] of (graph.evidence ?? []).entries()) {
    checkRef([e.source_id], sourceIds, 'source_id', `evidence[${String(index)}]`);
  }
  for (const [index, eco] of (graph.ecosystems ?? []).entries()) {
    checkRef(eco.source_ids, sourceIds, 'source_id', `ecosystems[${String(index)}]`);
  }
  for (const [index, c] of (graph.claims ?? []).entries()) {
    checkRef(c.source_ids, sourceIds, 'source_id', `claims[${String(index)}]`);
    checkRef(c.evidence_ids, evidenceIds, 'evidence_id', `claims[${String(index)}]`);
    if (c.ecosystem !== undefined) {
      checkRef([c.ecosystem], ecosystemIds, 'ecosystem_id', `claims[${String(index)}]`);
    }
  }
  for (const [index, v] of (graph.versions ?? []).entries()) {
    checkRef(v.source_ids, sourceIds, 'source_id', `versions[${String(index)}]`);
    if (v.ecosystem !== undefined) {
      checkRef([v.ecosystem], ecosystemIds, 'ecosystem_id', `versions[${String(index)}]`);
    }
  }
  for (const [index, b] of (graph.benchmarks ?? []).entries()) {
    checkRef(b.source_ids, sourceIds, 'source_id', `benchmarks[${String(index)}]`);
  }
  for (const [index, s] of (graph.security ?? []).entries()) {
    checkRef(s.evidence_ids, evidenceIds, 'evidence_id', `security[${String(index)}]`);
  }
  for (const [index, ctr] of (graph.contradictions ?? []).entries()) {
    checkRef(
      ctr.evidence_a,
      evidenceIds,
      'evidence_id',
      `contradictions[${String(index)}].evidence_a`,
    );
    checkRef(
      ctr.evidence_b,
      evidenceIds,
      'evidence_id',
      `contradictions[${String(index)}].evidence_b`,
    );
  }

  const trace = graph.traceability;
  if (trace) {
    for (const [key, ids] of Object.entries(trace.decision_to_claim ?? {})) {
      checkRef(ids, claimIds, 'claim id', `traceability.decision_to_claim["${key}"]`);
    }
    for (const [key, ids] of Object.entries(trace.claim_to_evidence ?? {})) {
      checkRef(
        ids,
        evidenceIds,
        'evidence_id',
        `traceability.claim_to_evidence["${key}"]`,
      );
    }
    for (const [key, ids] of Object.entries(trace.evidence_to_source ?? {})) {
      checkRef(ids, sourceIds, 'source_id', `traceability.evidence_to_source["${key}"]`);
    }
    for (const [key, ids] of Object.entries(trace.claim_to_benchmark ?? {})) {
      checkRef(
        ids,
        benchmarkIds,
        'benchmark_id',
        `traceability.claim_to_benchmark["${key}"]`,
      );
    }
    for (const [key, ids] of Object.entries(trace.gap_to_evidence ?? {})) {
      checkRef(ids, evidenceIds, 'evidence_id', `traceability.gap_to_evidence["${key}"]`);
    }
  }

  return checked;
}
