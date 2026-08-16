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
generated:
  by: process:claude-code-session
  at: 2026-08-16T00:00:00Z
status: draft
---

# Built-In Capability Matrix

Classification: `NATIVE` (ships working out of the box) / `SDK-PROVIDED`
(interface + one reference implementation) / `EXTERNAL_SERVICE` (requires a
separately-hosted or cloud service) / `NOT_RESEARCHED`.

**Rule enforced here**: never call something "built in" when it is an
external managed service wearing an SDK-shaped interface. This matrix
exists specifically to keep that distinction visible.

| Capability                                               | OpenAI Agents SDK                                                                             | Microsoft Agent Framework                                                                                                 | PydanticAI                                                                                                                                                                                                                       |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shell execution                                          | NATIVE (local by default)                                                                     | NOT_RESEARCHED                                                                                                            | NOT_RESEARCHED                                                                                                                                                                                                                   |
| Computer/GUI use                                         | SDK-PROVIDED (caller implements `Computer` interface)                                         | NOT_RESEARCHED                                                                                                            | NOT_RESEARCHED                                                                                                                                                                                                                   |
| File patch/edit                                          | SDK-PROVIDED (caller implements `ApplyPatchEditor`)                                           | NOT_RESEARCHED                                                                                                            | NOT_RESEARCHED                                                                                                                                                                                                                   |
| Web search                                               | EXTERNAL_SERVICE (OpenAI-hosted)                                                              | NOT_RESEARCHED                                                                                                            | NOT_RESEARCHED                                                                                                                                                                                                                   |
| Code execution                                           | EXTERNAL_SERVICE (OpenAI-hosted sandbox)                                                      | NOT_RESEARCHED                                                                                                            | NOT_RESEARCHED                                                                                                                                                                                                                   |
| Guardrails (agent-level)                                 | NATIVE                                                                                        | NOT_RESEARCHED                                                                                                            | NOT_RESEARCHED                                                                                                                                                                                                                   |
| Guardrails (tool-level, independent of agent guardrails) | NATIVE — `ToolInputGuardrail`/`ToolOutputGuardrail`                                           | NOT_RESEARCHED                                                                                                            | NOT_RESEARCHED                                                                                                                                                                                                                   |
| Sessions                                                 | SDK-PROVIDED (`Session` interface; `MemorySession` local, `OpenAIConversationsSession` cloud) | NOT_RESEARCHED                                                                                                            | NOT_RESEARCHED                                                                                                                                                                                                                   |
| Compaction                                               | EXTERNAL_SERVICE (`OpenAIResponsesCompactionSession` calls the hosted Responses API)          | NOT_RESEARCHED                                                                                                            | NOT_RESEARCHED                                                                                                                                                                                                                   |
| Workflow orchestration                                   | NOT_RESEARCHED (out of scope for this installment)                                            | NATIVE — explicit Workflow layer, distinct from Agent loop                                                                | NOT_RESEARCHED                                                                                                                                                                                                                   |
| Checkpointing                                            | NOT_RESEARCHED                                                                                | SDK-PROVIDED — interface + `CosmosCheckpointStorage` reference implementation (cloud-backed); local backend not confirmed | NOT_RESEARCHED                                                                                                                                                                                                                   |
| Durable execution                                        | NOT_RESEARCHED                                                                                | NOT_RESEARCHED                                                                                                            | SDK-PROVIDED (capability-attachment model) — but the maintainers' own open issue (#5477) states there is no first-class abstraction yet, so classify this as "SDK-PROVIDED, acknowledged incomplete," not "SDK-PROVIDED, mature" |
| MCP support                                              | NOT_RESEARCHED                                                                                | NOT_RESEARCHED                                                                                                            | NATIVE — durable agents explicitly documented to retain MCP support                                                                                                                                                              |

## Cells marked NOT_RESEARCHED

These are genuinely absent evidence, not a claim of absence. Populating them
requires the same per-framework fetch discipline used for the cells above —
each row/column intersection needs its own primary-source citation before
it can move out of `NOT_RESEARCHED`.
