---
type: Research Consolidation Report
title: Architecture Boundary Delete-Test Results
description: delete_test (KEEP/ADAPT/EXTERNALIZE/OPTIONALIZE/DELETE/DEFER/ADD_CANDIDATE) applied to 25 candidate architecture boundaries against docs/architecture/PACKAGE-MAP.md
sources:
  - resource: /research/canonical/canonical-research.json
    id: canonical
  - resource: /docs/architecture/PACKAGE-MAP.md
    id: package-map
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: original synthesis produced by this session; applies the delete_test from the user-supplied consolidation specification against this repository's actual, already-committed docs/architecture/PACKAGE-MAP.md
x_does_not_modify: this file and canonical-research.json's architecture[] array do NOT modify docs/architecture/PACKAGE-MAP.md. ADD_CANDIDATE entries require a real, separately-authored ADR before any promotion — consistent with this repository's standing rule against silently replacing an architectural decision.
---

# Architecture Boundary Delete-Test Results

For every candidate boundary named across the 6 consolidated research
corpora, this applies the `delete_test` the user's consolidation
specification defined: can the kernel work without it / can it be an
adapter / optional / infrastructure-provided / policy-provided /
another-service-provided / independently benchmarked / removed?

Result is one of the spec's own enum values (`KEEP` / `ADAPT` /
`EXTERNALIZE` / `OPTIONALIZE` / `DELETE` / `DEFER`), plus one practical
extension used here: **`ADD_CANDIDATE`** — for boundaries with real,
cross-corpus evidence that are genuinely absent from the current package
map. `ADD_CANDIDATE` is a flag for a future ADR, not a decision in itself.

Full machine-readable records: `canonical-research.json.architecture[]`
(25 entries). This file is the narrative companion.

## KEEP — already planned, now reinforced by evidence

These boundaries already exist in `docs/architecture/PACKAGE-MAP.md`;
research confirms them rather than proposing anything new.

| Boundary            | Package                       | Reinforcing evidence                                                                                                                                              |
| ------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AgentKernel         | `@lablaunchpad/agent`         | Every researched ecosystem has some agent-loop primitive                                                                                                          |
| CapabilityEngine    | `@lablaunchpad/capabilities`  | Mastra's Workspace, wave1's ADR-002 semantic portability, current-wave's model-capability-matrix-as-release-artifact                                              |
| PolicyEngine        | `@lablaunchpad/policy`        | 3-way source-to-sink security convergence — the primary control surface, not optional                                                                             |
| ContextEngine       | `@lablaunchpad/context`       | Every corpus's own context-efficiency/progressive-disclosure findings                                                                                             |
| Runtime             | `@lablaunchpad/runtime-core`  | No new evidence beyond existing plan                                                                                                                              |
| StateEngine         | `@lablaunchpad/state`         | LangGraph's persistence-lifecycle gap (`CLM-LANGGRAPH-002`) and the `UNKNOWN_OUTCOME` convergence are direct, actionable inputs                                   |
| MemoryEngine        | `@lablaunchpad/memory`        | No new evidence beyond existing plan                                                                                                                              |
| WorkflowEngine      | `@lablaunchpad/workflow`      | LangGraph/Mastra's core-not-attached workflow finding; MAF's explicit graph-workflow layer; wave1's ADR-001 (isolate legacy-protocol assumptions behind adapters) |
| ProtocolAdapters    | `adapters/protocols`          | Now backed by real MCP + A2A research, not an abstract placeholder                                                                                                |
| MCPAdapter          | `adapters/protocols`          | `research/protocols/mcp-2026-07-28.md` — version-aware, stateless-core-respecting per wave1's ADR-001                                                             |
| A2AAdapter          | `adapters/protocols`          | `research/protocols/a2a-1.0.1.md` — opaque-remote-agent trust boundary                                                                                            |
| ModelRegistry       | `adapters/models`             | No new evidence beyond existing plan                                                                                                                              |
| EvaluationEngine    | `@lablaunchpad/evaluation`    | wave1's e5-evidence-levels topic converges near-identically with this repository's own pre-existing E0-E5 discipline                                              |
| ObservabilityEngine | `@lablaunchpad/observability` | No new evidence beyond existing plan                                                                                                                              |

## ADAPT — fold into an existing boundary's contract, not a new package

| Boundary                | Fold into                                 | Why not standalone                                                                                                                                                                                                                               |
| ----------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| DurabilityEngine        | `@lablaunchpad/state`'s `CheckpointStore` | wave1's own ADR-003 explicitly recommends against a universal durability abstraction — "keep durability as a replaceable boundary with explicit guarantees per backend," matching this repo's own ADR-0006 deferred-persistence-interface stance |
| ModelCapabilityRegistry | Phase 16 Model Gateway spec               | current-wave's CW-ADR-006 (capability matrix as release artifact) is a concrete refinement of `ModelRegistry`, not a new boundary                                                                                                                |
| RoutingEngine           | Phase 16 Model Gateway spec               | wave1's capability-aware-routing topic is a real requirement that fits inside the gateway                                                                                                                                                        |
| HumanControlLayer       | `@lablaunchpad/workflow`'s contract       | Microsoft Agent Framework documents HITL as workflow semantics (checkpointing + HITL together), not a separate layer                                                                                                                             |

## EXTERNALIZE — confirmed folding, not a gap

| Boundary       | Externalized into                 | Why                                                                                                                                                                                   |
| -------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SecurityEngine | `PolicyEngine`/`CapabilityEngine` | The strongest evidence (3-way source-to-sink convergence) argues security is enforced AT the policy/capability boundary — a separate subsystem could be bypassed if a caller skips it |

## DEFER — insufficient evidence to decide yet

| Boundary               | Why deferred                                                                                                                                                                                                                                                                                       |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| KnowledgeEngine        | State/Memory/Context/Knowledge/Evidence/Transcript are evidenced as 6 distinct concepts across corpora, but "Knowledge" specifically (external/reference material for retrieval) has less direct evidence than the other five. Revisit when `@lablaunchpad/memory` (Phase 7) is actually designed. |
| EventModel             | No dedicated package named by any corpus. Likely folds into `StateEngine` or `ObservabilityEngine`, genuinely unclear from evidence alone. Revisit at Phase 4/20 design.                                                                                                                           |
| ReplayEngine           | Likely overlaps `EvaluationEngine` + `StateEngine` (checkpoint replay). Defer pending a concrete use case rather than speculating a boundary now.                                                                                                                                                  |
| InstructionSkillEngine | Agent Skills is one of this repository's own 3 remaining original-brief gaps (`GAP-AGENTSKILLS`). Deciding a boundary from zero direct evidence would itself violate this consolidation's own no-unsupported-claims rule.                                                                          |

## ADD_CANDIDATE — strongly evidenced, genuinely absent, requires a real ADR

These three are the most significant original finding of this
consolidation. None exists in `docs/architecture/PACKAGE-MAP.md` today.
**This file does not add them** — that would be exactly the kind of
undiscussed architecture change this repository's rules explicitly guard
against. It flags them, with their evidence base, for a future ADR.

| Boundary             | Evidence base                                                                                                                                                                                                                                                                                                                                       | Recommended next step                                                                                                                                                                                                                                                                                                                                                                                |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **WorkspaceEngine**  | 4-way independent convergence: OpenHands/Browser Use/Letta (`SRC-BATCH1`), Mastra's Workspace + Youtu-Agent's Environment (this session's own live research), and the sandbox-execution topic (`SRC-BATCH3`) — see `CTR-WORKSPACE-CONVERGENCE`                                                                                                      | Raise as an explicit ADR-CANDIDATE for a genuinely new package (`adapters/tools/workspace` or a promoted `@lablaunchpad/workspace`), scoped against whatever phase currently owns `adapters/tools/{filesystem,sandbox}`                                                                                                                                                                              |
| **SandboxEngine**    | Same evidence base as WorkspaceEngine, conceptually distinct (isolation mechanism vs. capability surface). The sandbox-execution topic's 3-way tradeoff (Docker seccomp/rootless vs. Firecracker microVMs vs. Wasmtime/WASI) is a real menu for this repository's own SandboxProvider spec (Phase 19, already a known gap per `docs/agent/NEXT.md`) | Same ADR-CANDIDATE recommendation as WorkspaceEngine                                                                                                                                                                                                                                                                                                                                                 |
| **SideEffectEngine** | The single most corroborated gap across all 6 corpora — see `CTR-UNKNOWN-OUTCOME-CONVERGENCE` (batch2, post-commit-ops, wave1 all independently propose the same `UNKNOWN_OUTCOME`/operation-identity reconciliation model)                                                                                                                         | The delete-test answer is "the kernel cannot work without this concept once external side effects exist" — but it can likely be a **contract addition** to `@lablaunchpad/state` or `@lablaunchpad/task` (operation identity survives provider timeout with an unknown remote outcome) rather than its own package. Recommend scoping it that way in Phase 3/4 design, not as a standalone boundary. |

## N/A — not an SDK boundary

| Boundary                | Why N/A                                                                                                                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RepositoryAgentContract | This is `AGENTS.md`/`docs/agent/`'s own governance layer, which predates every imported corpus. Listed for completeness against the candidate-boundary list, not because it needs a package. |

## What this file does not do

It does not edit `docs/architecture/PACKAGE-MAP.md`. It does not promote
any `ADD_CANDIDATE` to `KEEP`. It does not write a new ADR. Those are
explicitly the next step (`GAP-ARCHITECTURE-RECONCILIATION`,
priority P0), requiring a dedicated pass that reconciles all 22
accumulated ADR-CANDIDATEs against each other and against this table —
not something this consolidation task, scoped as a research/evidence
exercise, should decide unilaterally.
