import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  type Finding,
  type ValidatorOptions,
  type ValidatorResult,
  result,
} from '../lib/types.js';
import { collectFiles, exists, sha256OfFile } from '../lib/workspace.js';

export type Freshness = 'ACTIVE' | 'STALE' | 'INVALID' | 'NOT_REQUIRED';

const FRESHNESS_VALUES: readonly Freshness[] = [
  'ACTIVE',
  'STALE',
  'INVALID',
  'NOT_REQUIRED',
];

/**
 * A compiled cache record. Anything in `.context/` carrying a `source` field is
 * treated as one; everything else is state and is only checked for parseability.
 */
interface CacheRecord {
  source?: unknown;
  version?: unknown;
  sha256?: unknown;
  generated_at?: unknown;
  freshness?: unknown;
  summary?: unknown;
}

export interface ContextScanEntry {
  readonly file: string;
  readonly source: string;
  readonly declared: Freshness;
  readonly actual: Freshness;
}

/**
 * Recomputes each cache record's source hash and reports drift.
 *
 * This validator is the only thing standing between `.context/` and decay into
 * a second, quietly wrong source of truth. It is mandatory in CI and never
 * advisory: an agent that trusts a stale summary makes confident decisions from
 * facts that stopped being true.
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
  for (const entry of entries) counts[entry.actual] += 1;

  return result('context-staleness', findings, {
    records: entries.length,
    ACTIVE: counts.ACTIVE,
    STALE: counts.STALE,
    INVALID: counts.INVALID,
    NOT_REQUIRED: counts.NOT_REQUIRED,
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

  for (const file of await collectFiles(contextDir, ['.json'])) {
    const relative = path.relative(rootDir, file);

    let record: CacheRecord;
    try {
      record = JSON.parse(await readFile(file, 'utf8')) as CacheRecord;
    } catch (error) {
      findings.push({
        rule: 'context/malformed-json',
        message: `${relative} is not valid JSON: ${String(error)}`,
        path: relative,
      });
      continue;
    }

    // Files without a `source` are state, not cache records.
    if (typeof record.source !== 'string') continue;

    const declared = FRESHNESS_VALUES.includes(record.freshness as Freshness)
      ? (record.freshness as Freshness)
      : 'INVALID';

    if (declared === 'INVALID') {
      findings.push({
        rule: 'context/invalid-freshness',
        message: `${relative} declares freshness ${JSON.stringify(record.freshness)}; expected one of ${FRESHNESS_VALUES.join(', ')}.`,
        path: relative,
      });
      entries.push({
        file: relative,
        source: record.source,
        declared,
        actual: 'INVALID',
      });
      continue;
    }

    // A deliberately non-required entry is exempt from hash checking, but is
    // still reported so it cannot be used to hide a rotting record.
    if (declared === 'NOT_REQUIRED') {
      entries.push({
        file: relative,
        source: record.source,
        declared,
        actual: 'NOT_REQUIRED',
      });
      continue;
    }

    if (typeof record.sha256 !== 'string' || typeof record.generated_at !== 'string') {
      findings.push({
        rule: 'context/malformed-record',
        message: `${relative} is missing required fields. A cache record carries source, sha256, generated_at and freshness.`,
        path: relative,
      });
      entries.push({
        file: relative,
        source: record.source,
        declared,
        actual: 'INVALID',
      });
      continue;
    }

    const sourcePath = path.join(rootDir, record.source);
    if (!(await exists(sourcePath))) {
      findings.push({
        rule: 'context/source-missing',
        message: `${relative} references ${record.source}, which no longer exists.`,
        path: relative,
      });
      entries.push({
        file: relative,
        source: record.source,
        declared,
        actual: 'INVALID',
      });
      continue;
    }

    const actualHash = await sha256OfFile(sourcePath);
    if (actualHash !== record.sha256) {
      findings.push({
        rule: 'context/stale-record',
        message: `${relative} is STALE: ${record.source} has changed since the summary was compiled. Run \`pnpm context:refresh\` and re-read the source before trusting the summary.`,
        path: relative,
      });
      entries.push({ file: relative, source: record.source, declared, actual: 'STALE' });
      continue;
    }

    entries.push({ file: relative, source: record.source, declared, actual: 'ACTIVE' });
  }

  return { entries, findings };
}

export interface RefreshOutcome {
  readonly refreshed: readonly string[];
  readonly unresolved: readonly string[];
}

/**
 * Rewrites `sha256` and `generated_at` for every stale record and marks it
 * ACTIVE.
 *
 * Explicitly separate from the validator and never run in CI. Auto-refreshing
 * in CI would make the staleness check unfalsifiable — it would rubber-stamp
 * whatever drift had accumulated instead of reporting it.
 */
export async function refreshContext(rootDir: string): Promise<RefreshOutcome> {
  const contextDir = path.join(rootDir, '.context');
  const refreshed: string[] = [];
  const unresolved: string[] = [];

  for (const file of await collectFiles(contextDir, ['.json'])) {
    const relative = path.relative(rootDir, file);
    const raw = await readFile(file, 'utf8');

    let record: CacheRecord;
    try {
      record = JSON.parse(raw) as CacheRecord;
    } catch {
      unresolved.push(relative);
      continue;
    }

    if (typeof record.source !== 'string') continue;
    if (record.freshness === 'NOT_REQUIRED') continue;

    const sourcePath = path.join(rootDir, record.source);
    if (!(await exists(sourcePath))) {
      unresolved.push(relative);
      continue;
    }

    const hash = await sha256OfFile(sourcePath);
    if (hash === record.sha256 && record.freshness === 'ACTIVE') continue;

    const patched = patchEnvelope(raw, {
      sha256: hash,
      generated_at: new Date().toISOString(),
      freshness: 'ACTIVE' satisfies Freshness,
    });

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
 * Replaces envelope scalar values in the file text, preserving its existing
 * formatting.
 *
 * Reserializing the whole record with `JSON.stringify` would expand arrays that
 * the repository formatter collapses, so every refresh would leave
 * `format:check` red and the two tools would fight over the same files forever.
 *
 * The pattern anchors to the two-space indent of top-level envelope keys, so a
 * same-named key nested inside `summary` is never touched. Returns `null` if any
 * field is missing or not a single-line scalar, which the caller surfaces as
 * unresolved rather than silently rewriting.
 */
function patchEnvelope(text: string, values: Record<string, string>): string | null {
  let patched = text;

  for (const [key, value] of Object.entries(values)) {
    const pattern = new RegExp(`^ {2}"${key}": [^\\n]*?(,?)$`, 'm');
    if (!pattern.test(patched)) return null;
    patched = patched.replace(pattern, `  "${key}": ${JSON.stringify(value)}$1`);
  }

  return patched;
}
