import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  type Finding,
  type ValidatorOptions,
  type ValidatorResult,
  result,
} from '../lib/types.js';
import {
  type TrustTier,
  deriveTrustTier,
  isPlainObject,
  normalizeVerifiedEntries,
  parseFrontmatter,
} from '../lib/okf.js';
import { collectFiles, exists, sha256OfFile } from '../lib/workspace.js';

export type Freshness = 'ACTIVE' | 'STALE' | 'INVALID' | 'NOT_REQUIRED';

/**
 * OKF-scoped reserved filenames are never cache records — they carry no
 * `x_source_sha256` and are exempt from the concept-document rules that
 * `okf-conformance-validator` already enforces separately.
 */
const RESERVED_FILENAMES = ['index.md', 'log.md'];

export interface ContextScanEntry {
  readonly file: string;
  readonly source: string | undefined;
  readonly actual: Freshness;
  readonly trustTier: TrustTier | undefined;
}

/**
 * Recomputes each `.context/` OKF concept's source hash and reports drift, and
 * derives its trust tier from `verified`.
 *
 * This validator is the only thing standing between `.context/` and decay into
 * a second, quietly wrong source of truth. It is mandatory in CI and never
 * advisory: an agent that trusts a stale summary makes confident decisions from
 * facts that stopped being true.
 *
 * Structural OKF conformance (does frontmatter parse, is `type` present) is
 * `okf-conformance-validator`'s job, not this one's — a malformed record is
 * reported by both, from different angles, under different rule namespaces.
 * This validator answers a narrower question: for a `.context/` concept that
 * claims to summarize a source (`x_source_sha256` present), does that claim
 * still hold, and has anyone ever verified it?
 */
export async function contextStalenessValidator(
  options: ValidatorOptions,
): Promise<ValidatorResult> {
  const { entries, findings } = await scanContext(options.rootDir);

  const counts: Record<Freshness, number> = {
    ACTIVE: 0,
    STALE: 0,
    INVALID: 0,
    NOT_REQUIRED: 0,
  };
  const trustCounts: Record<TrustTier, number> = {
    unverified: 0,
    'machine-confirmed': 0,
    'human-reviewed': 0,
  };
  for (const entry of entries) {
    counts[entry.actual] += 1;
    if (entry.trustTier) trustCounts[entry.trustTier] += 1;
  }

  return result('context-staleness', findings, {
    records: entries.length,
    ACTIVE: counts.ACTIVE,
    STALE: counts.STALE,
    INVALID: counts.INVALID,
    NOT_REQUIRED: counts.NOT_REQUIRED,
    unverified: trustCounts.unverified,
    'machine-confirmed': trustCounts['machine-confirmed'],
    'human-reviewed': trustCounts['human-reviewed'],
  });
}

async function scanContext(
  rootDir: string,
): Promise<{ entries: ContextScanEntry[]; findings: Finding[] }> {
  const contextDir = path.join(rootDir, '.context');
  const findings: Finding[] = [];
  const entries: ContextScanEntry[] = [];

  if (!(await exists(contextDir))) {
    return {
      entries,
      findings: [
        {
          rule: 'context/missing-directory',
          message: '.context/ does not exist. The compiled cache is mandatory.',
          path: '.context',
        },
      ],
    };
  }

  for (const file of await collectFiles(contextDir, ['.md'])) {
    if (RESERVED_FILENAMES.includes(path.basename(file))) continue;

    const relative = path.relative(rootDir, file);
    const parsed = parseFrontmatter(await readFile(file, 'utf8'));

    if (!parsed.hasBlock || parsed.data === null) {
      findings.push({
        rule: 'context/malformed-record',
        message: `${relative} has no parseable OKF frontmatter. okf-conformance-validator reports the structural defect; this is the staleness consequence of it — an unreadable record cannot be trusted.`,
        path: relative,
      });
      entries.push({
        file: relative,
        source: undefined,
        actual: 'INVALID',
        trustTier: undefined,
      });
      continue;
    }

    const data = parsed.data;
    const trustTier = deriveVerifiedTrustTier(data);

    if (data.x_required === false) {
      entries.push({
        file: relative,
        source: firstSourceResource(data),
        actual: 'NOT_REQUIRED',
        trustTier,
      });
      continue;
    }

    const sourceResource = firstSourceResource(data);
    const sourceSha256 = data.x_source_sha256;

    if (typeof sourceResource !== 'string' || typeof sourceSha256 !== 'string') {
      findings.push({
        rule: 'context/missing-hash-fields',
        message: `${relative} is a required cache record but is missing sources[0].resource or x_source_sha256 — a compiled summary must declare both, or be marked x_required: false.`,
        path: relative,
      });
      entries.push({
        file: relative,
        source: sourceResource,
        actual: 'INVALID',
        trustTier,
      });
      continue;
    }

    const sourcePath = path.join(rootDir, sourceResource.replace(/^\//, ''));
    if (!(await exists(sourcePath))) {
      findings.push({
        rule: 'context/source-missing',
        message: `${relative} references ${sourceResource}, which no longer exists.`,
        path: relative,
      });
      entries.push({
        file: relative,
        source: sourceResource,
        actual: 'INVALID',
        trustTier,
      });
      continue;
    }

    const actualHash = await sha256OfFile(sourcePath);
    if (actualHash !== sourceSha256) {
      findings.push({
        rule: 'context/stale-record',
        message: `${relative} is STALE: ${sourceResource} has changed since the summary was compiled. Run \`pnpm context:refresh\` and re-read the source before trusting the summary.`,
        path: relative,
      });
      entries.push({
        file: relative,
        source: sourceResource,
        actual: 'STALE',
        trustTier,
      });
      continue;
    }

    const staleAfter = data.stale_after;
    if (typeof staleAfter === 'string' && isPastDate(staleAfter)) {
      findings.push({
        rule: 'context/stale-after-elapsed',
        message: `${relative} is STALE: stale_after (${staleAfter}) has passed. The source hash still matches, but this record is due for re-verification regardless — see docs/agent/RECEIPT-P00.md's note on hash-fresh-but-never-verified drift.`,
        path: relative,
      });
      entries.push({
        file: relative,
        source: sourceResource,
        actual: 'STALE',
        trustTier,
      });
      continue;
    }

    entries.push({ file: relative, source: sourceResource, actual: 'ACTIVE', trustTier });
  }

  return { entries, findings };
}

/** `sources` is a list; the first entry's `resource` is what freshness tracks. */
function firstSourceResource(data: Record<string, unknown>): string | undefined {
  const sources = data.sources;
  if (!Array.isArray(sources) || sources.length === 0) return undefined;
  const first: unknown = sources[0];
  if (!isPlainObject(first)) return undefined;
  const resource = first.resource;
  return typeof resource === 'string' ? resource : undefined;
}

/**
 * Best-effort trust tier. If `verified` is structurally invalid,
 * `okf-conformance-validator` reports that separately — here it degrades to
 * `unverified` rather than raising a second finding for the same defect.
 */
function deriveVerifiedTrustTier(data: Record<string, unknown>): TrustTier {
  const entries = normalizeVerifiedEntries(data.verified);
  return deriveTrustTier(entries ?? []);
}

function isPastDate(dateOnly: string): boolean {
  const parsed = Date.parse(`${dateOnly}T00:00:00Z`);
  if (Number.isNaN(parsed)) return false;
  return parsed <= Date.now();
}

export interface RefreshOutcome {
  readonly refreshed: readonly string[];
  readonly unresolved: readonly string[];
}

/**
 * Rewrites `x_source_sha256` and `generated.at` for every stale record.
 *
 * Explicitly separate from the validator and never run in CI. Auto-refreshing
 * in CI would make the staleness check unfalsifiable — it would rubber-stamp
 * whatever drift had accumulated instead of reporting it.
 *
 * Deliberately does NOT touch `verified` or `status` — refreshing a hash is a
 * mechanical act; marking something verified is not, and must stay a human or
 * explicit reviewer decision. See ADR-0008.
 */
export async function refreshContext(rootDir: string): Promise<RefreshOutcome> {
  const contextDir = path.join(rootDir, '.context');
  const refreshed: string[] = [];
  const unresolved: string[] = [];

  for (const file of await collectFiles(contextDir, ['.md'])) {
    if (RESERVED_FILENAMES.includes(path.basename(file))) continue;

    const relative = path.relative(rootDir, file);
    const raw = await readFile(file, 'utf8');
    const parsed = parseFrontmatter(raw);

    if (!parsed.hasBlock || parsed.data === null) {
      unresolved.push(relative);
      continue;
    }

    const data = parsed.data;
    if (data.x_required === false) continue;

    const sourceResource = firstSourceResource(data);
    if (typeof sourceResource !== 'string') {
      unresolved.push(relative);
      continue;
    }

    const sourcePath = path.join(rootDir, sourceResource.replace(/^\//, ''));
    if (!(await exists(sourcePath))) {
      unresolved.push(relative);
      continue;
    }

    const hash = await sha256OfFile(sourcePath);
    const nowAt = new Date().toISOString();
    const generated = data.generated;
    const alreadyFresh =
      hash === data.x_source_sha256 &&
      isPlainObject(generated) &&
      typeof generated.at === 'string';
    if (alreadyFresh) continue;

    const patched = patchFrontmatter(raw, hash, nowAt);
    if (patched === null) {
      unresolved.push(relative);
      continue;
    }

    await writeFile(file, patched, 'utf8');
    refreshed.push(relative);
  }

  return { refreshed, unresolved };
}

/**
 * Patches `x_source_sha256` (top-level scalar) and `generated.at` (nested,
 * 2-space-indented under `generated:`) within the YAML frontmatter block,
 * leaving the rest of the file — including the markdown body and every other
 * frontmatter field — byte-for-byte untouched.
 *
 * A full re-serialize (`YAML.stringify`) would re-order keys and change
 * quoting style on every refresh, fighting Prettier the same way a naive
 * `JSON.stringify` refresh did in Phase 0. Surgical text patching is what
 * keeps `context:refresh` output formatter-stable.
 *
 * Returns `null` — surfaced as unresolved rather than silently corrupting the
 * file — if `x_source_sha256` is missing or `generated.at` isn't indented
 * exactly two spaces under a `generated:` block, which is the convention
 * every record in this repository follows.
 */
function patchFrontmatter(
  source: string,
  sha256: string,
  generatedAt: string,
): string | null {
  const shaPattern = /^x_source_sha256: [^\n]*$/m;
  const atPattern = /(^generated:\n(?: {2}.*\n)*?)( {2}at: )[^\n]*$/m;

  if (!shaPattern.test(source) || !atPattern.test(source)) return null;

  let patched = source.replace(shaPattern, `x_source_sha256: ${sha256}`);
  patched = patched.replace(
    atPattern,
    (_match, prefix: string, atKey: string) => `${prefix}${atKey}${generatedAt}`,
  );
  return patched;
}
