---
type: Research Consolidation Report
title: Canonical Research Consolidation
description: Entry point for the cross-corpus knowledge graph consolidating all 6 Workstream B research/governance corpora
sources:
  - resource: /research/canonical/canonical-research.json
    id: canonical
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: original synthesis produced by this session, reading across 6 previously-imported research/governance corpora already present in this repository
x_relationship_to_existing_state: this is a SUPPLEMENTARY cross-reference/audit layer. It does not replace or supersede .context/research/{gaps,decisions,local-first,licensing,capabilities}.json or the existing research/ OKF-frontmatter markdown tree, which remain this repository's authoritative, CI-validated knowledge system (ADR-0007). See .context/research/decisions.json for the entry recording this relationship explicitly.
---

# Canonical Research Consolidation

This directory consolidates 6 previously-imported research and governance
corpora into one deduplicated, cross-referenced, evidence-graded knowledge
graph, per a user-supplied `LabLaunchPad.ResearchCanonical` schema
(SOURCE → EVIDENCE → CLAIM → BENCHMARK → DECISION → CONTRADICTION →
ARCHITECTURE, with strict ID-based cross-referencing).

**It is a supplementary audit layer, not a replacement.** The
`.context/research/*.json` files and the OKF-frontmatter markdown tree
under `research/frameworks/`, `research/protocols/`, `research/topics/`,
`research/comparison/`, `research/decisions/` remain the authoritative,
CI-validated record for this repository (see ADR-0007). This directory
exists to do the one thing that record wasn't structured to do easily:
find contradictions and version drift _across_ all 6 corpora at once, and
apply a single delete-test pass to every candidate architecture boundary
any of them proposed.

## What's here

| File                        | Contents                                                                                                                                                                                                                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `canonical-research.json`   | The dense graph — `meta`, `sources`, `versions`, `ecosystems`, `claims`, `evidence`, `benchmarks`, `security`, `gaps`, `contradictions`, `decisions`, `architecture`, `migrations`, `licenses`, `unknowns`, `traceability`. Authoritative for this consolidation's own records. |
| `research-index.xml`        | Thin XML wrapper — semantic/structural boundaries only, no duplicated facts. Every element points into the JSON via `json_ref`.                                                                                                                                                 |
| `CONSOLIDATION-REPORT.md`   | Merge report, cross-corpus convergences, version-drift report, contradiction report, gap-closure report, unknown register, next-wave requirements.                                                                                                                              |
| `ARCHITECTURE-DECISIONS.md` | The `delete_test` (KEEP/ADAPT/EXTERNALIZE/DEFER/`ADD_CANDIDATE`) applied to 25 candidate architecture boundaries against `docs/architecture/PACKAGE-MAP.md`.                                                                                                                    |

## Headline findings

- **6 corpora, 29 ecosystems, 35 claims, 5 contradictions — 3 resolved, 2
  partial.** Full detail in `CONSOLIDATION-REPORT.md`.
- **A2A version drift found and resolved**: 3 sources cited 3 different
  version numbers; a live WebSearch during this consolidation confirmed
  the real current state (v1.0 early 2026, v1.2 late March 2026) and that
  one imported corpus's own drift-detection output was itself stale.
- **The single strongest cross-corpus signal**: `UNKNOWN_OUTCOME` as a
  first-class state for side effects with ambiguous remote results,
  proposed independently by 3 unrelated corpora. Not yet reflected in
  `docs/architecture/PACKAGE-MAP.md`.
- **Three `ADD_CANDIDATE` architecture boundaries** — `WorkspaceEngine`,
  `SandboxEngine`, `SideEffectEngine` — genuinely absent from the current
  package map but strongly evidenced. Flagged for a future ADR, **not**
  added to the package map by this consolidation itself.
- **Status: PARTIAL.** E5 reproduction is 0/14 across every corpus
  combined — every finding here rests on E3/E4 documentation evidence.

## Honest scope

Full atomic-claim depth was applied only to the 4 ecosystems every corpus
independently touched (MCP, A2A, OpenAI Agents SDK, Microsoft Agent
Framework). Every other ecosystem gets one claim per major finding,
pointing at its existing `overview.md` as the full record. This trade-off
is recorded explicitly in `canonical-research.json.meta.scoping_decision`,
not silently presented as exhaustive coverage.
