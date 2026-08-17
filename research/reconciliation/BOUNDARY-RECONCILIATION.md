---
type: Research Consolidation Report
title: Boundary Reconciliation
description: Binding disposition for every candidate architecture boundary in research/canonical/canonical-research.json's architecture[] array, superseding its first-pass delete_test with the actual ADR outcome
sources:
  - resource: /research/canonical/canonical-research.json
    id: canonical
  - resource: /research/canonical/ARCHITECTURE-DECISIONS.md
    id: first-pass
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: original synthesis this session, cross-referencing the 8 ADRs written in this same phase against the canonical graph's architecture[] array
x_correction: research/canonical/CONSOLIDATION-REPORT.md, research/canonical/index.md, the audit artifact, and this phase's own plan file all stated the architecture[] array has "25" entries. Direct recount against the actual JSON (node -e "require('./research/canonical/canonical-research.json').architecture.length") returns 27. Recorded here as a correction, not silently fixed upstream — see the note at the end of this file.
---

# Boundary Reconciliation

`research/canonical/ARCHITECTURE-DECISIONS.md` (written during the
consolidation phase) applied a first-pass `delete_test` and explicitly
declined to bind anything — this document is the actual binding outcome,
now that ADR-0009 through ADR-0016 exist. The first-pass file is not
deleted (it remains the narrative record of the delete-test reasoning);
this file records what actually happened to each boundary.

## KEEP — already in `docs/architecture/PACKAGE-MAP.md`, no new ADR needed

| Boundary            | Package                       | Binding basis                                                                                                                                                                   |
| ------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AgentKernel         | `@lablaunchpad/agent`         | Already planned; no decision in this phase changes it                                                                                                                           |
| CapabilityEngine    | `@lablaunchpad/capabilities`  | Already planned; ADR-0012 adds the Workspace contract onto it                                                                                                                   |
| PolicyEngine        | `@lablaunchpad/policy`        | Already planned; ADR-0013 adds the security-enforcement contract onto it                                                                                                        |
| ContextEngine       | `@lablaunchpad/context`       | Already planned; no new binding this phase                                                                                                                                      |
| Runtime             | `@lablaunchpad/runtime-core`  | Already planned; ADR-0016 adds the runtime-swap testing requirement                                                                                                             |
| StateEngine         | `@lablaunchpad/state`         | Already planned; ADR-0010 and ADR-0011 both add contract requirements onto it                                                                                                   |
| MemoryEngine        | `@lablaunchpad/memory`        | Already planned; no new binding this phase                                                                                                                                      |
| WorkflowEngine      | `@lablaunchpad/workflow`      | Already planned; ADR-0015 adds the HITL contract onto it                                                                                                                        |
| ProtocolAdapters    | `adapters/protocols`          | Already planned; no new binding this phase                                                                                                                                      |
| MCPAdapter          | `adapters/protocols`          | Already planned; ADR-0009 adds the state-layering contract onto it                                                                                                              |
| A2AAdapter          | `adapters/protocols`          | Already planned; ADR-0009 applies here too                                                                                                                                      |
| ModelRegistry       | `adapters/models`             | Already planned; ADR-0014 adds the capability-matrix contract onto it                                                                                                           |
| EvaluationEngine    | `@lablaunchpad/evaluation`    | Already planned; `adr-candidate-005-evaluationport-vs-optimizationport`'s "keep optimization out of the kernel" point confirmed, no separate `OptimizationPort` package created |
| ObservabilityEngine | `@lablaunchpad/observability` | Already planned; no new binding this phase                                                                                                                                      |

## ADAPT — folded into an existing package's contract via ADR

| Boundary                | Folded into                                | ADR      |
| ----------------------- | ------------------------------------------ | -------- |
| DurabilityEngine        | `@lablaunchpad/state`'s `CheckpointStore`  | ADR-0010 |
| ModelCapabilityRegistry | `adapters/models`'s Model Gateway contract | ADR-0014 |
| RoutingEngine           | `adapters/models`'s Model Gateway contract | ADR-0014 |
| HumanControlLayer       | `@lablaunchpad/workflow`'s contract        | ADR-0015 |

## EXTERNALIZE — confirmed folding, no separate boundary

| Boundary       | Folded into                                           | ADR      |
| -------------- | ----------------------------------------------------- | -------- |
| SecurityEngine | `@lablaunchpad/policy` + `@lablaunchpad/capabilities` | ADR-0013 |

## PROMOTED from `ADD_CANDIDATE` to bound, via ADR

The first-pass consolidation deliberately did not add these to
`docs/architecture/PACKAGE-MAP.md` — that required a real ADR, per its own
stated caveat. That ADR now exists for two of the three; the package map
is updated in the same commit as this reconciliation.

| Boundary         | Resolution                                                                                                             | ADR      |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| WorkspaceEngine  | Bound as a layer-1 `@lablaunchpad/capabilities` contract (not a new top-level package)                                 | ADR-0012 |
| SandboxEngine    | Bound as the elaborated contract for the already-named `adapters/tools/sandbox` category (not a new top-level package) | ADR-0012 |
| SideEffectEngine | Bound as a contract addition to `@lablaunchpad/task`/`@lablaunchpad/state` (not a new package)                         | ADR-0011 |

None of the three became a new top-level package in `PACKAGE-MAP.md` —
each resolved to a contract requirement on an existing planned package,
consistent with the creation rule ("a real dependency cut, an independent
version cadence, or a portability requirement" — none of the three
demonstrated one).

## DEFER — insufficient evidence, revisit trigger recorded

| Boundary               | Why still deferred                                                                                                                                                       | Revisit trigger (see `RESEARCH-REOPEN-GATES.md`)                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| KnowledgeEngine        | State/Memory separation is now settled (D1, see `DECISION-CONSOLIDATION.md` Group I); "Knowledge" specifically still lacks direct evidence distinguishing it from Memory | Phase 7 `@lablaunchpad/memory` design reaching a concrete Knowledge/Memory boundary question |
| EventModel             | No dedicated package named by any corpus; likely folds into `StateEngine` or `ObservabilityEngine`, genuinely unclear from evidence alone                                | Phase 4/20 design                                                                            |
| ReplayEngine           | Likely overlaps `EvaluationEngine` + `StateEngine`; no concrete use case yet                                                                                             | A concrete replay use case arising in Phase 4 or Phase 21                                    |
| InstructionSkillEngine | `GAP-AGENTSKILLS` — Agent Skills was not researched by any corpus until this phase (see the cheap-gap-closure step); now closed, see the updated disposition below       |

## N/A — not an SDK boundary

| Boundary                | Why                                                                                           |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| RepositoryAgentContract | This repository's own `AGENTS.md`/`docs/agent/` governance layer, not an SDK package boundary |

## Correction from this phase's own cheap-gap-closure step

`InstructionSkillEngine` was `DEFER`red specifically because Agent Skills
had zero research coverage (`GAP-AGENTSKILLS`). This phase's cheap-gap-
closure step researched it directly — see
`research/protocols/agent-skills.md` and the updated
`.context/research/gaps.json`. The evidence found does **not** yet
warrant promoting `InstructionSkillEngine` past `DEFER` to a bound
contract (see that file's own LabLaunchPad-extraction section for why) —
recorded here as "gap closed, disposition unchanged" rather than silently
promoting a boundary the moment any evidence exists.

## Totals

27 boundaries (not 25 — see the correction note in this file's
frontmatter). 14 already-`KEEP`, 4 `ADAPT`, 1 `EXTERNALIZE`, 3 promoted
from `ADD_CANDIDATE` to bound, 4 `DEFER` (one gap-researched this phase,
disposition unchanged), 1 `N/A`. Zero boundaries were deleted or rejected
outright — every candidate that reached this reconciliation with real
cross-corpus evidence found a home, either as a `KEEP` confirmation, a
folded contract addition, or an explicit, revisitable deferral.
