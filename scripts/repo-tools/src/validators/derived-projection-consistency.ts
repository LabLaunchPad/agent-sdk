import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  type Finding,
  type ValidatorOptions,
  type ValidatorResult,
  result,
} from '../lib/types.js';
import { getFact } from '../lib/facts.js';
import { parseGeneratedRegions } from '../lib/generated-regions.js';
import { collectFiles } from '../lib/workspace.js';

/**
 * Closes the exact gap the audit's mutation experiment demonstrated:
 * `pnpm validate` passed 7/7 while `.context/index.md` and `README.md`
 * stated a validator count that did not match
 * `scripts/repo-tools/src/validators/*.ts`, and separately while
 * `.context/index.md` / `docs/agent/STATE.md` disagreed with each other and
 * with `.context/state/project.json` about the current phase.
 *
 * This validator does not know what "correct" prose looks like - it knows
 * how to recompute a `CanonicalFact` (see lib/facts.ts) and compare it,
 * byte-for-byte after trimming, against every `GENERATED:START fact=<id>`
 * region that claims to represent it. A malformed region (unterminated,
 * unmatched END, nested START, or referencing an unregistered fact id)
 * fails just as loudly as a value mismatch: a corrupted or hand-edited
 * marker must not silently stop being checked.
 *
 * `tests/` is excluded from the scan on purpose - validator/generator unit
 * tests intentionally construct malformed and mismatched regions as
 * fixtures, and those are not real repository claims.
 */
export async function derivedProjectionConsistencyValidator(
  options: ValidatorOptions,
): Promise<ValidatorResult> {
  const { rootDir } = options;
  const findings: Finding[] = [];

  const files = (await collectFiles(rootDir, ['.md'])).filter(
    (file) => !path.relative(rootDir, file).startsWith(`tests${path.sep}`),
  );

  let regionsChecked = 0;
  let filesWithRegions = 0;

  for (const file of files) {
    const relative = path.relative(rootDir, file);
    const text = await readFile(file, 'utf8');
    const { regions, errors } = parseGeneratedRegions(text);

    for (const error of errors) {
      findings.push({
        rule: `derived-projection-consistency/malformed-${error.kind}`,
        message: malformedMessage(error, relative),
        path: relative,
      });
    }

    if (regions.length === 0) continue;
    filesWithRegions += 1;

    for (const region of regions) {
      regionsChecked += 1;
      const fact = getFact(region.factId);

      if (!fact) {
        findings.push({
          rule: 'derived-projection-consistency/unknown-fact',
          message: `${relative}: region references fact "${region.factId}", which is not registered in lib/facts.ts. A marked region must name a real canonical fact.`,
          path: relative,
        });
        continue;
      }

      let canonical: string;
      try {
        canonical = await fact.compute(rootDir);
      } catch (error) {
        findings.push({
          rule: 'derived-projection-consistency/authority-unreadable',
          message: `${relative}: could not compute fact "${fact.id}" from its authority (${fact.authority}): ${String(error)}`,
          path: relative,
        });
        continue;
      }

      const observed = region.content.trim();
      if (observed !== canonical.trim()) {
        findings.push({
          rule: 'derived-projection-consistency/mismatch',
          message:
            `DERIVED_PROJECTION_MISMATCH ` +
            `fact: ${fact.id} ` +
            `canonical: ${canonical} ` +
            `projection: ${relative} ` +
            `observed: ${observed} ` +
            `authority: ${fact.authority}`,
          path: relative,
        });
      }
    }
  }

  return result('derived-projection-consistency', findings, {
    filesScanned: files.length,
    filesWithRegions,
    regionsChecked,
  });
}

function malformedMessage(
  error: { kind: string; factId?: string; index: number },
  relative: string,
): string {
  switch (error.kind) {
    case 'unterminated':
      return `${relative}: GENERATED:START for fact "${String(error.factId)}" at offset ${String(error.index)} has no matching GENERATED:END.`;
    case 'unexpected-end':
      return `${relative}: GENERATED:END at offset ${String(error.index)} has no matching GENERATED:START.`;
    case 'nested-start':
      return `${relative}: GENERATED:START for fact "${String(error.factId)}" at offset ${String(error.index)} appears inside an already-open region. Regions must not nest.`;
    default:
      return `${relative}: malformed GENERATED region at offset ${String(error.index)}.`;
  }
}
