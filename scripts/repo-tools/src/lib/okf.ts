import { parse as parseYaml } from 'yaml';

/**
 * Shared OKF v0.2 parsing and derivation helpers, used by both
 * `okf-conformance-validator` (structural checks) and
 * `context-staleness-validator` (freshness/trust derivation). Kept in one
 * place so the two validators can never disagree about what a valid actor,
 * date or `verified` list looks like.
 *
 * Spec: https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md
 */

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export interface FrontmatterParseResult {
  /** True if a `---`-delimited block was found at the top of the file. */
  readonly hasBlock: boolean;
  /** Raw YAML text inside the block, empty string if no block. */
  readonly raw: string;
  /**
   * Parsed frontmatter as a plain object. `null` means a block was present
   * but failed to parse or did not parse to a mapping — a real defect.
   * `hasBlock: false` always pairs with `data: null` and no `error`.
   */
  readonly data: Record<string, unknown> | null;
  readonly error?: string;
  /** File content after the frontmatter block (or the whole file if none). */
  readonly body: string;
}

export function parseFrontmatter(source: string): FrontmatterParseResult {
  const match = FRONTMATTER_PATTERN.exec(source);
  if (!match) {
    return { hasBlock: false, raw: '', data: null, body: source };
  }

  const raw = match[1] ?? '';
  const body = source.slice(match[0].length);

  let parsed: unknown;
  try {
    parsed = parseYaml(raw);
  } catch (error) {
    return { hasBlock: true, raw, data: null, error: String(error), body };
  }

  if (parsed === undefined || parsed === null) {
    // An empty frontmatter block (`---\n---`) is a mapping with zero keys.
    return { hasBlock: true, raw, data: {}, body };
  }
  if (!isPlainObject(parsed)) {
    return {
      hasBlock: true,
      raw,
      data: null,
      error: 'frontmatter did not parse to a YAML mapping',
      body,
    };
  }

  return { hasBlock: true, raw, data: parsed, body };
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** OKF v0.2 §Lifecycle. Absent `status` means `stable` by spec default. */
export const OKF_STATUS_VALUES = ['draft', 'stable', 'deprecated'] as const;
export type OkfStatus = (typeof OKF_STATUS_VALUES)[number];

/**
 * OKF v0.2 §Actor Convention: `<producer>/<version>` for agents/tools,
 * `human:<id>` for persons, `process:<id>` for automated processes. A slash
 * anywhere after the first character satisfies the producer/version form; a
 * bare string with neither a prefix nor a slash is not a valid actor.
 */
const ACTOR_PATTERN = /^(human:\S+|process:\S+|\S+\/\S+)$/;

export function isValidActor(value: unknown): value is string {
  return typeof value === 'string' && ACTOR_PATTERN.test(value);
}

export function isHumanActor(actor: string): boolean {
  return actor.startsWith('human:');
}

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateOnly(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    DATE_ONLY_PATTERN.test(value) &&
    !Number.isNaN(Date.parse(value))
  );
}

export function isValidIsoDateTime(value: unknown): value is string {
  return (
    typeof value === 'string' && value.length > 0 && !Number.isNaN(Date.parse(value))
  );
}

export interface VerifiedEntry {
  readonly by?: unknown;
  readonly at?: unknown;
}

/**
 * OKF v0.2: "consumers must treat bare `verified` mappings as one-element
 * lists." Returns `null` when the shape is neither a mapping nor a list of
 * mappings — a structural defect distinct from "no verification yet."
 */
export function normalizeVerifiedEntries(verified: unknown): VerifiedEntry[] | null {
  if (verified === undefined || verified === null) return [];
  if (Array.isArray(verified)) {
    return verified.every(isPlainObject) ? verified : null;
  }
  return isPlainObject(verified) ? [verified] : null;
}

export type TrustTier = 'unverified' | 'machine-confirmed' | 'human-reviewed';

/**
 * OKF v0.2 trust tiers are DERIVED, never stored: no `verified` → unverified;
 * verified by non-human actors only → machine-confirmed; verified by at least
 * one `human:<id>` actor → human-reviewed.
 *
 * Assumes `entries` has already survived `normalizeVerifiedEntries` (a
 * structurally invalid `verified` field is a conformance finding, not a trust
 * question — callers should not reach this function in that case).
 */
export function deriveTrustTier(entries: readonly VerifiedEntry[]): TrustTier {
  if (entries.length === 0) return 'unverified';
  const hasHumanReview = entries.some(
    (entry) => typeof entry.by === 'string' && isHumanActor(entry.by),
  );
  return hasHumanReview ? 'human-reviewed' : 'machine-confirmed';
}
