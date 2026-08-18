import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { readJson } from './workspace.js';

/**
 * A canonical fact: one question about the repository with exactly one
 * authoritative, mechanically computed answer.
 *
 * This registry exists to close a specific, demonstrated defect class (see
 * docs/audit/REPOSITORY-INTEGRITY-AUDIT.md, finding A1-A3): hand-maintained
 * prose in `.context/index.md`, `README.md` and `docs/agent/STATE.md`
 * disagreed with executable repository truth, and the seven pre-existing
 * validators could not detect it because none of them compared a prose
 * claim to the fact it claimed to describe.
 *
 * Deliberately NOT a generic database. Every entry here corresponds to a
 * fact that was proven, by audit, to have multiple hand-maintained
 * projections and to have actually drifted. Do not add an entry merely
 * because a sentence could theoretically be generated - see AGENTS.md's
 * "do not add complexity without evidence" posture, and this repository's
 * own "no dependency is not automatically better" symmetric rule.
 */
export interface FactDefinition {
  readonly id: string;
  /** Human-readable description of where the value comes from, for error messages. */
  readonly authority: string;
  /** Computes the exact canonical text a generated region for this fact must contain. */
  readonly compute: (rootDir: string) => Promise<string>;
}

interface ProjectState {
  readonly phase: { readonly id: string; readonly status: string };
}

interface ResearchGaps {
  readonly remaining_primary: readonly unknown[];
  readonly remaining_protocols: readonly unknown[];
}

const ORIGINAL_BRIEF_TOTAL = 17;

async function countValidatorFiles(rootDir: string): Promise<number> {
  const dir = path.join(rootDir, 'scripts/repo-tools/src/validators');
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile() && entry.name.endsWith('.ts')).length;
}

async function countBenchmarkRuns(rootDir: string): Promise<number> {
  const dir = path.join(rootDir, 'benchmarks');
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return 0;
  }
  let count = 0;
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    try {
      await readJson(path.join(dir, entry.name, 'runs', 'summary.json'));
      count += 1;
    } catch {
      // No executed run recorded for this benchmark; do not count it.
    }
  }
  return count;
}

interface AdrRecord {
  readonly id: string;
  readonly title: string;
}

const ADR_FILENAME = /^(\d{4})-.*\.md$/;
const FRONTMATTER_TITLE = /^title:\s*(.+)$/m;

async function readAdrList(rootDir: string): Promise<AdrRecord[]> {
  const dir = path.join(rootDir, 'ADR');
  const entries = await readdir(dir, { withFileTypes: true });
  const records: AdrRecord[] = [];

  for (const entry of entries) {
    const match = ADR_FILENAME.exec(entry.name);
    if (!entry.isFile() || !match) continue;
    const number = match[1];
    if (number === undefined) continue;

    const text = await readFile(path.join(dir, entry.name), 'utf8');
    const titleMatch = FRONTMATTER_TITLE.exec(text);
    const title = titleMatch?.[1]?.trim() ?? '(untitled)';
    records.push({ id: `ADR-${number}`, title });
  }

  records.sort((a, b) => a.id.localeCompare(b.id));
  return records;
}

export const FACTS: readonly FactDefinition[] = [
  {
    id: 'validator_count',
    authority: 'scripts/repo-tools/src/validators/*.ts (file count)',
    compute: async (rootDir) => String(await countValidatorFiles(rootDir)),
  },
  {
    id: 'phase_id',
    authority: '.context/state/project.json#phase.id',
    compute: async (rootDir) => {
      const state = await readJson<ProjectState>(
        path.join(rootDir, '.context/state/project.json'),
      );
      return state.phase.id;
    },
  },
  {
    id: 'phase_status',
    authority: '.context/state/project.json#phase.status',
    compute: async (rootDir) => {
      const state = await readJson<ProjectState>(
        path.join(rootDir, '.context/state/project.json'),
      );
      return state.phase.status;
    },
  },
  {
    id: 'adr_list',
    authority: 'ADR/[0-9]*.md (frontmatter title, filename-ordered)',
    compute: async (rootDir) => {
      const records = await readAdrList(rootDir);
      return records.map((record) => `${record.id} ${record.title}`).join(' · ');
    },
  },
  {
    id: 'adr_count',
    authority: 'ADR/[0-9]*.md (file count)',
    compute: async (rootDir) => String((await readAdrList(rootDir)).length),
  },
  {
    id: 'research_brief_status',
    authority:
      '.context/research/gaps.json#remaining_primary + #remaining_protocols ' +
      `(original brief size fixed at ${String(ORIGINAL_BRIEF_TOTAL)} by research/README.md)`,
    compute: async (rootDir) => {
      const gaps = await readJson<ResearchGaps>(
        path.join(rootDir, '.context/research/gaps.json'),
      );
      const remaining = gaps.remaining_primary.length + gaps.remaining_protocols.length;
      const researched = ORIGINAL_BRIEF_TOTAL - remaining;
      return `${String(researched)}/${String(ORIGINAL_BRIEF_TOTAL)}`;
    },
  },
  {
    id: 'benchmark_run_count',
    authority: 'benchmarks/*/runs/summary.json (existing and parseable)',
    compute: async (rootDir) => String(await countBenchmarkRuns(rootDir)),
  },
];

const FACTS_BY_ID = new Map(FACTS.map((fact) => [fact.id, fact]));

export function getFact(id: string): FactDefinition | undefined {
  return FACTS_BY_ID.get(id);
}

/** Computes every registered fact's current canonical value. */
export async function computeAllFacts(
  rootDir: string,
): Promise<ReadonlyMap<string, string>> {
  const values = new Map<string, string>();
  for (const fact of FACTS) {
    values.set(fact.id, await fact.compute(rootDir));
  }
  return values;
}
