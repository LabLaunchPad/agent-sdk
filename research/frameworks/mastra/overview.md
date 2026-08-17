---
type: Framework Research
title: Mastra
description: Agent/workflow/memory/observability composability, LibSQL local storage, licensing split for Mastra
sources:
  - resource: https://github.com/mastra-ai/mastra/blob/main/LICENSE.md
    id: mastra-license
  - resource: https://mastra.ai/docs/community/licensing
    id: mastra-license-docs
  - resource: https://mastra.ai/reference/storage/libsql
    id: mastra-libsql
  - resource: https://mastra.ai/
    id: mastra-home
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_evidence_level: E3
x_coverage: architecture, local-first storage, licensing — full 14/40-dimension depth not yet researched
---

# Mastra

> **Coverage note.** This installment covers architecture composability
> (agents/workflows/memory/observability), LibSQL-backed local storage, and
> licensing (including a split worth flagging, mirroring LangGraph's). State
> query surface, security, evaluation, DX/UX not yet researched.

## Licensing [E3] — split, not uniform

Core framework and the large majority of the codebase is Apache License 2.0.
**But** code under `ee/` directories (e.g.
`packages/core/src/auth/ee/`) is source-available under the separate
**Mastra Enterprise License**, not Apache-2.0.[^mastra-license-docs] This is
the same shape of finding as LangGraph's core-MIT / `langgraph-api`-Elastic
split — **now observed in two of the eight frameworks researched so far**,
enough to promote from a one-off note to an explicit pattern: composable
TypeScript/Python agent frameworks that offer a hosted/enterprise tier
frequently split their license by directory, and the top-level "it's
Apache-2.0 / MIT" claim does not automatically extend to every subtree.

## Architecture: agents, workflows, memory, model router [E3]

- **Agents**: the reasoning/tool-use unit.
- **Workflows**: a graph-based orchestration engine with `.then()`,
  `.branch()`, `.parallel()` control-flow methods; supports
  suspend/resume — a workflow can pause indefinitely awaiting human input
  and resume from persisted state.
- **Memory**: conversation history plus "working" and "semantic" memory,
  backed by pluggable storage (see LibSQL below); first-party `@mastra/mem0`
  integration is notable for being usable without managing a separate Python
  server — a TypeScript-native path other frameworks' memory integrations
  often lack.
- **Model router**: a single interface reaching 90+ model providers.
- **Framework positioning**: industry commentary places Mastra in a
  "graph-based" tier alongside LangGraph (vs. role-based frameworks like
  CrewAI/AutoGen, or SDK-native frameworks like OpenAI Agents SDK) — an
  independent, secondary-source classification, not a first-party claim.

## Local-first classification

| Capability                                       | Classification                                                                                                                                                                                                    | Evidence                      |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Storage (memory/workflow snapshots/traces/evals) | **LOCAL_NATIVE** — `LibSQLStore` with a `file:filename.db` URL gives fully local, file-based persistent storage; LibSQL is SQLite-compatible and supports local or remote deployment by the same interface        | [E3] websearch                |
| Model execution                                  | **UNKNOWN leaning CLOUD_ADAPTIVE** — the "90+ providers through one interface" framing implies provider-adaptive routing, not a confirmed local-model execution path; not directly confirmed either way this pass | [E3] websearch                |
| Deployment                                       | Self-hosted deployment is documented (Mastra Docs "Deploying" reference) but was not read in full detail this pass                                                                                                | [E3] websearch (surface only) |

**Verdict**: `LOCAL_CAPABLE`, leaning stronger than LangGraph on the storage
dimension specifically — LibSQL's local file-database mode is a first-party,
zero-external-infra local storage path (no Postgres/Redis requirement the
way LangGraph's production guidance implies). Model execution local-first
status is genuinely `UNKNOWN`, not inferred, pending a direct check of
whether any local model provider (Ollama, vLLM, etc.) is supported by the
model router.

## LabLaunchPad extraction

| Pattern                                                                     | Adopt / Adapt / Reject                          | Rationale                                                                                                                                                                               |
| --------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SQLite-compatible embedded DB (LibSQL) as the default local storage backend | **ADOPT** (pattern only)                        | Directly relevant to Phase 4/7's persistence-interface work (ADR-0006) — a concrete, zero-infra local backend example to cite alongside Qwen-Agent's local model path                   |
| Workflow suspend/resume backed by persisted state                           | **ADOPT** (pattern only)                        | Confirms this repository's own Checkpoint/State model design direction independently                                                                                                    |
| License-by-directory split (`ee/` carve-out)                                | **RECORD AS PRECEDENT** (now 2 of 8 frameworks) | Same treatment as LangGraph's split — reinforces "check the whole tree, not just the root LICENSE" as a standing due-diligence rule for this repository's own future dependency reviews |

## Open questions

- Whether the model router supports any local/self-hosted model provider —
  genuinely unresearched, not inferred as either yes or no.
- Full security/evaluation/DX dimensions — not researched.
- Exact scope of what code lives under `ee/` beyond the one cited
  `auth/ee/` example — not enumerated.

[^mastra-license]: https://github.com/mastra-ai/mastra/blob/main/LICENSE.md

[^mastra-license-docs]: https://mastra.ai/docs/community/licensing

[^mastra-libsql]: https://mastra.ai/reference/storage/libsql
