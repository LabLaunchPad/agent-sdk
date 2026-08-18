---
type: Framework Research
title: DX-AX-OX-UX-PX
description: 'Comparison matrix imported from a prior "next wave" external research pass (batch 2, 9 frameworks: Strands Agents, smolagents, AG2, LlamaIndex, Llama Agents, Haystack, DSPy, AutoGen, Semantic Kernel)'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "DX-AX-OX-UX-PX" | title: "DX AX OX UX PX" | date: "2026-08-17" | source_type: "research" | evidence_standard: "E0-E5" | status: "RESEARCH_COMPLETE" | tags: |   - "ux" |   - "dx" |   - "ax" |   - "ox" |   - "px"'
---

# DX-AX-OX-UX-PX

## Human UX

Common high-value pattern: expose progress at the right abstraction level. Strands evaluation, Haystack explicit agent messages/state, and AutoGenBench logs all point toward visible trajectories rather than only final text.

LabLaunchPad should expose:

- current goal
- current step
- pending approval
- tools invoked
- evidence gathered
- state checkpoint
- retry/replan reason
- estimated/actual cost
- final result confidence
- recovery action

## Developer UX

The strongest common denominator is explicit source-of-truth discoverability:

- Strands repo has AGENTS.md testing guidance.
- Haystack repo includes AGENTS.md and CLAUDE.md.
- Official repos generally make tests/release/docs visible.

LabLaunchPad should ship an agent-maintainer contract:
`ARCHITECTURE.md + AGENTS.md + DECISIONS/ + CONTRACTS/ + TESTS/ + EVALS/ + BENCHMARKS/`.

## AI-coding-agent UX

Do not force an AI maintainer to rediscover:

- what is canonical
- where contracts live
- how to run tests
- how to run evals
- which changes need ADRs
- which directories may be changed
- how evidence is recorded

## AX/OX/PX

Agent experience: explicit capabilities, predictable tool schemas, narrow context windows and resumable state.

Operator experience: approvals, traces, replay and recovery.

Platform experience: stable semantic contracts across model/runtime/provider changes.

Plugin experience: capability registration, versioning, permission grants, health checks and deterministic teardown.
