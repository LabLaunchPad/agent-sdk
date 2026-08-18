import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getFact } from './facts.js';
import { parseGeneratedRegions, renderWithFacts } from './generated-regions.js';
import { collectFiles } from './workspace.js';

export interface WriteFactsOutcome {
  readonly updated: readonly string[];
  readonly unchanged: readonly string[];
  readonly failed: readonly { readonly file: string; readonly error: string }[];
}

/**
 * Regenerates every `GENERATED:START/END` region across the repository from
 * its canonical fact (see lib/facts.ts). Local-only command - never runs in
 * CI, matching `context refresh`'s existing rule for the identical reason:
 * an auto-refresh in CI would rubber-stamp drift instead of reporting it via
 * `validate derived-projection-consistency`.
 */
export async function writeFacts(rootDir: string): Promise<WriteFactsOutcome> {
  const files = (await collectFiles(rootDir, ['.md'])).filter(
    (file) => !path.relative(rootDir, file).startsWith(`tests${path.sep}`),
  );

  const updated: string[] = [];
  const unchanged: string[] = [];
  const failed: { file: string; error: string }[] = [];

  for (const file of files) {
    const relative = path.relative(rootDir, file);
    const text = await readFile(file, 'utf8');
    const { regions, errors } = parseGeneratedRegions(text);

    if (errors.length > 0) {
      failed.push({
        file: relative,
        error: `malformed region(s): ${errors.map((error) => error.kind).join(', ')}`,
      });
      continue;
    }
    if (regions.length === 0) continue;

    const factIds = [...new Set(regions.map((region) => region.factId))];
    const values = new Map<string, string>();
    let ok = true;

    for (const factId of factIds) {
      const fact = getFact(factId);
      if (!fact) {
        failed.push({ file: relative, error: `unknown fact "${factId}"` });
        ok = false;
        break;
      }
      try {
        values.set(factId, await fact.compute(rootDir));
      } catch (error) {
        failed.push({
          file: relative,
          error: `cannot compute fact "${factId}": ${String(error)}`,
        });
        ok = false;
        break;
      }
    }
    if (!ok) continue;

    const next = renderWithFacts(text, values);
    if (next === text) {
      unchanged.push(relative);
    } else {
      await writeFile(file, next, 'utf8');
      updated.push(relative);
    }
  }

  return { updated, unchanged, failed };
}
