---
okf_version: '0.2'
---

# Agent SDK Context Index

> **This index is a compiled cache, not canonical truth.** Verify any material
> claim against the source file, spec or test. See
> [`docs/architecture/SOURCE-OF-TRUTH.md`](../docs/architecture/SOURCE-OF-TRUTH.md).

This bundle is [OKF v0.2](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
conformant. `type` is the only field OKF requires; `x_`-prefixed keys are
repository extensions (see [ADR-0007](../ADR/0007-adopt-okf-v0-2.md)).
Freshness (`ACTIVE`/`STALE`/`INVALID`) is **derived** from `x_source_sha256`
and `stale_after`, never stored — see [`context-staleness-validator`](../scripts/repo-tools/src/validators/context-staleness.ts).

## Current phase

**P00 — Foundation + Working Toolchain Only** (complete, CI green; see
[`docs/agent/RECEIPT-P00.md`](../docs/agent/RECEIPT-P00.md)) →
**P1A — OKF Adoption + Gap Audit** — Workstream A complete (see
[`docs/agent/RECEIPT-P1A-WORKSTREAM-A.md`](../docs/agent/RECEIPT-P1A-WORKSTREAM-A.md)),
Workstream B (gap audit) in progress.

Phase 0 proves the engineering environment. Phase 1A adopts a vendor-neutral
knowledge format and audits the plan against the current ecosystem. Only
Phase 2+ implements Agent SDK behaviour.

## Current objective

Workstream B: evidence-gated research across the current agent-ecosystem.
9 of 17 original-brief sources live-researched (OpenAI Agents SDK, Microsoft
Agent Framework, PydanticAI, Kimi Agent SDK, Qwen-Agent, Tencent Youtu-Agent,
LangGraph, Mastra, MCP, A2A); 3 remain `UNKNOWN` (Volcengine AgentKit, Baidu
AppBuilder SDK, Agent Skills). 5 supplementary research/governance corpora
integrated beyond the brief (14 more frameworks, 5 topics, 1 governance
bundle — see `.context/research/decisions.json`), plus a supplementary
cross-corpus consolidation graph at `research/canonical/` (status
`PARTIAL`). See [`docs/agent/NOW.md`](../docs/agent/NOW.md) for the full
scope-reconciliation record.

## Canonical documents

| Purpose                    | Path                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| Operating contract         | [`AGENTS.md`](../AGENTS.md)                                                                 |
| Source-of-truth precedence | [`docs/architecture/SOURCE-OF-TRUTH.md`](../docs/architecture/SOURCE-OF-TRUTH.md)           |
| Dependency direction       | [`docs/architecture/DEPENDENCY-DIRECTION.md`](../docs/architecture/DEPENDENCY-DIRECTION.md) |
| Package map                | [`docs/architecture/PACKAGE-MAP.md`](../docs/architecture/PACKAGE-MAP.md)                   |
| Test taxonomy              | [`docs/architecture/TEST-TAXONOMY.md`](../docs/architecture/TEST-TAXONOMY.md)               |
| Decisions                  | [`ADR/`](../ADR/)                                                                           |

## Current state (runtime state — plain JSON, not OKF knowledge concepts)

| What             | Where                                              |
| ---------------- | -------------------------------------------------- |
| Project state    | [`state/project.json`](state/project.json)         |
| Runtime baseline | [`state/runtime.json`](state/runtime.json)         |
| Active task      | [`state/active-task.json`](state/active-task.json) |
| Last checkpoint  | [`state/checkpoint.json`](state/checkpoint.json)   |
| Active specs     | [`specs/active.json`](specs/active.json)           |

## Compiled knowledge (OKF concepts)

| What                    | Where                                                                | Trust tier                |
| ----------------------- | -------------------------------------------------------------------- | ------------------------- |
| Operating contract      | [`decisions/operating-contract.md`](decisions/operating-contract.md) | unverified                |
| TypeScript pin evidence | [`evidence/toolchain-pin.md`](evidence/toolchain-pin.md)             | unverified                |
| Dependency map          | [`specs/dependency-map.md`](specs/dependency-map.md)                 | unverified                |
| Ecosystem scan          | [`research/ecosystem-scan.md`](research/ecosystem-scan.md)           | n/a — `x_required: false` |

No entry has a `verified` block yet: every one is `unverified` until a human
or an automated process confirms it against its source. That is a truthful
starting state, not a defect — see [ADR-0008](../ADR/0008-cache-trust-tiers.md).

## Active decisions

ADR-0001 TypeScript canonical · ADR-0002 nodenext, no bundler ·
ADR-0003 TypeScript pinned 6.0.3 · ADR-0004 `@lablaunchpad/*` namespace ·
ADR-0005 `.context` is compiled cache · ADR-0006 persistence interfaces
deferred · ADR-0007 OKF v0.2 adoption · ADR-0008 cache trust tiers.

## Active risks

1. TypeScript 6.0.3 sits below `latest` (7.0.2) because typescript-eslint caps
   at `<6.1.0`. Drift accrues until the `TYPESCRIPT_7_REVISIT` gate opens.
2. Node 24.19.0 is the only admissible baseline; container defaults differ.
3. `.context` decays into a second source of truth if the staleness validator
   ever becomes advisory.
4. A cache entry can be hash-fresh and still never verified. `verified` is a
   mechanism now, but it is only as good as whoever actually verifies — an
   unattended repository accrues `unverified` entries forever unless someone
   or something regularly reviews them.

## Known failures

None recorded. See [`docs/agent/FAILURES.md`](../docs/agent/FAILURES.md).

## Current benchmark baseline

None recorded. There is no behaviour to measure until Phase 3.

## Relevant packages

| Package                    | Layer     | Role                              |
| -------------------------- | --------- | --------------------------------- |
| `@lablaunchpad/contracts`  | contracts | Placeholder — schema harness only |
| `@lablaunchpad/repo-tools` | tooling   | The six validators                |

## Recent changes

See [`log.md`](log.md).

## Stale context

None. Verify with `pnpm context:check`.

## Next action

Close the 3 remaining original-brief gaps (Volcengine AgentKit, Baidu
AppBuilder SDK, Agent Skills) via live research, same discipline as A2A's
closure. In parallel, `GAP-ARCHITECTURE-RECONCILIATION` (P0) — a formal ADR
pass over the 22 accumulated ADR-CANDIDATEs, starting from
`research/canonical/ARCHITECTURE-DECISIONS.md` — is queued but not yet
performed. Do not begin Phase 2.

## Rules

Never treat this index as canonical truth. Verify claims against source
files, specs and tests when material. Start here, read the active task and
its direct dependencies, and expand context only when evidence shows it is
necessary.
