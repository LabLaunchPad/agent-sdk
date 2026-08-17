---
type: Framework Research
title: LangGraph
description: StateGraph/checkpointer architecture, self-hosted deployment requirements, licensing split and a checkpointer security finding for LangGraph
sources:
  - resource: https://github.com/langchain-ai/langgraph/blob/main/LICENSE
    id: langgraph-license
  - resource: https://research.checkpoint.com/2026/from-sqli-to-rce-exploiting-langgraphs-checkpointer/
    id: langgraph-checkpointer-cve
  - resource: https://generativeai.pub/attach-external-postgres-and-redis-server-to-self-host-langgraph-apis-1455a5cfb054
    id: langgraph-self-host
  - resource: https://rvernica.github.io/2026/03/langchain-license
    id: langgraph-license-split
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_evidence_level: E3
x_coverage: local-first, licensing, checkpointer architecture, one security finding — full 14/40-dimension depth not yet researched
---

# LangGraph

> **Coverage note.** This installment covers StateGraph/checkpointer
> architecture, self-hosted deployment requirements, licensing (including a
> license split worth flagging), and one relevant security finding. State,
> memory, evaluation, DX/UX not yet researched.

## Licensing [E3] — split, not uniform

The core library is MIT: `langgraph`, `langchain-core`, and model integration
packages are MIT-licensed, copyright LangChain, Inc.[^langgraph-license]
**But** `langgraph-api` — the server component used for deployment — is
licensed under the **Elastic License 2.0**, which restricts offering the
software as a competing hosted service and can require commercial licensing
for some production deployments.[^langgraph-license-split] This is a
genuine license-type split within one framework, not a single uniform
grant — the same shape of finding as Mastra's `ee/`-directory carve-out (see
`research/frameworks/mastra/overview.md`), now observed twice independently.
**LabLaunchPad implication**: "the framework is MIT" is not sufficient due
diligence — the specific package/directory must be checked, every time.

## Architecture: StateGraph + Checkpointer [E3]

- **StateGraph**: nodes execute against a shared, typed state object; graph
  structure is explicit (not implicit from control flow).
- **Checkpointer**: persists state after every node execution. On restart,
  the deployment queries the checkpoint backend to retrieve the last known
  state and inject it into a new graph instance — this is LangGraph's
  concrete answer to durable execution.
- **Backend options**: in-memory (dev only), SQLite (`langgraph-checkpoint-sqlite`,
  single-process), PostgreSQL (`PostgresSaver`, durable, multi-process),
  Redis (streaming pub/sub for token-by-token output, and as a checkpoint
  backend for multi-process deployments).[^langgraph-self-host]

## Local-first classification

| Capability            | Classification                                                                                                                                                                     | Evidence       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| Model execution       | UNKNOWN — not directly researched this pass; LangGraph is a graph-orchestration layer over LangChain model integrations, not itself a model runtime                                | not researched |
| State / checkpointing | **HYBRID** — SQLite checkpointer works fully local/offline for single-process/dev use; PostgreSQL + Redis are the documented requirement for durable, multi-process production use | [E3] websearch |
| Server/API deployment | **LOCAL_CAPABLE with a license caveat** — `langgraph-api` can be self-hosted (Self-Hosted Lite/Enterprise tiers, Docker), but is Elastic License 2.0, not MIT                      | [E3] websearch |

**Verdict**: `HYBRID`. LangGraph is genuinely self-hostable and has a local
single-process path (SQLite checkpointer, in-process execution), but its own
documentation steers production deployments toward PostgreSQL+Redis, and the
server component carries a separate, more restrictive license than the core
library. Not `FULLY_LOCAL` — the production-recommended path adds external
infrastructure dependencies the SDK itself does not eliminate.

## Security finding [E3] — not a LabLaunchPad vulnerability, a pattern to avoid

Check Point Research (2026) disclosed three vulnerabilities in LangGraph's
persistence layer: SQL injection in the SQLite checkpointer, unsafe msgpack
deserialization, and a parallel issue in the Redis checkpointer — triggered
when an application exposes `get_state_history()` with a user-controlled
filter.[^langgraph-checkpointer-cve] Fixed in `langgraph-checkpoint-sqlite`
3.0.1+, `langgraph` 1.0.10+, `langgraph-checkpoint-redis` 1.0.2+.
**LabLaunchPad implication**: any checkpoint/state query surface that
accepts caller-supplied filters must go through the same input-validation
discipline as any other externally-reachable query — a concrete argument for
this repository's own Policy Gate applying to `StateStore`/`CheckpointStore`
query paths, not just to tool invocation.

## LabLaunchPad extraction

| Pattern                                                                      | Adopt / Adapt / Reject                           | Rationale                                                                                                                                                                          |
| ---------------------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Checkpointer as a pluggable backend interface (memory/SQLite/Postgres/Redis) | **ADOPT** (pattern only)                         | Confirms the value of a `CheckpointStore` interface with multiple concrete backends rather than one hardcoded store — matches ADR-0006's deferred persistence-interface constraint |
| Validate caller-supplied filters on state/checkpoint query paths             | **ADOPT** (pattern only)                         | Direct lesson from a real, disclosed vulnerability — apply Policy Gate discipline to state queries, not only tool calls                                                            |
| Splitting license by component (core permissive, server/API restrictive)     | **RECORD AS PRECEDENT**, not adopted or rejected | Not a LabLaunchPad design decision — an observation that "check the whole framework's license" is necessary due diligence, now confirmed twice                                     |

## Open questions

- Model execution / provider-adaptiveness — not researched this pass.
- Full state/memory/evaluation/DX dimensions — not researched.
- Whether LangGraph's SQLite checkpointer alone (no Postgres/Redis) is
  viable for anything beyond single-process dev use — the sources found are
  clear that production guidance steers away from it, but a hands-on test
  was not performed.

[^langgraph-license]: https://github.com/langchain-ai/langgraph/blob/main/LICENSE

[^langgraph-license-split]: https://rvernica.github.io/2026/03/langchain-license

[^langgraph-self-host]: https://generativeai.pub/attach-external-postgres-and-redis-server-to-self-host-langgraph-apis-1455a5cfb054

[^langgraph-checkpointer-cve]: https://research.checkpoint.com/2026/from-sqli-to-rce-exploiting-langgraphs-checkpointer/
