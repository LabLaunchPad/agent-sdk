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
  - resource: https://github.com/langchain-ai/langgraphjs/issues/536
    id: langgraph-schema-migration-issue
  - resource: https://github.com/langchain-ai/langgraphjs/issues/1138
    id: langgraph-checkpoint-growth-issue
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_evidence_level: E3
x_coverage: local-first, licensing, checkpointer architecture, persistence-lifecycle risk, one security finding — full 14/40-dimension depth not yet researched
---

# LangGraph

> **Coverage note.** This installment covers StateGraph/checkpointer
> architecture, self-hosted deployment requirements, persistence-lifecycle
> risk, licensing (including a license split worth flagging), and one
> relevant security finding. State (beyond checkpointing), memory,
> evaluation, DX/UX not yet researched.
>
> **Correction to this file's own first draft**: the initial pass recorded
> LangGraph's local-first verdict as `HYBRID` on the reasoning that
> "PostgreSQL + Redis are the documented requirement for durable,
> multi-process production use." On closer reading of LangGraph's own
> checkpointer interface, that framing overstated the dependency — see
> "Local-first classification" below for the corrected finding. Recorded as
> a correction, not silently edited away, per this repository's own
> evidence discipline.

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

The checkpointer is an **interface**, not a Postgres/Redis-bound
implementation. LangGraph.js ships an in-memory checkpointer and a SQLite
checkpointer for local development and experimentation as first-class,
fully local options; Postgres and Mongo are additional backends for
production deployments, not a mandatory dependency of the SDK
itself.[^langgraph-self-host] The earlier framing in this file's own first
draft ("PostgreSQL + Redis are the documented requirement...") conflated
one deployment guide's production recommendation with a hard SDK
requirement — corrected here.

| Capability            | Classification                                                                                                                                                                                                                                                          | Evidence       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| Model execution       | UNKNOWN — not directly researched this pass; LangGraph is a graph-orchestration layer over LangChain model integrations, not itself a model runtime                                                                                                                     | not researched |
| State / checkpointing | **LOCAL_CAPABLE** — in-memory and SQLite checkpointers are genuinely local, first-class options for development and single-process use; Postgres/Mongo are optional, swappable production backends behind the same `Checkpointer` interface, not a mandatory dependency | [E3] websearch |
| Server/API deployment | **LOCAL_CAPABLE with a license caveat** — `langgraph-api` can be self-hosted (Self-Hosted Lite/Enterprise tiers, Docker), but is Elastic License 2.0, not MIT                                                                                                           | [E3] websearch |

**Verdict**: `LOCAL_CAPABLE`. LangGraph's own checkpointer abstraction is
backend-agnostic, and in-memory/SQLite are genuinely local, unconditioned
options — not a degraded fallback. The real local-first caveat is
elsewhere: the _deployment server_ (`langgraph-api`) carries a separate,
more restrictive license, and (see below) even the fully local SQLite path
inherits persistence-lifecycle problems that are not automatically solved
by "it can run locally."

## Persistence lifecycle risk [E3] — the more interesting local-first caveat

Two real, currently-open concerns, independent of which backend is chosen:

- **State schema migration**: LangGraph provides no built-in mechanism for
  detecting or managing incompatible changes to the shape of state over
  time — an open feature request (`langgraphjs` #536) asks for state-schema
  versioning and migration support; until then, resuming an old checkpoint
  against a newer graph definition can fail or silently
  misbehave.[^langgraph-schema-migration-issue]
- **Checkpoint growth / retention**: the checkpoint table has no built-in
  retention or archival policy — practitioners report needing custom
  background processes to identify terminated threads and purge or archive
  their checkpoints, or the table grows unbounded
  (`langgraphjs` #1138).[^langgraph-checkpoint-growth-issue]

**LabLaunchPad implication**: this is a better, more specific finding than
"local vs. cloud" — durable checkpointing is a genuine capability, but
_persistence lifecycle_ (retention, schema evolution, migration, replay
semantics against a changed graph) is a first-class engineering problem
independent of backend choice, local or otherwise. See
`research/contradictions/checkpointing-vs-persistence-lifecycle.md`.

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

| Pattern                                                                                                                           | Adopt / Adapt / Reject                           | Rationale                                                                                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Checkpointer as a pluggable backend interface (memory/SQLite/Postgres/Mongo)                                                      | **ADOPT** (pattern only)                         | Confirms the value of a `CheckpointStore` interface with multiple concrete backends, in-memory/SQLite included as first-class local options — matches ADR-0006's deferred persistence-interface constraint                |
| State semantics (threads, checkpoints, pending writes, replay/time-travel) as a formal layer, prior to any storage backend choice | **ADOPT** (pattern only)                         | The architecturally interesting part is not "which database" but the checkpoint/thread/pending-write model itself — state semantics first, storage adapters second                                                        |
| Explicit retention/archival policy for terminal-state checkpoints                                                                 | **ADOPT** (pattern only)                         | LangGraph's own gap (no built-in retention) is a concrete lesson: LabLaunchPad's `CheckpointStore` spec should define a retention/archival contract from the start, not add one after production growth becomes a problem |
| State-schema versioning/migration as part of the checkpoint contract                                                              | **ADOPT** (pattern only)                         | LangGraph's own open feature request (#536) is direct evidence this is a real, currently-unsolved problem worth designing for up front rather than deferring                                                              |
| Validate caller-supplied filters on state/checkpoint query paths                                                                  | **ADOPT** (pattern only)                         | Direct lesson from a real, disclosed vulnerability — apply Policy Gate discipline to state queries, not only tool calls                                                                                                   |
| Splitting license by component (core permissive, server/API restrictive)                                                          | **RECORD AS PRECEDENT**, not adopted or rejected | Not a LabLaunchPad design decision — an observation that "check the whole framework's license" is necessary due diligence, now confirmed twice                                                                            |

## Open questions

- Model execution / provider-adaptiveness — not researched this pass.
- Full state/memory/evaluation/DX dimensions — not researched.
- Whether checkpoint_during-style selective checkpointing (skipping writes
  for nodes processing only temporary data) is a pattern worth adopting —
  noted in passing during research, not independently verified.

[^langgraph-license]: https://github.com/langchain-ai/langgraph/blob/main/LICENSE

[^langgraph-license-split]: https://rvernica.github.io/2026/03/langchain-license

[^langgraph-self-host]: https://generativeai.pub/attach-external-postgres-and-redis-server-to-self-host-langgraph-apis-1455a5cfb054

[^langgraph-checkpointer-cve]: https://research.checkpoint.com/2026/from-sqli-to-rce-exploiting-langgraphs-checkpointer/

[^langgraph-schema-migration-issue]: https://github.com/langchain-ai/langgraphjs/issues/536

[^langgraph-checkpoint-growth-issue]: https://github.com/langchain-ai/langgraphjs/issues/1138
