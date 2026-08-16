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
  - resource: /research/frameworks/qwen-agent/overview.md
    id: qwen
  - resource: /research/frameworks/tencent-youtu-agent/overview.md
    id: youtu
generated:
  by: process:claude-code-session
  at: 2026-08-16T00:00:00Z
status: draft
x_coverage: 6 of 17 sources named in the research brief; remainder UNKNOWN
---

# Local-First Scorecard

Classification legend: `LOCAL_NATIVE` / `LOCAL_WITH_ADAPTER` / `CLOUD_ONLY` /
`OPTIONAL_REMOTE` / `UNSUPPORTED` / `UNKNOWN` (not yet researched).

**Do not read a blank cell as "not local-first."** It means not yet
researched — the honest default per this repository's evidence rules is
`UNKNOWN`, never an inferred negative.

| Framework                 | Model exec                                                                                                                                                              | State/Session                                                                                              | Tools                                                                                           | Memory         | Checkpointing                                                                                                                                      | Overall verdict                                                                                                                                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OpenAI Agents SDK         | UNKNOWN (not directly researched)                                                                                                                                       | LOCAL_NATIVE (`MemorySession`) + CLOUD_ONLY (`OpenAIConversationsSession`) both exist behind one interface | Mixed — see `research/frameworks/openai-agents-sdk/overview.md` capability table                | UNKNOWN        | UNKNOWN                                                                                                                                            | **Local-capable via explicit opt-in, not local-first by default**                                                                                                                               |
| Microsoft Agent Framework | UNKNOWN                                                                                                                                                                 | UNKNOWN                                                                                                    | UNKNOWN                                                                                         | UNKNOWN        | LOCAL_WITH_ADAPTER — pluggable storage, `CosmosCheckpointStorage` is one cloud-backed example; local backends not confirmed either way             | UNKNOWN — insufficient evidence for an overall verdict                                                                                                                                          |
| PydanticAI                | Provider-adaptive per model, not specifically audited here                                                                                                              | UNKNOWN                                                                                                    | UNKNOWN                                                                                         | UNKNOWN        | LOCAL_WITH_ADAPTER — durable execution is an attachable capability; Temporal/DBOS/Prefect are typically self-hosted or hybrid, not mandatory cloud | UNKNOWN — insufficient evidence for an overall verdict                                                                                                                                          |
| Kimi Agent SDK            | UNKNOWN — genuinely unresolved, see overview.md                                                                                                                         | Session orchestration shared via CLI runtime; local/cloud split UNKNOWN                                    | Shared tools/skills/MCP config via CLI runtime                                                  | UNKNOWN        | UNKNOWN                                                                                                                                            | **UNKNOWN — the one framework where local-first status could not be determined even after a direct fetch**                                                                                      |
| **Qwen-Agent**            | **LOCAL_WITH_ADAPTER** — first-party vLLM (GPU) / Ollama (CPU+GPU) self-hosted path documented alongside DashScope hosted option                                        | not researched                                                                                             | LOCAL_WITH_ADAPTER — sandboxed code interpreter, confirmation-gated before sensitive operations | not researched | not researched                                                                                                                                     | **Strongest local-first signal found so far — model execution itself has a documented local path, not just surrounding tooling**                                                                |
| **Tencent Youtu-Agent**   | **CLOUD_ONLY as configured by default** — setup requires an LLM provider API key (DeepSeek named explicitly); offline operation not demonstrated for the default config | not researched                                                                                             | LOCAL_NATIVE — `Environment` abstraction (browser/shell) runs locally                           | not researched | not researched                                                                                                                                     | **Correction to the brief's own framing: NOT confirmed local-first, despite being named a high-priority local-first reference** — see `research/contradictions/priority-list-not-infallible.md` |
| Volcengine AgentKit       | not researched                                                                                                                                                          | not researched                                                                                             | not researched                                                                                  | not researched | not researched                                                                                                                                     | UNKNOWN                                                                                                                                                                                         |
| Baidu AppBuilder SDK      | not researched                                                                                                                                                          | not researched                                                                                             | not researched                                                                                  | not researched | not researched                                                                                                                                     | UNKNOWN                                                                                                                                                                                         |
| LangGraph                 | not researched                                                                                                                                                          | not researched                                                                                             | not researched                                                                                  | not researched | not researched                                                                                                                                     | UNKNOWN                                                                                                                                                                                         |
| Mastra                    | not researched                                                                                                                                                          | not researched                                                                                             | not researched                                                                                  | not researched | not researched                                                                                                                                     | UNKNOWN                                                                                                                                                                                         |
| MCP                       | not researched                                                                                                                                                          | not researched                                                                                             | not researched                                                                                  | not researched | not researched                                                                                                                                     | UNKNOWN                                                                                                                                                                                         |
| A2A                       | not researched                                                                                                                                                          | not researched                                                                                             | not researched                                                                                  | not researched | not researched                                                                                                                                     | UNKNOWN                                                                                                                                                                                         |
| Agent Skills              | not researched                                                                                                                                                          | not researched                                                                                             | not researched                                                                                  | not researched | not researched                                                                                                                                     | UNKNOWN                                                                                                                                                                                         |

## Installment 2 correction

The original research brief named Qwen-Agent and Youtu-Agent as
"HIGH-PRIORITY LOCAL-FIRST REFERENCES" before any evidence was gathered.
Direct research confirms this for Qwen-Agent (genuinely strong local-first
posture — the best found across all 6 frameworks researched so far) but
**not** for Youtu-Agent (cloud-configured by default). This is recorded as
a correction, not smoothed over — see
`research/contradictions/priority-list-not-infallible.md`.

## What this scorecard can support right now

Two findings are load-bearing enough to act on:

1. **"local-first" and "explicit local/cloud split with a shared
   interface" are not the same thing**, and conflating them is a design
   error. OpenAI's SDK demonstrates the second (a `Session` interface with
   one local and one cloud implementation, caller chooses) — worth
   adopting regardless of OpenAI's aggregate local-first status.
2. **A framework being named "high-priority" for a property does not make
   it true of that framework** — Qwen-Agent bore out the brief's
   expectation, Youtu-Agent did not. Evidence discipline caught this;
   trusting the brief's framing would not have.

## Next installment

Remaining 11 primary/secondary sources require the same fetch-and-verify
treatment before their rows can move past `UNKNOWN`: Volcengine AgentKit
and Baidu AppBuilder SDK next (completing the primary local-first-relevant
set), then LangGraph and Mastra, then the protocol layer (MCP, A2A, Agent
Skills).
