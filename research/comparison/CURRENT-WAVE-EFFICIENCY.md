---
type: Framework Research
title: Efficiency Findings
description: 'Comparison matrix: Efficiency Findings, imported from the "current wave" research corpus'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus ("current wave"), URLs not independently re-verified via WebFetch/WebSearch in this session - treat as DOCUMENTED_NOT_REPRODUCED
---

# Efficiency Findings

## Verified directional findings

- OpenAI supports cheap/fast guardrails ahead of expensive model execution when blocking guardrails are used, explicitly framing this as a cost-control technique. [OpenAI](https://openai.github.io/openai-agents-python/guardrails/)
- OpenAI Agents SDK includes tool search/deferred tool surfaces and built-in orchestration patterns; this supports reducing always-loaded tool context, but exact token savings require E5 benchmarking. [OpenAI examples](https://openai.github.io/openai-agents-python/examples/)
- Browser-use performs explicit message compaction, DOM/markdown extraction and optional screenshot inclusion, demonstrating that browser agents need context shaping rather than raw page ingestion. [browser-use](https://github.com/browser-use/browser-use/blob/main/browser_use/agent/service.py)
- MCP 2026-07-28 adds cacheable list results and MRTR, both directly relevant to protocol round trips and context/tool discovery overhead. [MCP](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
- Multi-agent coordination cost is architecture-dependent. No numeric savings are claimed here because matched E5 experiments were not run.

## Recommended efficiency ladder

`CACHE -> RETRIEVE -> SUMMARIZE/COMPRESS -> DETERMINISTIC -> CHEAP MODEL -> STRONG MODEL -> MULTI-AGENT -> HUMAN`

The runtime should expose budgets for model calls, tool calls, latency, CPU, RAM, network and storage.

## Token-efficiency architecture

Create explicit budgets at:

- run
- workflow step
- model call
- tool result
- memory retrieval
- browser observation

Keep context selection separate from the model provider so the same budget policy can be benchmarked across providers.
