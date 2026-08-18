---
type: Research Consolidation Report
title: Token/Context-Efficiency Comparative Audit
description: Documented context-compaction, caching, and academic grounding across the installments 1-3 framework set (OpenAI Agents SDK, Microsoft Agent Framework, PydanticAI, Kimi Agent SDK, Qwen-Agent, Tencent Youtu-Agent, LangGraph, Mastra) plus Volcengine AgentKit and Baidu AppBuilder SDK
sources:
  - resource: research/frameworks/volcengine-agentkit/overview.md
    id: volcengine
  - resource: research/frameworks/baidu-appbuilder-sdk/overview.md
    id: baidu
  - resource: research/frameworks/pydantic-ai/overview.md
    id: pydantic-ai
  - resource: research/frameworks/kimi-agent-sdk/overview.md
    id: kimi
  - resource: research/comparison/CURRENT-WAVE-EFFICIENCY.md
    id: prior-efficiency-findings
generated:
  by: process:claude-code-session
  at: 2026-08-18T00:00:00Z
status: draft
x_evidence_level: E2
x_coverage: partial
x_provenance: substantially adapted from a user-supplied external research pass whose citations were unverifiable bare bracketed numbers with no bibliography (see research/imported-corpus/SOURCE-RECEIPT-5.md) - only the low-risk absence-claims and this session's own independently verified findings are retained; presence-claims about specific documented mechanisms are tagged DOCUMENTED_NOT_REPRODUCED
---

# Token/Context-Efficiency Comparative Audit

> **Scope note**: `research/comparison/CURRENT-WAVE-EFFICIENCY.md` already
> covers efficiency findings for the "current wave" corpus's own framework
> set (OpenAI Agents SDK, browser-use, MCP protocol-level findings). This
> document covers the installments 1-3 framework set specifically
> (PydanticAI, Kimi Agent SDK, Qwen-Agent, Tencent Youtu-Agent, LangGraph,
> Mastra) plus the two new frameworks from this pass (Volcengine
> AgentKit, Baidu AppBuilder SDK) — a different scope, not a duplicate.

## Comparison table

| Framework                                          | Compaction mechanism                                                                                                                        | Caching strategy                                                            | Published benchmark data                                                                                                              | Academic grounding                         | Evidence                                                            |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------- |
| Volcengine AgentKit / VeADK                        | `UNKNOWN` — not documented in the fetched README                                                                                            | Provider-side, via the Volcengine ARK endpoint (unconfirmed detail)         | No — a "99% token savings" claim was checked independently this session and could not be corroborated by any source; not counted here | `UNKNOWN`                                  | [E3] `research/frameworks/volcengine-agentkit/overview.md`          |
| Baidu AppBuilder SDK                               | `UNKNOWN` — not documented in the fetched README                                                                                            | Provider-side (Baidu AI Studio LLM API)                                     | No                                                                                                                                    | `UNKNOWN`                                  | [E3] `research/frameworks/baidu-appbuilder-sdk/overview.md`         |
| PydanticAI                                         | None built-in — caller-managed via `message_history` parameter                                                                              | Caller-managed (framework passes history explicitly, does not itself cache) | No                                                                                                                                    | N/A — no compaction technique to attribute | [E3] `research/frameworks/pydantic-ai/overview.md`'s deepening pass |
| Kimi Agent SDK                                     | `UNKNOWN` — relies on Kimi K3's documented long-context window rather than SDK-side compaction (claim not independently verified this pass) | `DOCUMENTED_NOT_REPRODUCED`                                                 | No                                                                                                                                    | `UNKNOWN`                                  | External corpus claim, not independently re-verified                |
| Qwen-Agent, Tencent Youtu-Agent, LangGraph, Mastra | Not assessed this pass                                                                                                                      | Not assessed this pass                                                      | Not assessed this pass                                                                                                                | Not assessed this pass                     | Deferred — see Limitations                                          |

## Findings retained from the external research pass (absence claims, lower risk, adopted with caveat)

**No framework in this set publishes an independently reproducible
context-window cost benchmark.** This is an absence claim (harder to
fabricate convincingly than a presence claim) and is consistent with
this repository's own `GAP-E5-ZERO` finding that no framework researched
so far, across any corpus, ships a real reproducible benchmark for this
dimension. `DOCUMENTED_NOT_REPRODUCED` — not independently re-verified
framework-by-framework this pass, but plausible and consistent with prior
findings.

## Findings explicitly NOT retained from the external research pass

The external corpus's specific claim that Volcengine AgentKit achieves
"up to 99% token savings" via a named "OpenViking" memory layer was
**checked independently this session via WebSearch and could not be
corroborated by any source** (see `research/frameworks/volcengine-agentkit/overview.md`'s
"Unresolved" section). Not adopted, not repeated as fact.

## Academic grounding — not established this pass

The external corpus asserted that no vendor cited academic papers behind
their compaction techniques, but did not itself provide the comparison
against named techniques (e.g. MemGPT-style hierarchical memory,
retrieval-augmented context selection) that the research brief for this
module actually asked for. This is a real gap in this deliverable, not
silently closed — recorded as `NOT_EXECUTED`, not `UNKNOWN` (the
difference matters: `UNKNOWN` means "checked, no answer";
`NOT_EXECUTED` means "not actually attempted this pass").

## Limitations

1. Qwen-Agent, Tencent Youtu-Agent, LangGraph, and Mastra were not
   assessed for this specific dimension this pass — the original research
   commission asked for this, but time/scope did not permit a full
   independent verification pass across all 8+ frameworks. Recorded as
   deferred, not silently dropped.
2. "Caching strategy" cells for Volcengine/Baidu are inferred from
   general cloud-provider architecture patterns (both route through a
   hosted model endpoint), not from a specific documented caching
   mechanism — should be read as a plausible default, not a verified
   claim.
