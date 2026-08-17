---
type: Research Consolidation Report
title: Decision Consolidation
description: Classification of all 44 .context/research/decisions.json entries into D1-D8, and their disposition — bound to an ADR, already satisfied, deferred, or closed as a side effect of this reconciliation
sources:
  - resource: /.context/research/decisions.json
    id: decisions
  - resource: /research/canonical/canonical-research.json
    id: canonical
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: original classification produced this session against the actual 44 entries in .context/research/decisions.json, read in full immediately before writing this file
---

# Decision Consolidation

Classification key (from the operating prompt, applied here rather than
redefined): **D1** already binding · **D2** candidate binding · **D3**
research observation · **D4** duplicate · **D5** superseded · **D6**
contradiction · **D7** unresolved (meta) · **D8** defer.

44 entries in, **8 binding ADRs** out (`ADR-0009`–`ADR-0016`) — not 44, not 25. The count that matters is not how many decisions existed, but how many
distinct architectural _questions_ they actually asked; most of the 44 are
corroboration of a small number of real questions, not 44 separate ones.

## Group A — Bound to ADR-0009 (Protocol / Application / Agent State)

| ID                                             | Class          | Note                                                                                                               |
| ---------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------ |
| `protocol-application-agent-state-distinction` | D2 → BOUND     | Primary source for this ADR                                                                                        |
| `current-wave-cw-002-mcp-stateless-adapter`    | D4 (duplicate) | Independent same-day corroboration, no new information                                                             |
| `wave1-adr-001-mcp-baseline`                   | D4 (duplicate) | Third independent corroboration; source's own "ADR-001" naming does not confer authority here — this document does |

## Group B — Bound to ADR-0010 (Durability & Checkpoint Boundary)

| ID                                       | Class          | Note                                                                    |
| ---------------------------------------- | -------------- | ----------------------------------------------------------------------- |
| `reject-checkpointer-solves-persistence` | D2 → BOUND     | Primary source — LangGraph's own open issues (#536, #1138)              |
| `adopt-checkpointer-pluggable-backend`   | D2 → BOUND     | Pluggable-backend interface shape                                       |
| `adopt-libsql-local-storage-precedent`   | D2 → BOUND     | Concrete local-storage example, folded into ADR's Evidence              |
| `wave1-adr-003-durability-boundary`      | D4 (duplicate) | Reaches the identical conclusion via wave1's own ADR-003; corroborating |

**Amends, does not replace**: `specs/persistence/STORE-INTERFACES.md`.

## Group C — Bound to ADR-0011 (`UNKNOWN_OUTCOME` as a First-Class State)

| ID                                                     | Class          | Note                                                                                   |
| ------------------------------------------------------ | -------------- | -------------------------------------------------------------------------------------- |
| `adr-candidate-006-durable-side-effect-reconciliation` | D2 → BOUND     | Weakest-evidenced of batch 2's 6 at import time; strengthened by the convergence below |
| `post-commit-ops-unknown-outcome-convergence`          | D2 → BOUND     | Independent convergence from this repo's own governance-protocol import                |
| `current-wave-cw-007-unknown-outcome-mutation-state`   | D4 (duplicate) | Third independent corpus, same conclusion                                              |

The single most cross-corpus-corroborated finding in the whole graph
(3 unrelated corpora, none of which saw each other's output).

## Group D — Bound to ADR-0012 (Workspace & Sandbox as Explicit Boundaries)

| ID                                                | Class          | Note                                                                       |
| ------------------------------------------------- | -------------- | -------------------------------------------------------------------------- |
| `adopt-workspace-composable-tool-boundary`        | D2 → BOUND     | Mastra's Workspace — primary source                                        |
| `adopt-runtime-and-sandbox-as-explicit-contracts` | D2 → BOUND     | OpenHands/Browser Use/Letta                                                |
| `current-wave-cw-004-workspace-sandbox-contracts` | D4 (duplicate) | Fourth independent convergence, current-wave's own sandbox-execution topic |

## Group E — Bound to ADR-0013 (Security Enforcement at Policy/Capability Boundary)

| ID                                                 | Class          | Note                                                                                  |
| -------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------- |
| `reject-llm-only-security-judgement`               | D2 → BOUND     | Primary source — OpenHands' own docs                                                  |
| `adr-candidate-003-capability-based-tool-security` | D4 (duplicate) | Batch 2 reinforcement                                                                 |
| `current-wave-cw-005-source-to-sink-security`      | D4 (duplicate) | Third independent source, already `ACTION_REQUIRED` at import                         |
| `adopt-tool-boundary-guardrails`                   | D2 → BOUND     | OpenAI's two-layer guardrail pattern — mechanism-level evidence for the same boundary |

## Group F — Bound to ADR-0014 (Model Gateway Capability & Semantic-Portability Contract)

| ID                                               | Class                                                     | Note                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------ | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `adopt-local-model-gateway-pattern`              | D2 → BOUND                                                | Primary source                                                                                                                                                                                                                                                                                                                      |
| `current-wave-cw-006-model-capability-matrix`    | D2 → BOUND                                                | Capability matrix as release artifact                                                                                                                                                                                                                                                                                               |
| `wave1-adr-002-semantic-portability`             | D2 → BOUND                                                | "Never equate compatibility with semantic portability"                                                                                                                                                                                                                                                                              |
| `adr-candidate-004-offline-local-first-contract` | D3 → recorded as informing evidence, not separately bound | Proposes reshaping the local-first scorecard into a capability contract — a research-methodology refinement for `research/local-first/SCORECARD.md`, not itself a package boundary. Noted in the ADR's Context, not given independent binding status; would need its own evidence (a demonstrated scorecard failure) to become one. |

## Group G — Bound to ADR-0015 (Human-in-the-Loop as a Workflow Contract)

| ID                                                                                                                                                                                                                              | Class      | Note |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---- |
| _(no dedicated decisions.json entry — derived directly from `research/canonical/canonical-research.json`'s `HumanControlLayer` ADAPT disposition and Microsoft Agent Framework's checkpointing+HITL evidence, CLM-MAF-001/004)_ | D2 → BOUND |      |

## Group H — Bound to ADR-0016 (Runtime-Assumption Corrections)

| ID                                       | Class      | Note           |
| ---------------------------------------- | ---------- | -------------- |
| `reject-uniform-runtime-swap-assumption` | D2 → BOUND | Primary source |
| `reject-local-always-cheaper`            | D2 → BOUND | Primary source |

## Group I — Already satisfied, no new ADR (D1 / D3)

Decisions that either already match a standing ADR-ranked decision, are
corrections already applied at the point they were recorded, or are
research-methodology rules that bind automatically at their point of future
use rather than requiring architectural ratification now.

| ID                                                            | Class                                                                                               | Disposition                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `confirm-agent-harness-workflow-layering`                     | D1                                                                                                  | Already matches `PACKAGE-MAP.md`'s existing composition layer — confirmation, not a new decision                                                                                                                                                                                                                |
| `confirm-thin-sdk-strategy`                                   | D1                                                                                                  | Already bound to ADR-0001                                                                                                                                                                                                                                                                                       |
| `correct-youtu-agent-local-first-assumption`                  | D3                                                                                                  | Correction already applied in `research/frameworks/tencent-youtu-agent/overview.md`                                                                                                                                                                                                                             |
| `correct-langgraph-local-first-classification`                | D3                                                                                                  | Correction already applied in `research/frameworks/langgraph/overview.md`                                                                                                                                                                                                                                       |
| `correct-mastra-licensing-two-tier-to-three-tier`             | D3                                                                                                  | Correction already applied in `research/licensing/MATRIX.md`                                                                                                                                                                                                                                                    |
| `reject-root-license-file-sufficiency`                        | D3                                                                                                  | Standing methodology rule (`research/contradictions/license-split-by-directory.md`, `CTR-LICENSE-SPLIT-PATTERN`); applies automatically at the next dependency review, not an SDK architecture decision — downgraded from `ACTION_REQUIRED` to `RECORDED` in `decisions.json` (see `ACTION-REQUIRED-TRIAGE.md`) |
| `adopt-durable-state-distinct-from-memory`                    | D1 (State≠Memory) + informs `RESEARCH-REOPEN-GATES.md` (Knowledge/Evidence/Transcript specifically) | State and Memory are already separate packages in `PACKAGE-MAP.md` (Phase 4 vs 7); the finer Knowledge/Evidence/Transcript split remains genuinely open, feeding `KnowledgeEngine`'s `DEFER`                                                                                                                    |
| `adr-candidate-002-state-memory-context-separation`           | D4 (duplicate of the above)                                                                         | Same disposition                                                                                                                                                                                                                                                                                                |
| `adopt-context-broker-progressive-disclosure`                 | D1                                                                                                  | `ContextEngine` already `KEEP` in `PACKAGE-MAP.md`; this is corroborating evidence for its Phase 6 spec, not a boundary decision                                                                                                                                                                                |
| `adr-candidate-001-small-kernel-optional-workflow`            | D1                                                                                                  | `WorkflowEngine` already `KEEP`, already optional/composable per the existing agent/harness/workflow layering                                                                                                                                                                                                   |
| `current-wave-cw-001-durable-workflow-subsystem`              | D4 (duplicate of the above)                                                                         | Third independent convergence on the same already-settled boundary                                                                                                                                                                                                                                              |
| `adopt-a2a-opaque-remote-agent-boundary`                      | D1                                                                                                  | `A2AAdapter` already `KEEP`; this is the evidence record for it                                                                                                                                                                                                                                                 |
| `current-wave-cw-003-a2a-trust-boundary`                      | D4 (duplicate of the above)                                                                         | Same disposition                                                                                                                                                                                                                                                                                                |
| `adr-candidate-005-evaluationport-vs-optimizationport`        | D1                                                                                                  | `EvaluationEngine` already `KEEP`; the "keep DSPy-style optimization out of the kernel" point is a delete-test confirmation, noted in `BOUNDARY-RECONCILIATION.md`, not a separate boundary                                                                                                                     |
| `canonical-research-graph-is-supplementary-not-authoritative` | D1                                                                                                  | Already correctly `RECORDED`, describes the canonical graph's own status, not an SDK boundary                                                                                                                                                                                                                   |

## Group J — Deferred (D8)

| ID                                   | Class | Disposition                                                                                                                              |
| ------------------------------------ | ----- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `defer-default-multiagent-hierarchy` | D8    | No dedicated ADR — insufficient urgency and no current phase gate depends on it. Revisit trigger recorded in `RESEARCH-REOPEN-GATES.md`. |

## Group K — Resolved via decision analysis, not architecture (D7)

| ID                                       | Class         | Disposition                                                                                                                                                                              |
| ---------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `post-commit-ops-bundle-not-yet-adopted` | D7 → resolved | See `POST-COMMIT-OPS-DECISION.md`. Outcome: `DEFER` (not `ADOPT`/`ADAPT`) — no ADR-0017 written; disposition change recorded directly in `decisions.json` and `docs/agent/DECISIONS.md`. |

## Group L — Close as a side effect of this reconciliation (D7, meta)

These are not independent architectural questions — each is a request to
reconcile the _other_ 43 decisions against architecture, which this
document and the 8 ADRs above now do. Marked `BOUND` (pointing at this
reconciliation), not deleted.

| ID                                                               |
| ---------------------------------------------------------------- |
| `imported-corpus-not-yet-reconciled-with-architecture` (batch 1) |
| `batch-2-corpus-not-yet-reconciled-with-architecture`            |
| `current-wave-corpus-not-yet-reconciled-with-architecture`       |
| `wave1-corpus-not-yet-reconciled-with-architecture`              |

## Totals

44 decisions in. 8 ADRs out (`ADR-0009`–`ADR-0016`), consolidating 22
decisions directly or as duplicate corroboration. 1 decision resolved
outside the ADR mechanism (post-commit-ops, `DEFER`). 16 already-satisfied
with no new binding needed (including `adr-candidate-004-offline-local-
first-contract`, counted once as informing evidence for ADR-0014's Context
rather than independently bound). 1 explicitly deferred. 4
meta-reconciliation items closed as a side effect of this document
existing. 22 + 16 + 1 + 1 + 4 = 44. No entry was
deleted; every one keeps its original record in `decisions.json` with its
disposition updated, per the no-silent-rewrite rule.
