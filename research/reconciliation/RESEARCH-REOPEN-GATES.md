---
type: Research Consolidation Report
title: Research Reopen Gates
description: The specific, observable conditions under which deferred boundaries or the broad-research freeze itself may reopen
sources:
  - resource: /research/reconciliation/BOUNDARY-RECONCILIATION.md
    id: boundaries
  - resource: /research/reconciliation/DECISION-CONSOLIDATION.md
    id: decisions
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
---

# Research Reopen Gates

This phase's absolute execution rule froze broad research by default.
Reopening is not "when it seems useful" — it is one of these five
conditions, verbatim from the operating prompt, applied concretely to
what this phase actually deferred.

## General reopen conditions (apply to any frozen item)

1. An ADR exposes material uncertainty its own Adversarial Review couldn't
   resolve from existing evidence.
2. An E5 result contradicts existing architecture.
3. Current implementation has materially changed since the decision.
4. Security evidence changes the decision.
5. Migration cost becomes unacceptable.

## Per-item triggers

| Deferred item                                                                           | Specific trigger                                                                                                                                                                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `KnowledgeEngine` (boundary, `DEFER`)                                                   | Phase 7 `@lablaunchpad/memory` design work reaches a concrete case where Knowledge (external/reference material) cannot be modeled as a Memory scope without a real behavioural difference                                                                                                                                                           |
| `EventModel` (boundary, `DEFER`)                                                        | Phase 4 (`state`) or Phase 20 (`observability`) design work finds neither package can absorb event-log semantics without a real modeling conflict                                                                                                                                                                                                    |
| `ReplayEngine` (boundary, `DEFER`)                                                      | A concrete replay use case arises during Phase 4 or Phase 21 implementation — not before                                                                                                                                                                                                                                                             |
| `InstructionSkillEngine` (boundary, `DEFER`)                                            | Agent Skills research now exists (`research/protocols/agent-skills.md`, this phase) but did not surface enough concrete implementation detail to bind a contract; reopens when a real LabLaunchPad skill-consuming use case is designed, or when the Agent Skills spec itself reaches a stable, versioned release this research can re-check against |
| `defer-default-multiagent-hierarchy` (decision, `D8`)                                   | A concrete multi-agent orchestration requirement is proposed for a specific phase — not speculative interest in the pattern                                                                                                                                                                                                                          |
| Volcengine AgentKit, Baidu AppBuilder SDK (never researched — deliberately, this phase) | A pending ADR or boundary decision becomes blocked on evidence only these two sources could provide. Per the budget rule, interest alone does not reopen this — see `.context/research/gaps.json`                                                                                                                                                    |
| The broad-research freeze itself                                                        | Any of the 5 general conditions above fires against a specific, named decision — never as a blanket "resume researching" without a specific trigger                                                                                                                                                                                                  |

## What does NOT reopen research

Interest in a topic. A new framework release announcement. The existence
of more research material in an available corpus. None of these are, by
themselves, a decision-relevant uncertainty — matching the operating
prompt's own research-budget rule: "what decision does this enable, what
unknown does it resolve, what is the cost, what happens if we do not know,
can a test resolve it faster."
