# Log

Flat, newest-first history of durable changes to the compiled cache. OKF
reserved file — see [SPEC.md §Log Files](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md).

## 2026-08-17

- **Consolidation**: Built `research/canonical/` — a cross-corpus,
  evidence-graded knowledge graph (`LabLaunchPad.ResearchCanonical` schema)
  consolidating all 6 research/governance corpora integrated so far.
  Explicitly supplementary, not authoritative — recorded in
  `.context/research/decisions.json`. Resolved a 3-way A2A version
  discrepancy via a live WebSearch; surfaced 3 evidenced-but-unplanned
  architecture boundaries (`WorkspaceEngine`, `SandboxEngine`,
  `SideEffectEngine`) via a `delete_test` pass, flagged for a future ADR,
  not added to `docs/architecture/PACKAGE-MAP.md`. Status: `PARTIAL`.
- **Import**: 6th research corpus ("wave1", 54 files, self-checksummed) —
  3 new topics, 3 formal ADR proposals, 7 new benchmark-plan categories.
  Distributed into `research/{topics,decisions,benchmarks,comparison}/` and
  `.context/research/wave1/`.
- **Import**: "Current wave" corpus — A2A live-researched (closes an
  original-brief gap, 9 of 17 sources now researched live), 3 refresh
  checks, 2 new topics (`sandbox-execution`, `security-2026`), 7
  ADR-CANDIDATEs.
- **Import**: Post-commit operations governance bundle (git/PR/CI/deploy
  lifecycle protocol) at `docs/operations/post-commit-ops/` — `CANDIDATE`,
  not wired into `AGENTS.md` or CI.
- **Import**: "Next wave" corpus (batch 2) — 9 more frameworks, 6
  ADR-CANDIDATEs, `LICENSE-REVIEW.md`.
- **Import**: Supplementary corpus (batch 1) — 5 more frameworks
  (OpenHands, Letta, Google ADK, Browser Use, CrewAI).
- **Research (installment 3)**: LangGraph, Mastra, MCP 2026-07-28 special
  audit. Self-corrected LangGraph's local-first verdict (was
  mischaracterized as requiring PostgreSQL/Redis; corrected to
  `LOCAL_CAPABLE`) and Mastra's licensing tier count (two-way → three-way
  split), both recorded explicitly, not silently overwritten.

## 2026-08-16

- **Migration**: `.context/` migrated from bespoke JSON envelopes to OKF v0.2
  markdown concepts. `sha256`/`generated_at`/`freshness` (stored) replaced by
  `x_source_sha256`/`generated.at`/derived freshness. `.context/state/*.json`
  and `.context/specs/active.json` intentionally kept as plain JSON — they are
  runtime state and navigational pointers, not knowledge concepts, and OKF
  conformance governs `.md` files only. See [ADR-0007](../ADR/0007-adopt-okf-v0-2.md).
- **Creation**: Phase 0 foundation. `.context/` cache established with four
  cache records (JSON envelope, four-state freshness). See
  [`docs/agent/RECEIPT-P00.md`](../docs/agent/RECEIPT-P00.md).
