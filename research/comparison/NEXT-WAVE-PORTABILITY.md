---
type: Framework Research
title: PORTABILITY
description: 'Comparison matrix imported from a prior "next wave" external research pass (batch 2, 9 frameworks: Strands Agents, smolagents, AG2, LlamaIndex, Llama Agents, Haystack, DSPy, AutoGen, Semantic Kernel)'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "PORTABILITY" | title: "Portability" | date: "2026-08-17" | source_type: "research" | evidence_standard: "E0-E5" | status: "RESEARCH_COMPLETE" | tags: |   - "portability"'
---

# PORTABILITY

## Semantic portability model

Portability is not drop-in API compatibility. Preserve semantics through ports:

`ModelPort`
`ToolPort`
`ContextPort`
`MemoryPort`
`StatePort`
`RuntimePort`
`WorkflowPort`
`EvaluationPort`
`ObservabilityPort`
`PolicyPort`

Each port declares capability levels:
`NATIVE | SUPPORTED | DEGRADED | UNSUPPORTED | UNKNOWN`

Provider adapters must expose what they cannot guarantee instead of silently emulating.

## Key evidence

- Strands demonstrates broad model/provider adapters and Ollama.
- Haystack demonstrates multiple local model backends and a componentized architecture.
- AG2 demonstrates direct Ollama support and many orchestration patterns.
- LlamaIndex demonstrates broad data/model ecosystem plus explicit storage context.
- Microsoft Agent Framework's current positioning combines multiple provider and orchestration lessons and explicitly targets interoperability standards.

## LabLaunchPad rule

Never advertise "model-agnostic" unless the test suite exercises the actual feature surface under at least:

- one frontier hosted model
- one low-cost hosted model
- one local Ollama model
- one alternate local runtime where practical

Feature manifests should state degraded behaviors, especially structured output, tool calling, streaming and vision.
