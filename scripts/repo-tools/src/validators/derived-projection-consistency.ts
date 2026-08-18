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
import { exists, readJson } from '../lib/workspace.js';

/**
 * Closes the gap the audit's mutation experiment demonstrated: `pnpm validate`
 * passed 7/7 while `.context/index.md` and `README.md` stated a validator count
 * that did not match `scripts/repo-tools/src/validators/*.ts`, and while
 * `.context/index.md` / `docs/agent/STATE.md` disagreed with each other and
 * with `.context/state/project.json` about the current phase. See
 * docs/audit/REPOSITORY-INTEGRITY-AUDIT.md findings A1-A3.
 *
 * Registry-driven, not scan-driven. A generated region is a control artifact
 * only when `projections.json` registers its file AND declares its fact id for
 * that file. The first implementation scanned every `.md` file instead, which
 * had a real defect: documentation explaining the marker convention was parsed
 * as a control artifact, and the "fix" applied at the time was to reword the
 * documentation so the tool would pass - bending the document to satisfy the
 * checker, which is the same failure class this validator exists to prevent.
 * A registry gives every region deterministic identity and lets prose discuss
 * the convention freely.
 *
 * Registration is bidirectional, so neither side can drift alone:
 *   - a declared fact with no region in the file      -> missing-region
 *   - a region whose fact is not declared for that file -> undeclared-region
 *   - a region whose content != the canonical value   -> mismatch
 *   - a malformed/corrupted marker                    -> malformed-*
 */

interface ProjectionEntry {
  readonly id: string;
  readonly file: string;
  readonly facts: readonly string[];
}

interface ProjectionRegistry {
  readonly projections: readonly ProjectionEntry[];
}

export async function derivedProjectionConsistencyValidator(
  options: ValidatorOptions,
): Promise<ValidatorResult> {
  const { rootDir } = options;
  const findings: Finding[] = [];

  const registryPath = path.join(rootDir, 'projections.json');
  if (!(await exists(registryPath))) {
    return result('derived-projection-consistency', [
      {
        rule: 'derived-projection-consistency/registry-missing',
        message:
          'projections.json does not exist. Without it no projection is checked, so its absence must fail rather than silently pass.',
        path: 'projections.json',
      },
    ]);
  }

  let registry: ProjectionRegistry;
  try {
    registry = await readJson<ProjectionRegistry>(registryPath);
  } catch (error) {
    return result('derived-projection-consistency', [
      {
        rule: 'derived-projection-consistency/registry-unreadable',
        message: `projections.json could not be parsed: ${String(error)}`,
        path: 'projections.json',
      },
    ]);
  }

  let regionsChecked = 0;

  for (const entry of registry.projections) {
    const absolute = path.join(rootDir, entry.file);

    if (!(await exists(absolute))) {
      findings.push({
        rule: 'derived-projection-consistency/projection-file-missing',
        message: `projections.json registers "${entry.id}" at ${entry.file}, but no such file exists.`,
        path: entry.file,
      });
      continue;
    }

    const text = await readFile(absolute, 'utf8');
    const { regions, errors } = parseGeneratedRegions(text);

    for (const error of errors) {
      findings.push({
        rule: `derived-projection-consistency/malformed-${error.kind}`,
        message: malformedMessage(error, entry.file),
        path: entry.file,
      });
    }

    const declared = new Set(entry.facts);
    const seen = new Set<string>();

    for (const region of regions) {
      regionsChecked += 1;
      seen.add(region.factId);

      if (!declared.has(region.factId)) {
        findings.push({
          rule: 'derived-projection-consistency/undeclared-region',
          message: `${entry.file}: contains a generated region for fact "${region.factId}", which projections.json does not declare for projection "${entry.id}". Declare it or remove the region — an unregistered region is not checked against anything.`,
          path: entry.file,
        });
        continue;
      }

      const fact = getFact(region.factId);
      if (!fact) {
        findings.push({
          rule: 'derived-projection-consistency/unknown-fact',
          message: `${entry.file}: region references fact "${region.factId}", which is not registered in lib/facts.ts.`,
          path: entry.file,
        });
        continue;
      }

      let canonical: string;
      try {
        canonical = await fact.compute(rootDir);
      } catch (error) {
        findings.push({
          rule: 'derived-projection-consistency/authority-unreadable',
          message: `${entry.file}: could not compute fact "${fact.id}" from its authority (${fact.authority}): ${String(error)}`,
          path: entry.file,
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
            `projection: ${entry.file} ` +
            `observed: ${observed} ` +
            `authority: ${fact.authority}`,
          path: entry.file,
        });
      }
    }

    for (const factId of entry.facts) {
      if (!seen.has(factId)) {
        findings.push({
          rule: 'derived-projection-consistency/missing-region',
          message: `${entry.file}: projections.json declares fact "${factId}" for projection "${entry.id}", but the file contains no generated region for it. Deleting a region must not silently stop it being checked.`,
          path: entry.file,
        });
      }
    }
  }

  return result('derived-projection-consistency', findings, {
    projections: registry.projections.length,
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
