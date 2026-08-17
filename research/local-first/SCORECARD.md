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
  - resource: /research/frameworks/langgraph/overview.md
    id: langgraph
  - resource: /research/frameworks/mastra/overview.md
    id: mastra
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_coverage: 8 of 17 sources named in the research brief; remainder UNKNOWN
---

# Local-First Scorecard

Classification legend: `LOCAL_NATIVE` / `LOCAL_WITH_ADAPTER` / `CLOUD_ONLY` /
`OPTIONAL_REMOTE` / `UNSUPPORTED` / `UNKNOWN` (not yet researched). Installment
3's per-framework overview docs additionally use `HYBRID` and `LOCAL_CAPABLE`
as overall-verdict labels for LangGraph and Mastra — read as synonyms for
`LOCAL_WITH_ADAPTER` in this table's terms (a local path genuinely exists but
is not the framework's unqualified default); not yet unified into one
official enum, recorded as-is rather than silently reworded.

**Do not read a blank cell as "not local-first."** It means not yet
researched — the honest default per this repository's evidence rules is
`UNKNOWN`, never an inferred negative.

| Framework                 | Model exec                                                                                                                                                              | State/Session                                                                                                                        | Tools                                                                                           | Memory                                                          | Checkpointing                                                                                                                                            | Overall verdict                                                                                                                                                                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OpenAI Agents SDK         | UNKNOWN (not directly researched)                                                                                                                                       | LOCAL_NATIVE (`MemorySession`) + CLOUD_ONLY (`OpenAIConversationsSession`) both exist behind one interface                           | Mixed — see `research/frameworks/openai-agents-sdk/overview.md` capability table                | UNKNOWN                                                         | UNKNOWN                                                                                                                                                  | **Local-capable via explicit opt-in, not local-first by default**                                                                                                                                                                                   |
| Microsoft Agent Framework | UNKNOWN                                                                                                                                                                 | UNKNOWN                                                                                                                              | UNKNOWN                                                                                         | UNKNOWN                                                         | LOCAL_WITH_ADAPTER — pluggable storage, `CosmosCheckpointStorage` is one cloud-backed example; local backends not confirmed either way                   | UNKNOWN — insufficient evidence for an overall verdict                                                                                                                                                                                              |
| PydanticAI                | Provider-adaptive per model, not specifically audited here                                                                                                              | UNKNOWN                                                                                                                              | UNKNOWN                                                                                         | UNKNOWN                                                         | LOCAL_WITH_ADAPTER — durable execution is an attachable capability; Temporal/DBOS/Prefect are typically self-hosted or hybrid, not mandatory cloud       | UNKNOWN — insufficient evidence for an overall verdict                                                                                                                                                                                              |
| Kimi Agent SDK            | UNKNOWN — genuinely unresolved, see overview.md                                                                                                                         | Session orchestration shared via CLI runtime; local/cloud split UNKNOWN                                                              | Shared tools/skills/MCP config via CLI runtime                                                  | UNKNOWN                                                         | UNKNOWN                                                                                                                                                  | **UNKNOWN — the one framework where local-first status could not be determined even after a direct fetch**                                                                                                                                          |
| **Qwen-Agent**            | **LOCAL_WITH_ADAPTER** — first-party vLLM (GPU) / Ollama (CPU+GPU) self-hosted path documented alongside DashScope hosted option                                        | not researched                                                                                                                       | LOCAL_WITH_ADAPTER — sandboxed code interpreter, confirmation-gated before sensitive operations | not researched                                                  | not researched                                                                                                                                           | **Strongest local-first signal found so far — model execution itself has a documented local path, not just surrounding tooling**                                                                                                                    |
| **Tencent Youtu-Agent**   | **CLOUD_ONLY as configured by default** — setup requires an LLM provider API key (DeepSeek named explicitly); offline operation not demonstrated for the default config | not researched                                                                                                                       | LOCAL_NATIVE — `Environment` abstraction (browser/shell) runs locally                           | not researched                                                  | not researched                                                                                                                                           | **Correction to the brief's own framing: NOT confirmed local-first, despite being named a high-priority local-first reference** — see `research/contradictions/priority-list-not-infallible.md`                                                     |
| **LangGraph**             | UNKNOWN — not directly researched                                                                                                                                       | LOCAL_WITH_ADAPTER — SQLite checkpointer is genuinely local (single-process); PostgreSQL/Redis required for production multi-process | not researched                                                                                  | not researched                                                  | **LOCAL_WITH_ADAPTER** — pluggable `Checkpointer` (memory/SQLite/Postgres/Redis); local path exists but production guidance steers toward external infra | **HYBRID** — genuinely self-hostable with a real local single-process path, but not `FULLY_LOCAL`: production deployment adds Postgres+Redis, and the server component (`langgraph-api`) is separately licensed (Elastic License 2.0, not MIT)      |
| **Mastra**                | UNKNOWN leaning CLOUD_ADAPTIVE — "90+ providers through one interface" implies provider routing; no local-model provider confirmed either way this pass                 | not researched                                                                                                                       | not researched                                                                                  | **LOCAL_NATIVE** — first-class memory system, pluggable storage | **LOCAL_NATIVE** — `LibSQLStore` with `file:` URL is a genuinely local, zero-external-infra file database                                                | **LOCAL_CAPABLE** — strongest local-first _storage_ story of the two graph-based frameworks researched (no Postgres/Redis requirement the way LangGraph's production path implies); model-execution local-first status remains genuinely unresolved |
| Volcengine AgentKit       | not researched                                                                                                                                                          | not researched                                                                                                                       | not researched                                                                                  | not researched                                                  | not researched                                                                                                                                           | UNKNOWN                                                                                                                                                                                                                                             |
| Baidu AppBuilder SDK      | not researched                                                                                                                                                          | not researched                                                                                                                       | not researched                                                                                  | not researched                                                  | not researched                                                                                                                                           | UNKNOWN                                                                                                                                                                                                                                             |
| MCP                       | N/A — protocol, not a runtime                                                                                                                                           | N/A — protocol deliberately minimizes its own session state as of 2026-07-28 (see `research/protocols/mcp-2026-07-28.md`)            | N/A                                                                                             | N/A                                                             | N/A                                                                                                                                                      | See `research/protocols/mcp-2026-07-28.md` — not a local-first/cloud-only axis, a stateless-core protocol design                                                                                                                                    |
| A2A                       | not researched                                                                                                                                                          | not researched                                                                                                                       | not researched                                                                                  | not researched                                                  | not researched                                                                                                                                           | UNKNOWN                                                                                                                                                                                                                                             |
| Agent Skills              | not researched                                                                                                                                                          | not researched                                                                                                                       | not researched                                                                                  | not researched                                                  | not researched                                                                                                                                           | UNKNOWN                                                                                                                                                                                                                                             |

## Installment 2 correction

The original research brief named Qwen-Agent and Youtu-Agent as
"HIGH-PRIORITY LOCAL-FIRST REFERENCES" before any evidence was gathered.
Direct research confirms this for Qwen-Agent (genuinely strong local-first
posture — the best found across all 6 frameworks researched so far) but
**not** for Youtu-Agent (cloud-configured by default). This is recorded as
a correction, not smoothed over — see
`research/contradictions/priority-list-not-infallible.md`.

## Installment 3 addition

LangGraph and Mastra are both genuinely self-hostable, but for different
reasons and to different degrees: Mastra's LibSQL storage is local-native
with no external infra; LangGraph's production-recommended path requires
PostgreSQL and Redis even though a local SQLite path exists. Neither
displaces Qwen-Agent as the strongest local-first _model execution_
reference — both LangGraph and Mastra leave model-execution local-first
status `UNKNOWN`, since neither was found to confirm a local-model provider
path (e.g. Ollama) the way Qwen-Agent's vLLM/Ollama documentation does.

## What this scorecard can support right now

Three findings are load-bearing enough to act on:

1. **"local-first" and "explicit local/cloud split with a shared
   interface" are not the same thing**, and conflating them is a design
   error. OpenAI's SDK demonstrates the second (a `Session` interface with
   one local and one cloud implementation, caller chooses) — worth
   adopting regardless of OpenAI's aggregate local-first status.
2. **A framework being named "high-priority" for a property does not make
   it true of that framework** — Qwen-Agent bore out the brief's
   expectation, Youtu-Agent did not. Evidence discipline caught this;
   trusting the brief's framing would not have.
3. **"Local-first" is not one axis, it is at least three (model execution,
   state/checkpointing, tools/storage) that vary independently per
   framework** — LangGraph and Mastra are each strong on one axis
   (checkpointing / storage respectively) and unresolved on another (model
   execution for both). A single overall verdict per framework understates
   this; the per-capability columns are the load-bearing data, the verdict
   column is a summary, not a substitute.

## Next installment

Remaining 9 primary/secondary sources require the same fetch-and-verify
treatment before their rows can move past `UNKNOWN`: Volcengine AgentKit and
Baidu AppBuilder SDK next (completing the primary local-first-relevant set),
then A2A and Agent Skills (the remaining protocol layer — MCP is now
covered).
