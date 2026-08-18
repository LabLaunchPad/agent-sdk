---
type: Framework Research
title: Durable Side-Effect Reconciliation
description: 'ADR candidate imported from a prior "next wave" external research pass (batch 2, 9 frameworks: Strands Agents, smolagents, AG2, LlamaIndex, Llama Agents, Haystack, DSPy, AutoGen, Semantic Kernel)'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "ADR-CANDIDATE-006" | title: "Durable Side-Effect Reconciliation" | date: "2026-08-17" | source_type: "adr-candidate" | status: "CANDIDATE"'
---

Durable Side-Effect Reconciliation

Evidence: cross-framework research emphasizes loop/state management but no surveyed framework gives the universal semantic contract required for unknown remote outcomes.
Impact: production safety.
Migration cost: medium-high.
Required benchmark: synthetic timeout/replay/idempotency suite.
