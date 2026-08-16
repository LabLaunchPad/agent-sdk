import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  type Finding,
  type ValidatorOptions,
  type ValidatorResult,
  result,
} from '../lib/types.js';
import {
  OKF_STATUS_VALUES,
  type FrontmatterParseResult,
  isPlainObject,
  isValidActor,
  isValidDateOnly,
  isValidIsoDateTime,
  normalizeVerifiedEntries,
  parseFrontmatter,
} from '../lib/okf.js';
import { collectFiles, exists, readJson } from '../lib/workspace.js';

interface OkfManifest {
  readonly specVersion: string;
  readonly scopes: readonly string[];
  readonly reservedFilenames: readonly string[];
  readonly excludeFilenames: readonly string[];
  readonly requiredField: string;
}

/**
 * Enforces OKF v0.2 conformance across the agent-facing knowledge surfaces
 * (`.context/`, `research/`, `specs/`, `ADR/` — see okf.json).
 *
 * The spec's own conformance rule is deliberately narrow: every non-reserved
 * `.md` file needs parseable frontmatter with a non-empty `type`, full stop.
 * Consumers "must not reject" unknown `type` values, unknown keys, or broken
 * links. This validator is exactly as strict as that — the leniency fixtures
 * in the adversarial suite exist specifically to catch a validator that
 * became stricter than the spec it claims to enforce, which breaks
 * portability just as surely as one that is too lax.
 *
 * `status`, `stale_after`, `generated` and `verified` are a different case:
 * OKF defines their shape explicitly, so a malformed value in one of them is
 * a real structural defect, not an open-ended taxonomy choice — those ARE
 * checked.
 */
export async function okfConformanceValidator(
  options: ValidatorOptions,
): Promise<ValidatorResult> {
  const { rootDir } = options;
  const findings: Finding[] = [];

  let manifest: OkfManifest;
  try {
    manifest = await readJson<OkfManifest>(path.join(rootDir, 'okf.json'));
  } catch (error) {
    return result('okf-conformance', [
      {
        rule: 'okf/manifest-unreadable',
        message: `okf.json could not be read: ${String(error)}`,
        path: 'okf.json',
      },
    ]);
  }

  let scanned = 0;
  let concepts = 0;
  let reserved = 0;
  let excluded = 0;

  for (const scope of manifest.scopes) {
    const scopeDir = path.join(rootDir, scope);
    if (!(await exists(scopeDir))) continue;

    for (const filePath of await collectFiles(scopeDir, ['.md'])) {
      scanned += 1;
      const relative = path.relative(rootDir, filePath);
      const filename = path.basename(filePath);

      if (manifest.excludeFilenames.includes(filename)) {
        excluded += 1;
        continue;
      }

      const parsed = parseFrontmatter(await readFile(filePath, 'utf8'));

      if (manifest.reservedFilenames.includes(filename)) {
        reserved += 1;
        findings.push(...checkReservedFile(relative, parsed));
        continue;
      }

      concepts += 1;
      findings.push(...checkConceptFile(relative, parsed, manifest.requiredField));
    }
  }

  return result('okf-conformance', findings, { scanned, concepts, reserved, excluded });
}

function checkReservedFile(relative: string, parsed: FrontmatterParseResult): Finding[] {
  // OKF: "No frontmatter required" for index.md/log.md. Its absence is not a
  // defect — most log.md files will never have one.
  if (!parsed.hasBlock) return [];

  if (parsed.data === null) {
    return [
      {
        rule: 'okf/malformed-frontmatter',
        message: `${relative} has a frontmatter block that does not parse as a YAML mapping: ${parsed.error ?? 'unknown error'}`,
        path: relative,
      },
    ];
  }

  const findings: Finding[] = [];
  if ('okf_version' in parsed.data && typeof parsed.data.okf_version !== 'string') {
    findings.push({
      rule: 'okf/invalid-okf-version',
      message: `${relative}: okf_version must be a string.`,
      path: relative,
    });
  }
  // Deliberately no requirement that `type` be present or absent here —
  // reserved files are exempt from the concept-document rule entirely.
  findings.push(...checkWellKnownFieldFormats(relative, parsed.data));
  return findings;
}

function checkConceptFile(
  relative: string,
  parsed: FrontmatterParseResult,
  requiredField: string,
): Finding[] {
  if (!parsed.hasBlock) {
    return [
      {
        rule: 'okf/missing-frontmatter',
        message: `${relative} has no YAML frontmatter block. Every OKF concept document requires one.`,
        path: relative,
      },
    ];
  }

  if (parsed.data === null) {
    return [
      {
        rule: 'okf/malformed-frontmatter',
        message: `${relative} has a frontmatter block that does not parse as a YAML mapping: ${parsed.error ?? 'unknown error'}`,
        path: relative,
      },
    ];
  }

  const findings: Finding[] = [];
  const typeValue = parsed.data[requiredField];
  if (typeof typeValue !== 'string' || typeValue.trim().length === 0) {
    findings.push({
      rule: 'okf/missing-type',
      message: `${relative}: frontmatter "${requiredField}" is required and must be a non-empty string — the only field OKF v0.2 requires.`,
      path: relative,
    });
  }
  // No check on the VALUE of `type` beyond non-empty. Unknown type values are
  // explicitly permitted by the spec and must never be rejected here.

  findings.push(...checkWellKnownFieldFormats(relative, parsed.data));
  return findings;
}

function checkWellKnownFieldFormats(
  relative: string,
  data: Record<string, unknown>,
): Finding[] {
  const findings: Finding[] = [];

  if ('status' in data && !OKF_STATUS_VALUES.includes(data.status as never)) {
    findings.push({
      rule: 'okf/invalid-status',
      message: `${relative}: status "${String(data.status)}" is not one of ${OKF_STATUS_VALUES.join(', ')}.`,
      path: relative,
    });
  }

  if ('stale_after' in data && !isValidDateOnly(data.stale_after)) {
    findings.push({
      rule: 'okf/invalid-stale-after',
      message: `${relative}: stale_after must be an absolute date (YYYY-MM-DD).`,
      path: relative,
    });
  }

  if ('generated' in data) {
    const generated = data.generated;
    if (!isPlainObject(generated)) {
      findings.push({
        rule: 'okf/invalid-generated',
        message: `${relative}: generated must be a mapping with "by" and "at".`,
        path: relative,
      });
    } else {
      if (!isValidActor(generated.by)) {
        findings.push({
          rule: 'okf/invalid-generated-by',
          message: `${relative}: generated.by "${String(generated.by)}" is not a valid actor (human:<id>, process:<id>, or <producer>/<version>).`,
          path: relative,
        });
      }
      if (!isValidIsoDateTime(generated.at)) {
        findings.push({
          rule: 'okf/invalid-generated-at',
          message: `${relative}: generated.at must be an ISO 8601 datetime.`,
          path: relative,
        });
      }
    }
  }

  if ('verified' in data) {
    const entries = normalizeVerifiedEntries(data.verified);
    if (entries === null) {
      findings.push({
        rule: 'okf/invalid-verified',
        message: `${relative}: verified must be a mapping or a list of mappings, each with "by" and "at".`,
        path: relative,
      });
    } else {
      for (const entry of entries) {
        if (!isValidActor(entry.by)) {
          findings.push({
            rule: 'okf/invalid-verified-by',
            message: `${relative}: a verified entry has an invalid "by" actor.`,
            path: relative,
          });
        }
        if (!isValidIsoDateTime(entry.at)) {
          findings.push({
            rule: 'okf/invalid-verified-at',
            message: `${relative}: a verified entry has an invalid "at" datetime.`,
            path: relative,
          });
        }
      }
    }
  }

  return findings;
}
