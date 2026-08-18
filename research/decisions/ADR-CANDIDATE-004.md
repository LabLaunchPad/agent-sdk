---
type: Framework Research
title: Offline/Local-First Contract
description: 'ADR candidate imported from a prior "next wave" external research pass (batch 2, 9 frameworks: Strands Agents, smolagents, AG2, LlamaIndex, Llama Agents, Haystack, DSPy, AutoGen, Semantic Kernel)'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "ADR-CANDIDATE-004" | title: "Offline/Local-First Contract" | date: "2026-08-17" | source_type: "adr-candidate" | status: "CANDIDATE"'
---

Offline/Local-First Contract

Evidence: Strands Ollama, AG2 Ollama, Haystack local models; local adapters do not automatically guarantee end-to-end offline operation.
Impact: honest local-first claims.
Migration cost: low-medium.
Required benchmark: BM-LOCAL-001.
