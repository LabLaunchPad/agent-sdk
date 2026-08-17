---
type: Framework Research
title: 'State, Context, Memory — Current-Wave Extraction'
description: 'Comparison matrix: State, Context, Memory — Current-Wave Extraction, imported from the "current wave" research corpus'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus ("current wave"), URLs not independently re-verified via WebFetch/WebSearch in this session - treat as DOCUMENTED_NOT_REPRODUCED
---

# State, Context, Memory — Current-Wave Extraction

## Canonical separation

**State** = execution facts required to continue.

**Memory** = intentionally retained knowledge across runs.

**Context** = information selected for one model call.

**Knowledge** = reusable grounded information.

**Evidence** = provenance supporting a claim.

**Transcript** = interaction/history record.

## Findings

### OpenAI Agents SDK

Sessions are an explicit persistent memory layer for conversation history within an agent loop; they are not interchangeable with OpenAI-managed conversation continuation. The SDK also exposes RunConfig session controls and sandbox state. [OpenAI](https://openai.github.io/openai-agents-python/sessions/) [OpenAI](https://openai.github.io/openai-agents-python/running_agents/)

### Microsoft Agent Framework

The current architecture explicitly introduces session-based state management, context providers for memory, and workflow checkpointing. The docs sequence “sessions -> memory/persistence -> workflows -> harness”, which is a strong signal that these are different concerns. [Microsoft](https://learn.microsoft.com/en-us/agent-framework/overview/) [Microsoft](https://learn.microsoft.com/en-us/agent-framework/get-started/)

### MCP

The 2026-07-28 revision explicitly removes handshake/session state from the protocol core. This makes MCP better modeled as a capability/data protocol adapter than as LabLaunchPad runtime state. [MCP](https://blog.modelcontextprotocol.io/posts/2026-07-28/)

### A2A

A2A introduces server-owned Task state and contextId for grouping related interactions. An A2A client should not assume access to the remote agent's memory, plans or tools; the remote agent is opaque. [A2A](https://a2a-protocol.org/latest/topics/key-concepts/)

## LabLaunchPad contract

| Object         | Owner                   | Persistence       | Lifecycle               | Security                            |
| -------------- | ----------------------- | ----------------- | ----------------------- | ----------------------------------- |
| ExecutionState | Runtime                 | durable optional  | run/checkpoint          | authenticated + integrity protected |
| Memory         | Memory Engine           | durable           | promote/edit/invalidate | scoped + provenance                 |
| Context        | Context Engine          | derived/cacheable | per model call          | source-labelled                     |
| Knowledge      | Knowledge Engine        | durable           | versioned               | provenance + freshness              |
| Evidence       | Evidence/Research layer | durable           | append + supersede      | immutable reference semantics       |
| Transcript     | interaction layer       | durable optional  | session/run             | privacy policy                      |

## Architectural consequence

Do **not** allow transcript rows to become the canonical state model. Do **not** allow memory stores to silently determine tool permissions. Do **not** let context compaction mutate durable memory without an explicit promotion operation.
