/**
 * Marked-region convention for embedding a `CanonicalFact`'s value inside
 * otherwise hand-authored prose:
 *
 *   The <!-- GENERATED:START fact=validator_count -->7<!-- GENERATED:END --> validators.
 *
 * Everything outside a marked region is untouched by both the generator and
 * the validator - this is deliberately narrower than regenerating whole
 * documents (see docs/audit/REPOSITORY-INTEGRITY-AUDIT.md Option B vs E).
 */

const START = /<!--\s*GENERATED:START\s+fact=([a-zA-Z0-9_]+)\s*-->/g;
const END = '<!-- GENERATED:END -->';

export interface GeneratedRegion {
  readonly factId: string;
  /** Index of the first character of the region's content (after the START marker). */
  readonly contentStart: number;
  /** Index one past the last character of the region's content (before END). */
  readonly contentEnd: number;
  readonly content: string;
}

export type RegionParseError =
  | { readonly kind: 'unterminated'; readonly factId: string; readonly index: number }
  | { readonly kind: 'unexpected-end'; readonly index: number }
  | { readonly kind: 'nested-start'; readonly factId: string; readonly index: number };

export interface ParseResult {
  readonly regions: readonly GeneratedRegion[];
  readonly errors: readonly RegionParseError[];
}

/**
 * Parses every `GENERATED:START ... GENERATED:END` region in `text`.
 *
 * Regions must not nest or overlap. A START without a matching END, an END
 * without a preceding START, or a START inside an open region are all
 * reported as errors rather than silently tolerated - a corrupted or
 * hand-edited marker must fail loudly, not be skipped (see the audit's
 * Part K adversarial-attack list: "remove generated markers", "duplicate
 * generated markers", "corrupt generated content").
 */
export function parseGeneratedRegions(text: string): ParseResult {
  const regions: GeneratedRegion[] = [];
  const errors: RegionParseError[] = [];

  let open: { factId: string; index: number; contentStart: number } | undefined;

  START.lastIndex = 0;
  let match: RegExpExecArray | null;
  const starts: { factId: string; index: number; contentStart: number }[] = [];
  while ((match = START.exec(text)) !== null) {
    const factId = match[1];
    if (factId === undefined) continue;
    starts.push({
      factId,
      index: match.index,
      contentStart: match.index + match[0].length,
    });
  }

  // Walk starts and ENDs in document order together.
  const events: {
    pos: number;
    kind: 'start' | 'end';
    factId?: string;
    contentStart?: number;
  }[] = starts.map((s) => ({
    pos: s.index,
    kind: 'start' as const,
    factId: s.factId,
    contentStart: s.contentStart,
  }));

  let endIndex = text.indexOf(END);
  while (endIndex !== -1) {
    events.push({ pos: endIndex, kind: 'end' });
    endIndex = text.indexOf(END, endIndex + END.length);
  }
  events.sort((a, b) => a.pos - b.pos);

  for (const event of events) {
    if (event.kind === 'start') {
      if (open) {
        errors.push({
          kind: 'nested-start',
          factId: event.factId ?? '',
          index: event.pos,
        });
        continue;
      }
      open = {
        factId: event.factId ?? '',
        index: event.pos,
        contentStart: event.contentStart ?? event.pos,
      };
    } else {
      if (!open) {
        errors.push({ kind: 'unexpected-end', index: event.pos });
        continue;
      }
      regions.push({
        factId: open.factId,
        contentStart: open.contentStart,
        contentEnd: event.pos,
        content: text.slice(open.contentStart, event.pos),
      });
      open = undefined;
    }
  }

  if (open) {
    errors.push({ kind: 'unterminated', factId: open.factId, index: open.index });
  }

  return { regions, errors };
}

/** Replaces every region's content with `facts.get(region.factId)`, left-to-right. */
export function renderWithFacts(
  text: string,
  facts: ReadonlyMap<string, string>,
): string {
  const { regions, errors } = parseGeneratedRegions(text);
  if (errors.length > 0) {
    throw new Error(
      `Cannot regenerate: malformed GENERATED region(s): ${errors.map((error) => JSON.stringify(error)).join(', ')}`,
    );
  }

  let result = '';
  let lastEnd = 0;
  for (const region of regions) {
    const value = facts.get(region.factId);
    if (value === undefined) {
      throw new Error(`Region references unknown fact "${region.factId}"`);
    }
    result += text.slice(lastEnd, region.contentStart) + value;
    lastEnd = region.contentEnd;
  }
  result += text.slice(lastEnd);
  return result;
}
