---
type: Local-First Scorecard
title: Local-First Scorecard
description: Per-capability local-first classification across researched agent SDKs
sources:
  - resource: /research/frameworks/openai-agents-sdk/overview.md
    id: oai
  - resource: /research/frameworks/microsoft-agent-framework/overview.md
    id: maf
  - resource: /research/frameworks/pydantic-ai/overview.md
    id: pai
  - resource: /research/frameworks/kimi-agent-sdk/overview.md
    id: kimi
generated:
  by: process:claude-code-session
  at: 2026-08-16T00:00:00Z
status: draft
x_coverage: 4 of 17 sources named in the research brief; remainder UNKNOWN
---

# Local-First Scorecard

Classification legend: `LOCAL_NATIVE` / `LOCAL_WITH_ADAPTER` / `CLOUD_ONLY` /
`OPTIONAL_REMOTE` / `UNSUPPORTED` / `UNKNOWN` (not yet researched).

**Do not read a blank cell as "not local-first."** It means not yet
researched — the honest default per this repository's evidence rules is
`UNKNOWN`, never an inferred negative.

| Framework                 | Model exec                                                 | State/Session                                                                                              | Tools                                                                            | Memory         | Checkpointing                                                                                                                                      | Overall verdict                                                                                            |
| ------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| OpenAI Agents SDK         | UNKNOWN (not directly researched)                          | LOCAL_NATIVE (`MemorySession`) + CLOUD_ONLY (`OpenAIConversationsSession`) both exist behind one interface | Mixed — see `research/frameworks/openai-agents-sdk/overview.md` capability table | UNKNOWN        | UNKNOWN                                                                                                                                            | **Local-capable via explicit opt-in, not local-first by default**                                          |
| Microsoft Agent Framework | UNKNOWN                                                    | UNKNOWN                                                                                                    | UNKNOWN                                                                          | UNKNOWN        | LOCAL_WITH_ADAPTER — pluggable storage, `CosmosCheckpointStorage` is one cloud-backed example; local backends not confirmed either way             | UNKNOWN — insufficient evidence for an overall verdict                                                     |
| PydanticAI                | Provider-adaptive per model, not specifically audited here | UNKNOWN                                                                                                    | UNKNOWN                                                                          | UNKNOWN        | LOCAL_WITH_ADAPTER — durable execution is an attachable capability; Temporal/DBOS/Prefect are typically self-hosted or hybrid, not mandatory cloud | UNKNOWN — insufficient evidence for an overall verdict                                                     |
| Kimi Agent SDK            | UNKNOWN — genuinely unresolved, see overview.md            | Session orchestration shared via CLI runtime; local/cloud split UNKNOWN                                    | Shared tools/skills/MCP config via CLI runtime                                   | UNKNOWN        | UNKNOWN                                                                                                                                            | **UNKNOWN — the one framework where local-first status could not be determined even after a direct fetch** |
| LangGraph                 | not researched                                             | not researched                                                                                             | not researched                                                                   | not researched | not researched                                                                                                                                     | UNKNOWN                                                                                                    |
| Mastra                    | not researched                                             | not researched                                                                                             | not researched                                                                   | not researched | not researched                                                                                                                                     | UNKNOWN                                                                                                    |
| Qwen-Agent                | not researched                                             | not researched                                                                                             | not researched                                                                   | not researched | not researched                                                                                                                                     | UNKNOWN                                                                                                    |
| Tencent Youtu-Agent       | not researched                                             | not researched                                                                                             | not researched                                                                   | not researched | not researched                                                                                                                                     | UNKNOWN                                                                                                    |
| Volcengine AgentKit       | not researched                                             | not researched                                                                                             | not researched                                                                   | not researched | not researched                                                                                                                                     | UNKNOWN                                                                                                    |
| Baidu AppBuilder SDK      | not researched                                             | not researched                                                                                             | not researched                                                                   | not researched | not researched                                                                                                                                     | UNKNOWN                                                                                                    |
| MCP                       | not researched                                             | not researched                                                                                             | not researched                                                                   | not researched | not researched                                                                                                                                     | UNKNOWN                                                                                                    |
| A2A                       | not researched                                             | not researched                                                                                             | not researched                                                                   | not researched | not researched                                                                                                                                     | UNKNOWN                                                                                                    |
| Agent Skills              | not researched                                             | not researched                                                                                             | not researched                                                                   | not researched | not researched                                                                                                                                     | UNKNOWN                                                                                                    |

## What this scorecard can support right now

Only one finding is load-bearing enough to act on: **the "local-first" and
"explicit local/cloud split with a shared interface" patterns are not the
same thing**, and conflating them would be a design error. OpenAI's SDK
demonstrates the second (a `Session` interface with one local and one
cloud implementation, caller chooses) — that is worth adopting regardless
of whether OpenAI's SDK is "local-first" in the aggregate, which it is not.

## Next installment

Remaining 9 primary/secondary sources require the same fetch-and-verify
treatment before their rows can move past `UNKNOWN`. Prioritized by the
original brief's own "HIGH-PRIORITY LOCAL-FIRST REFERENCES" list: Qwen-Agent
and Youtu-Agent offline patterns next, then the remaining primary set.
