---
type: Framework Research
title: EFFICIENCY
description: 'Comparison matrix imported from a prior "next wave" external research pass (batch 2, 9 frameworks: Strands Agents, smolagents, AG2, LlamaIndex, Llama Agents, Haystack, DSPy, AutoGen, Semantic Kernel)'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "EFFICIENCY" | title: "Efficiency" | date: "2026-08-17" | source_type: "research" | evidence_standard: "E0-E5" | status: "RESEARCH_COMPLETE" | tags: |   - "efficiency" |   - "cost"'
---

# EFFICIENCY

## Cost model

The frameworks expose different optimization levers:

- **smolagents/Strands:** reduce framework overhead; let the model drive the loop. Risk: more tokens or retries when explicit orchestration would have prevented wandering.
- **Haystack/LlamaIndex:** spend more architecture and configuration effort to control retrieval, routing and execution. Benefit: predictable reuse and selective context.
- **AG2:** multi-agent coordination can create duplicated context, tool calls and latency. Its strength appears when decomposition or role separation actually changes the quality or reliability of the outcome.
- **DSPy:** optimization spends offline evaluation/compilation cost to improve online program behavior. This belongs outside the runtime kernel.
- **Llama Agents:** event/step orchestration is useful when long-running or asynchronous execution warrants explicit scheduling/control.
- **AutoGen/SK migration:** Microsoft explicitly reports simplification and improved object creation/memory behavior in the successor, and adds explicit workflows/state to address long-running/HITL use cases.

## LabLaunchPad execution hierarchy

`DETERMINISTIC -> CACHE -> COMPILED -> CHEAP/LOCAL MODEL -> FRONTIER MODEL -> MULTI-AGENT -> HUMAN`

This is a **candidate policy**, not a universal runtime rule. A request should move down the hierarchy only when the expected value of quality, uncertainty reduction or safety exceeds added latency/cost.

## Measurements to collect in E5 reproduction

- model input/output tokens
- context tokens before/after compaction
- tool-call count
- model-call count
- planning tokens
- coordination tokens
- wall-clock latency
- CPU/RAM
- network bytes
- cache hit rate
- failure/retry rate
- human intervention time
