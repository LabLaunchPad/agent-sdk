---
type: Framework Research
title: EvaluationPort vs OptimizationPort
description: 'ADR candidate imported from a prior "next wave" external research pass (batch 2, 9 frameworks: Strands Agents, smolagents, AG2, LlamaIndex, Llama Agents, Haystack, DSPy, AutoGen, Semantic Kernel)'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "ADR-CANDIDATE-005" | title: "EvaluationPort vs OptimizationPort" | date: "2026-08-17" | source_type: "adr-candidate" | status: "CANDIDATE"'
---

EvaluationPort vs OptimizationPort

Evidence: Strands/Haystack/AG2 evaluation and DSPy optimization serve different lifecycle purposes.
Impact: runtime stays simple while offline optimization can evolve.
Migration cost: low.
Required benchmark: BM-EVAL-001 + optimization A/B.
