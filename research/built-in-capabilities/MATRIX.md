---
type: Built-In Capability Matrix
title: Built-In Capability Matrix
description: Native vs SDK-provided vs external-service classification for researched frameworks
sources:
  - resource: /research/frameworks/openai-agents-sdk/overview.md
    id: oai
  - resource: /research/frameworks/microsoft-agent-framework/overview.md
    id: maf
  - resource: /research/frameworks/pydantic-ai/overview.md
    id: pai
  - resource: /research/frameworks/langgraph/overview.md
    id: langgraph
  - resource: /research/frameworks/mastra/overview.md
    id: mastra
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_coverage: 5 of 17 sources have at least one populated column; Qwen-Agent, Youtu-Agent, Kimi, Volcengine AgentKit and Baidu AppBuilder SDK were not researched against this specific dimension set (Volcengine/Baidu's 2026-08-18 research pass covered local-first/licensing/model-coupling only, not this capability matrix's tools/memory/checkpointing columns — see their overview.md files). A separate 5-framework supplementary comparison (OpenHands, Letta, Google ADK, Browser Use, CrewAI) is summarized below rather than added as columns, to keep this table readable — see /research/comparison/CAPABILITY-MATRIX.md
---

# Built-In Capability Matrix

Classification: `NATIVE` (ships working out of the box) / `SDK-PROVIDED`
(interface + one reference implementation) / `EXTERNAL_SERVICE` (requires a
separately-hosted or cloud service) / `NOT_RESEARCHED`.

**Rule enforced here**: never call something "built in" when it is an
external managed service wearing an SDK-shaped interface. This matrix
exists specifically to keep that distinction visible.

| Capability                                               | OpenAI Agents SDK                                                                             | Microsoft Agent Framework                                                                                                 | PydanticAI                                                                                                                                                                                                                       | LangGraph                                                                                                                                                                 | Mastra                                                                                                                                   |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Shell execution                                          | NATIVE (local by default)                                                                     | NOT_RESEARCHED                                                                                                            | NOT_RESEARCHED                                                                                                                                                                                                                   | NOT_RESEARCHED                                                                                                                                                            | NOT_RESEARCHED                                                                                                                           |
| Computer/GUI use                                         | SDK-PROVIDED (caller implements `Computer` interface)                                         | NOT_RESEARCHED                                                                                                            | NOT_RESEARCHED                                                                                                                                                                                                                   | NOT_RESEARCHED                                                                                                                                                            | NOT_RESEARCHED                                                                                                                           |
| File patch/edit                                          | SDK-PROVIDED (caller implements `ApplyPatchEditor`)                                           | NOT_RESEARCHED                                                                                                            | NOT_RESEARCHED                                                                                                                                                                                                                   | NOT_RESEARCHED                                                                                                                                                            | NOT_RESEARCHED                                                                                                                           |
| Web search                                               | EXTERNAL_SERVICE (OpenAI-hosted)                                                              | NOT_RESEARCHED                                                                                                            | NOT_RESEARCHED                                                                                                                                                                                                                   | NOT_RESEARCHED                                                                                                                                                            | NOT_RESEARCHED                                                                                                                           |
| Code execution                                           | EXTERNAL_SERVICE (OpenAI-hosted sandbox)                                                      | NOT_RESEARCHED                                                                                                            | NOT_RESEARCHED                                                                                                                                                                                                                   | NOT_RESEARCHED                                                                                                                                                            | NOT_RESEARCHED                                                                                                                           |
| Guardrails (agent-level)                                 | NATIVE                                                                                        | NOT_RESEARCHED                                                                                                            | NOT_RESEARCHED                                                                                                                                                                                                                   | NOT_RESEARCHED                                                                                                                                                            | NOT_RESEARCHED                                                                                                                           |
| Guardrails (tool-level, independent of agent guardrails) | NATIVE — `ToolInputGuardrail`/`ToolOutputGuardrail`                                           | NOT_RESEARCHED                                                                                                            | NOT_RESEARCHED                                                                                                                                                                                                                   | NOT_RESEARCHED                                                                                                                                                            | NOT_RESEARCHED                                                                                                                           |
| Sessions                                                 | SDK-PROVIDED (`Session` interface; `MemorySession` local, `OpenAIConversationsSession` cloud) | NOT_RESEARCHED                                                                                                            | NOT_RESEARCHED                                                                                                                                                                                                                   | NOT_RESEARCHED                                                                                                                                                            | NOT_RESEARCHED                                                                                                                           |
| Compaction                                               | EXTERNAL_SERVICE (`OpenAIResponsesCompactionSession` calls the hosted Responses API)          | NOT_RESEARCHED                                                                                                            | NOT_RESEARCHED                                                                                                                                                                                                                   | NOT_RESEARCHED                                                                                                                                                            | NOT_RESEARCHED                                                                                                                           |
| Workflow orchestration                                   | NOT_RESEARCHED (out of scope for this installment)                                            | NATIVE — explicit Workflow layer, distinct from Agent loop                                                                | NOT_RESEARCHED                                                                                                                                                                                                                   | **NATIVE** — StateGraph is the framework's core purpose, not an add-on                                                                                                    | **NATIVE** — graph-based workflow engine (`.then()`/`.branch()`/`.parallel()`), with suspend/resume                                      |
| Checkpointing                                            | NOT_RESEARCHED                                                                                | SDK-PROVIDED — interface + `CosmosCheckpointStorage` reference implementation (cloud-backed); local backend not confirmed | NOT_RESEARCHED                                                                                                                                                                                                                   | **NATIVE** — pluggable `Checkpointer`; memory/SQLite backends are first-class local options, not a degraded fallback behind Postgres/Mongo (correction — see overview.md) | **SDK-PROVIDED** — workflow snapshots persisted via pluggable storage; LibSQL gives a genuinely local file-DB path                       |
| Durable execution                                        | NOT_RESEARCHED                                                                                | NOT_RESEARCHED                                                                                                            | SDK-PROVIDED (capability-attachment model) — but the maintainers' own open issue (#5477) states there is no first-class abstraction yet, so classify this as "SDK-PROVIDED, acknowledged incomplete," not "SDK-PROVIDED, mature" | **NATIVE** — checkpoint-based state recovery on restart is a core, first-party mechanism, not an attached capability                                                      | **NATIVE** — workflow suspend/resume backed by persisted state is first-party, not attached                                              |
| Memory (conversation/semantic)                           | NOT_RESEARCHED                                                                                | NOT_RESEARCHED                                                                                                            | NOT_RESEARCHED                                                                                                                                                                                                                   | NOT_RESEARCHED                                                                                                                                                            | **NATIVE** — first-class memory system (working + semantic) with pluggable storage backends                                              |
| Filesystem / command execution (agent tool access)       | SDK-PROVIDED (caller implements `Computer`/`ApplyPatchEditor`)                                | NOT_RESEARCHED                                                                                                            | NOT_RESEARCHED                                                                                                                                                                                                                   | NOT_RESEARCHED                                                                                                                                                            | **NATIVE** — Workspace bundles filesystem/command-execution/search/skills with per-tool approval gating built in, not caller-implemented |
| MCP support                                              | NOT_RESEARCHED                                                                                | NOT_RESEARCHED                                                                                                            | NATIVE — durable agents explicitly documented to retain MCP support                                                                                                                                                              | NOT_RESEARCHED                                                                                                                                                            | NOT_RESEARCHED                                                                                                                           |

## Cells marked NOT_RESEARCHED

These are genuinely absent evidence, not a claim of absence. Populating them
requires the same per-framework fetch discipline used for the cells above —
each row/column intersection needs its own primary-source citation before
it can move out of `NOT_RESEARCHED`.

## Installment 3 observation

Both LangGraph and Mastra treat workflow orchestration and durable
state/checkpointing as **core, first-party mechanisms** rather than
attached or optional capabilities — a sharper distinction than PydanticAI
(durable execution is explicitly an attached capability, maintainers'
own words) or Microsoft Agent Framework (checkpointing exists but only a
cloud-backed reference implementation was confirmed). This is a real
architectural difference between "graph-based" frameworks (LangGraph,
Mastra) and "SDK-native"/"capability-attachment" frameworks (OpenAI Agents
SDK, PydanticAI) — worth tracking as evidence accumulates, not yet enough
sources to generalize past these two examples.

## Correction (this installment): LangGraph checkpointing was mis-classified

The Checkpointing row for LangGraph originally read "PostgreSQL/Redis
recommended for production" with an `SDK-PROVIDED` classification. Deeper
reading of the checkpointer interface shows in-memory/SQLite are first-class
local options, not a degraded fallback — reclassified `NATIVE` above. See
`research/frameworks/langgraph/overview.md` for the full correction and
`research/contradictions/checkpointing-vs-persistence-lifecycle.md` for the
more precise finding this correction surfaced: the real caveat is
persistence lifecycle (retention, schema migration), not backend choice.

## Mastra Workspace: strongest tool-boundary match found so far

Mastra's Workspace (filesystem/command execution/search/skills, each
independently configurable with per-tool approval gating) is the closest
match across all 8 frameworks researched to this repository's own planned
`adapters/tools/{filesystem,sandbox}` boundary combined with a policy layer
in one coherent abstraction. See `research/frameworks/mastra/overview.md`.

## Supplementary corpus: OpenHands, Letta, Google ADK, Browser Use, CrewAI

An imported research pass (see `research/local-first/SCORECARD.md`'s
"Supplementary corpus" section for the full provenance note) covers 5
additional frameworks beyond this table's 5 columns, using a differently
shaped capability matrix. Rather than force those into 5 more columns here
(the table is already wide), the full comparison lives at
`research/comparison/CAPABILITY-MATRIX.md` and
`research/comparison/SECURITY-MATRIX.md`. Key points that map onto this
table's existing rows:

- **Shell/filesystem**: NATIVE for OpenHands (built-in); tool-dependent for
  Letta, Google ADK, CrewAI; not core for Browser Use.
- **MCP support**: confirmed present for OpenHands, Letta (out-of-process),
  Google ADK; possible/cloud-integration for Browser Use; via integrations
  for CrewAI.

The imported corpus also names capability dimensions this table does not
yet have columns for — **Browser** (Browser Use's core capability),
**Skills** (all five, in varying maturity), **Subagents**, **Human
approval** (as an explicit state transition, not just a boolean), and
**Structured output** — worth adding as new rows once these frameworks are
independently re-verified rather than merged in as unverified columns now.

## Supplementary corpus, batch 2: Strands Agents, smolagents, AG2, LlamaIndex, Llama Agents, Haystack, DSPy, AutoGen, Semantic Kernel

A second imported comparison lives at
`research/comparison/NEXT-WAVE-CAPABILITY-MATRIX.md`, covering 9 more
frameworks across Core loop / Explicit workflow / Multi-agent / Durable
session-state / Local model / Evaluation / MCP / Sandboxing. Same
provenance caveat as batch 1 — not independently re-verified this session.
Two points worth surfacing here:

- **DSPy is architecturally different from every other framework
  researched so far** — it is a programming/optimization framework over an
  LM adapter (declarative program compilation, prompt/weight
  optimization), not an agent runtime with tools/memory/workflow in the
  usual sense. Its own comparison row is mostly "not core" for
  agent-runtime capabilities specifically _because_ those aren't its job —
  recorded as a genuine category difference, not a weak result. This
  motivates the `OptimizationPort` decision candidate in
  `.context/research/decisions.json` (kept separate from the runtime
  kernel, per the imported corpus's own `spec-delta.json` SPEC-006).
- **AutoGen and Semantic Kernel are migration-era research** — both
  frameworks' documented successor is Microsoft Agent Framework, already
  researched in installment 1. Their capability rows are historical
  context for understanding _why_ Microsoft Agent Framework's design looks
  the way it does, not two more independent capability data points.
