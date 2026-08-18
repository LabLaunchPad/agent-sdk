---
type: Framework Research
title: CrewAI — Portability
description: 'portability dimension research for crewai, imported from a prior external research pass'
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

# CrewAI — Portability

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

Mapping: CrewAI Agent -> Agent; Task -> Task; Crew -> Workflow/Team; Flow -> Harness/Workflow; Process -> ExecutionStrategy; Memory -> Memory; Knowledge -> Knowledge; Guardrails -> Policy.

No drop-in compatibility promise. Adapter semantics should preserve task contracts and state transitions.

## Claim ledger

| Claim                                          | Source                | Evidence        | Status                                                             | Confidence  | Limitation                                |
| ---------------------------------------------- | --------------------- | --------------- | ------------------------------------------------------------------ | ----------- | ----------------------------------------- |
| Core architectural/behavioral statements above | See evidence register | E3/E4 as marked | DOCUMENTED_NOT_REPRODUCED unless backed by E4 implementation/tests | High/Medium | No LabLaunchPad reproduction in this pass |
