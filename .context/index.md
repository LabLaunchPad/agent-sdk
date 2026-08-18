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

**<!-- GENERATED:START fact=phase_id -->P2<!-- GENERATED:END --> — Kernel Constitution + E5-02 (UNKNOWN_OUTCOME)**, spec-preparation
complete for its 7 scoped modules. Preceded by **P1B — Architecture
Reconciliation & ADR Freeze** (complete), **P1A — OKF Adoption + Gap
Audit** (complete, see
[`docs/agent/RECEIPT-P1A-WORKSTREAM-A.md`](../docs/agent/RECEIPT-P1A-WORKSTREAM-A.md))
and **P00 — Foundation** (complete, see
[`docs/agent/RECEIPT-P00.md`](../docs/agent/RECEIPT-P00.md)).

Machine-readable equivalent: [`state/project.json`](state/project.json).
Gate detail: `.context/research/reconciliation/phase-gate.json`
(`phase_2_gates`). **Phase 2 implementation remains LOCKED** — spec-prep
being complete does not unblock writing `@lablaunchpad/*` kernel code.

## Current objective

Phase 2 spec-preparation is complete for M01/M02/M03/M04/M05/M15/M16. The
original 17-source research brief is closed (<!-- GENERATED:START fact=research_brief_status -->17/17<!-- GENERATED:END --> live-researched). 5
supplementary research/governance corpora integrated beyond the brief (14
more frameworks, 5 topics, 1 governance bundle — see
`.context/research/decisions.json`), plus a supplementary cross-corpus
consolidation graph at `research/canonical/` (status `PARTIAL`). See
[`docs/agent/NOW.md`](../docs/agent/NOW.md) for the full
scope-reconciliation record and [`docs/agent/NEXT.md`](../docs/agent/NEXT.md)
for the current gate.

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

<!-- GENERATED:START fact=adr_list -->ADR-0001 TypeScript Canonical Language · ADR-0002 Nodenext Module Resolution · ADR-0003 TypeScript Version Pin · ADR-0004 LabLaunchPad npm Namespace · ADR-0005 Context Is a Compiled Cache · ADR-0006 Persistence Interfaces Deferred · ADR-0007 Adopt OKF v0.2 for Agent-Facing Knowledge · ADR-0008 Cache Trust Tiers via Verified · ADR-0009 Protocol / Application / Agent State Distinction · ADR-0010 Durability & Checkpoint Boundary · ADR-0011 UNKNOWN_OUTCOME as a First-Class Side-Effect State · ADR-0012 Workspace & Sandbox as Explicit Architecture Boundaries · ADR-0013 Security Enforcement at the Policy/Capability Boundary · ADR-0014 Model Gateway Capability & Semantic-Portability Contract · ADR-0015 Human-in-the-Loop as a Workflow Contract · ADR-0016 Runtime-Assumption Corrections<!-- GENERATED:END -->.

Authoritative list: [`ADR/`](../ADR/).

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

No SDK-behaviour baseline — there is no runtime to measure until Phase 3.
<!-- GENERATED:START fact=benchmark_run_count -->3<!-- GENERATED:END --> E5 harnesses have nonetheless been executed against throwaway,

package-external code: `benchmarks/durable-restart/` (real kills),
`benchmarks/e5-02-unknown-outcome/` (SIMULATED) and
`benchmarks/e5-08-policy-capability/` (SIMULATED). Results:
[`research/benchmarks/E5-LADDER.md`](../research/benchmarks/E5-LADDER.md).

## Relevant packages

| Package                    | Layer     | Role                                                                                |
| -------------------------- | --------- | ----------------------------------------------------------------------------------- |
| `@lablaunchpad/contracts`  | contracts | Placeholder — schema harness only                                                   |
| `@lablaunchpad/repo-tools` | tooling   | The <!-- GENERATED:START fact=validator_count -->9<!-- GENERATED:END --> validators |

## Recent changes

See [`log.md`](log.md).

## Stale context

None. Verify with `pnpm context:check`.

## Next action

See [`docs/agent/NEXT.md`](../docs/agent/NEXT.md) — the authoritative queue.
In short: Phase 2 implementation stays **LOCKED**, `BROAD_RESEARCH` stays
**LOCKED**, `NEW_ADR_CREATION` is **TRIGGER_ONLY**. The next E5-worthy gate
is `E5-04` (Duplicate Operation) or re-running `E5-08` against a real —
not SIMULATED — Phase 8/9 `PolicyEngine`/`CapabilityEngine`, neither
triggered yet. `GAP-ARCHITECTURE-RECONCILIATION` was resolved in Phase 1B
(`ADR-0009`–`ADR-0016`); the 17-source brief is closed
<!-- GENERATED:START fact=research_brief_status -->17/17<!-- GENERATED:END -->.

## Rules

Never treat this index as canonical truth. Verify claims against source
files, specs and tests when material. Start here, read the active task and
its direct dependencies, and expand context only when evidence shows it is
necessary.
