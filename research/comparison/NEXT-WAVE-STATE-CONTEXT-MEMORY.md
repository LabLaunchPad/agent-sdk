---
type: Framework Research
title: STATE-CONTEXT-MEMORY
description: 'Comparison matrix imported from a prior "next wave" external research pass (batch 2, 9 frameworks: Strands Agents, smolagents, AG2, LlamaIndex, Llama Agents, Haystack, DSPy, AutoGen, Semantic Kernel)'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "STATE-CONTEXT-MEMORY" | title: "State Context Memory" | date: "2026-08-17" | source_type: "research" | evidence_standard: "E0-E5" | status: "RESEARCH_COMPLETE" | tags: |   - "state" |   - "memory" |   - "context"'
---

# STATE-CONTEXT-MEMORY

## Required semantic separation

- STATE = machine-owned execution facts needed to continue.
- MEMORY = information deliberately retained for future runs.
- CONTEXT = information selected for a particular model invocation.
- KNOWLEDGE = externally grounded reusable information.
- EVIDENCE = provenance attached to claims/observations.
- TRANSCRIPT = human/model/tool conversation history.

## Extracted lessons

**Strands:** session persistence exists, but its own documentation warns persistence occurs at lifecycle events and its session manager is not thread-safe. Treat this as a reason to define explicit persistence boundaries rather than expose a generic "save everything" abstraction.

**smolagents:** memory is a step ledger with succinct/full views and replay. Useful for debugging and trajectory evaluation, but not evidence of a complete durable workflow state machine.

**LlamaIndex:** storage is explicitly persistable and reloadable. This is a strong model for knowledge/index persistence, but it should not be conflated with resumable execution.

**Haystack:** the Agent exposes a runtime `state_schema`, and pipeline definitions serialize to YAML. This suggests two separate contracts: executable graph definition and per-run mutable state.

**Microsoft successor lesson:** Agent Framework explicitly adds robust state management and workflows for long-running/HITL scenarios, combining lessons from AutoGen and Semantic Kernel. This is direct migration evidence that simple conversation/runtime abstractions are insufficient for durable work.

## LabLaunchPad contracts

`ExecutionState` should be versioned, serializable and checkpointable.

`MemoryRecord` should have scope, source, confidence, timestamp, expiry/invalidation policy and promotion reason.

`ContextBundle` should include selected items plus provenance and token budget.

`Transcript` must be append-only logical history, not the only source of truth for state.

`EvidenceRecord` must be immutable enough for audit and must distinguish documented from observed behavior.
