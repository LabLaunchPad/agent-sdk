import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getFact } from './facts.js';
import { parseGeneratedRegions, renderWithFacts } from './generated-regions.js';
import { exists, readJson } from './workspace.js';

export interface WriteFactsOutcome {
  readonly updated: readonly string[];
  readonly unchanged: readonly string[];
  readonly failed: readonly { readonly file: string; readonly error: string }[];
}

interface ProjectionEntry {
  readonly id: string;
  readonly file: string;
  readonly facts: readonly string[];
}

interface ProjectionRegistry {
  readonly projections: readonly ProjectionEntry[];
}

/**
 * Regenerates the generated regions of every projection registered in
 * `projections.json`. Reads the same registry as
 * `derived-projection-consistency-validator` on purpose: a generator and a
 * checker that discover their targets by different means can disagree about
 * what is covered, which would reintroduce the drift class both exist to
 * close.
 *
 * Local-only command - never runs in CI, matching `context refresh`'s existing
 * rule for the identical reason: auto-regeneration in CI would rubber-stamp
 * drift into agreement instead of reporting it.
 */
export async function writeFacts(rootDir: string): Promise<WriteFactsOutcome> {
  const updated: string[] = [];
  const unchanged: string[] = [];
  const failed: { file: string; error: string }[] = [];

  const registryPath = path.join(rootDir, 'projections.json');
  if (!(await exists(registryPath))) {
    return {
      updated,
      unchanged,
      failed: [{ file: 'projections.json', error: 'registry does not exist' }],
    };
  }

  let registry: ProjectionRegistry;
  try {
    registry = await readJson<ProjectionRegistry>(registryPath);
  } catch (error) {
    return {
      updated,
      unchanged,
      failed: [{ file: 'projections.json', error: `unparseable: ${String(error)}` }],
    };
  }

  for (const entry of registry.projections) {
    const absolute = path.join(rootDir, entry.file);
    if (!(await exists(absolute))) {
      failed.push({ file: entry.file, error: 'registered file does not exist' });
      continue;
    }

    const text = await readFile(absolute, 'utf8');
    const { regions, errors } = parseGeneratedRegions(text);

    if (errors.length > 0) {
      failed.push({
        file: entry.file,
        error: `malformed region(s): ${errors.map((error) => error.kind).join(', ')}`,
      });
      continue;
    }
    if (regions.length === 0) continue;

    const values = new Map<string, string>();
    let ok = true;

    for (const factId of new Set(regions.map((region) => region.factId))) {
      if (!entry.facts.includes(factId)) {
        failed.push({
          file: entry.file,
          error: `region for fact "${factId}" is not declared for projection "${entry.id}" in projections.json`,
        });
        ok = false;
        break;
      }
      const fact = getFact(factId);
      if (!fact) {
        failed.push({ file: entry.file, error: `unknown fact "${factId}"` });
        ok = false;
        break;
      }
      try {
        values.set(factId, await fact.compute(rootDir));
      } catch (error) {
        failed.push({
          file: entry.file,
          error: `cannot compute fact "${factId}": ${String(error)}`,
        });
        ok = false;
        break;
      }
    }
    if (!ok) continue;

    const next = renderWithFacts(text, values);
    if (next === text) {
      unchanged.push(entry.file);
    } else {
      await writeFile(absolute, next, 'utf8');
      updated.push(entry.file);
    }
  }

  return { updated, unchanged, failed };
}
