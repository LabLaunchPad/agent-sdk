---
type: Framework Research
title: State / Memory / Context Separation
description: 'ADR candidate imported from a prior "next wave" external research pass (batch 2, 9 frameworks: Strands Agents, smolagents, AG2, LlamaIndex, Llama Agents, Haystack, DSPy, AutoGen, Semantic Kernel)'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "ADR-CANDIDATE-002" | title: "State / Memory / Context Separation" | date: "2026-08-17" | source_type: "adr-candidate" | status: "CANDIDATE"'
---

State / Memory / Context Separation

Evidence: Strands session state, smolagents step memory, LlamaIndex storage/context and Haystack runtime state expose different semantics.
Impact: prevents accidental persistence and memory pollution.
Migration cost: medium.
Required benchmark: BM-DURABLE-001 + context omission tests.
