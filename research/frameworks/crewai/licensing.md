---
type: Framework Research
title: CrewAI — Licensing
description: 'licensing dimension research for crewai, imported from a prior external research pass'
sources:
  - resource: https://docs.crewai.com/concepts/agents
    id: agents-concept-roles-tools-collaboration
  - resource: https://docs.crewai.com/concepts/tasks
    id: tasks-dependency-context-and-async-execu
  - resource: https://docs.crewai.com/concepts/crews
    id: crews-sequential-hierarchical-execution
  - resource: https://docs.crewai.com/concepts/flows
    id: flows-structured-stateful-orchestration
  - resource: https://docs.crewai.com/concepts/memory
    id: memory-subsystem
  - resource: https://docs.crewai.com/
    id: current-docs-overview-guardrails-hitl-ob
  - resource: https://github.com/crewAIInc/crewAI
    id: mit-license-and-current-release-info
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_evidence_level: E3/E4 per-claim - see this file's own Evidence register
x_provenance: imported research corpus (user-supplied), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the file's own evidence-discipline section unless separately reproduced
---

# CrewAI — Licensing

**Research posture:** pattern-level reverse engineering and independent re-specification. No source-code reuse.
**Snapshot:** 2026 current docs/release snapshot
**License:** MIT (see licensing section for boundaries).

## Evidence register

- **E3** — Agents concept: roles, tools, collaboration: https://docs.crewai.com/concepts/agents
- **E4** — Tasks: dependency/context and async execution: https://docs.crewai.com/concepts/tasks
- **E4** — Crews: sequential/hierarchical execution: https://docs.crewai.com/concepts/crews
- **E4** — Flows: structured stateful orchestration: https://docs.crewai.com/concepts/flows
- **E4** — Memory subsystem: https://docs.crewai.com/concepts/memory
- **E3** — Current docs overview: guardrails, HITL, observability, deployment: https://docs.crewai.com/
- **E3** — MIT license and current release info: https://github.com/crewAIInc/crewAI

## Evidence discipline

E0 prior/model knowledge; E1 community signal; E2 repository/source evidence; E3 official docs; E4 official docs + implementation/tests; E5 LabLaunchPad reproduction/benchmark.

**Status vocabulary:** VERIFIED, DOCUMENTED_NOT_REPRODUCED, PARTIAL, UNKNOWN, CONTRADICTED.

## Findings

**Status:** UNKNOWN / DOCUMENTED_NOT_REPRODUCED in this pass. No production implementation is proposed.

**Research question:** What is the smallest independent LabLaunchPad contract needed to reproduce the observed behavior?

## Claim ledger

| Claim                                          | Source                | Evidence        | Status                                                             | Confidence  | Limitation                                |
| ---------------------------------------------- | --------------------- | --------------- | ------------------------------------------------------------------ | ----------- | ----------------------------------------- |
| Core architectural/behavioral statements above | See evidence register | E3/E4 as marked | DOCUMENTED_NOT_REPRODUCED unless backed by E4 implementation/tests | High/Medium | No LabLaunchPad reproduction in this pass |

## Licensing facts

- Repository license: **MIT** according to the official repository/source listed above.
- Documentation licensing: **NOT FULLY VERIFIED in this pass** unless separately stated in the source register.
- Copyright: inspect repository-level notices before redistribution.
- Dependencies: not exhaustively audited in this pass; treat each dependency under its own license.
- Patents/trademarks/commercial restrictions: **NOT FULLY VERIFIED**; Apache-2.0 gives an express patent license, but trademark rights remain separate; MIT similarly does not grant trademark rights.
- Clean-room rule: LabLaunchPad uses pattern-level learning only; no implementation copying.
