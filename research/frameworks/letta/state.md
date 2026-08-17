---
type: Framework Research
title: Letta Agent SDK / Letta — State
description: 'state dimension research for letta, imported from a prior external research pass'
sources:
  - resource: https://github.com/letta-ai/letta-agent-sdk
    id: agent-sdk-managed-local-self-hosted-and-
  - resource: https://docs.letta.com/guides/core-concepts/memory/memory-blocks
    id: memory-blocks-persistent-always-visible-
  - resource: https://docs.letta.com/guides/core-concepts/memory/context-hierarchy
    id: context-hierarchy-memory-blocks-files-ar
  - resource: https://docs.letta.com/api/resources/agents
    id: agentstate-persisted-in-db
  - resource: https://docs.letta.com/tutorials/attaching-detaching-blocks/
    id: attach-detach-blocks-at-runtime
  - resource: https://docs.letta.com/guides/docker
    id: docker-self-hosting-and-provider-configu
  - resource: https://github.com/letta-ai/letta
    id: open-source-repository-and-apache-2-0
  - resource: https://github.com/letta-ai/letta-agent-sdk
    id: sdk-apache-2-0
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_evidence_level: E3/E4 per-claim - see this file's own Evidence register
x_provenance: imported research corpus (user-supplied), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the file's own evidence-discipline section unless separately reproduced
---

# Letta Agent SDK / Letta — State

**Research posture:** pattern-level reverse engineering and independent re-specification. No source-code reuse.
**Snapshot:** 2026 current docs/main snapshot
**License:** Apache-2.0 (see licensing section for boundaries).

## Evidence register

- **E3** — Agent SDK: managed/local/self-hosted and sessions: https://github.com/letta-ai/letta-agent-sdk
- **E4** — Memory blocks: persistent, always-visible, agent-editable/read-only: https://docs.letta.com/guides/core-concepts/memory/memory-blocks
- **E4** — Context hierarchy: memory blocks/files/archival/external RAG: https://docs.letta.com/guides/core-concepts/memory/context-hierarchy
- **E4** — AgentState persisted in DB: https://docs.letta.com/api/resources/agents
- **E4** — Attach/detach blocks at runtime: https://docs.letta.com/tutorials/attaching-detaching-blocks/
- **E3** — Docker/self-hosting and provider configuration: https://docs.letta.com/guides/docker
- **E3** — Open source repository and Apache-2.0: https://github.com/letta-ai/letta
- **E3** — SDK Apache-2.0: https://github.com/letta-ai/letta-agent-sdk

## Evidence discipline

E0 prior/model knowledge; E1 community signal; E2 repository/source evidence; E3 official docs; E4 official docs + implementation/tests; E5 LabLaunchPad reproduction/benchmark.

**Status vocabulary:** VERIFIED, DOCUMENTED_NOT_REPRODUCED, PARTIAL, UNKNOWN, CONTRADICTED.

## Findings

Letta explicitly models AgentState as persistent database-backed state with enough information to recreate the agent. This is stronger than merely persisting transcript history.

**LabLaunchPad contract:** separate DurableAgentState from RunState and Transcript. Durable state should be versioned, schema-validated and replayable.

## Claim ledger

| Claim                                          | Source                | Evidence        | Status                                                             | Confidence  | Limitation                                |
| ---------------------------------------------- | --------------------- | --------------- | ------------------------------------------------------------------ | ----------- | ----------------------------------------- |
| Core architectural/behavioral statements above | See evidence register | E3/E4 as marked | DOCUMENTED_NOT_REPRODUCED unless backed by E4 implementation/tests | High/Medium | No LabLaunchPad reproduction in this pass |
