---
type: Framework Research
title: OpenHands Software Agent SDK — Overview
description: 'overview dimension research for openhands, imported from a prior external research pass'
sources:
  - resource: https://github.com/OpenHands/software-agent-sdk/blob/main/README.md
    id: sdk-overview-local-or-ephemeral-workspac
  - resource: https://github.com/OpenHands/docs/blob/main/llms.txt
    id: docs-index-agent-server-docker-sandbox-s
  - resource: https://github.com/OpenHands/docs/blob/main/sdk/arch/agent.mdx
    id: agent-reasoning-action-loop
  - resource: https://docs.openhands.dev/sdk/guides/security
    id: security-analyzer-confirmation-policy
  - resource: https://docs.openhands.dev/sdk/guides/convo-persistence
    id: conversation-persistence
  - resource: https://docs.openhands.dev/sdk/arch/skill
    id: skills-trigger-activation-mcp-integratio
  - resource: https://docs.openhands.dev/sdk/guides/agent-server/docker-sandbox
    id: docker-sandbox
  - resource: https://docs.openhands.dev/sdk/arch/events
    id: event-model
  - resource: https://github.com/OpenHands/software-agent-sdk/blob/main/DEVELOPMENT.md
    id: development-testing-structure
  - resource: https://github.com/OpenHands/software-agent-sdk/blob/main/LICENSE
    id: mit-license
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_evidence_level: E3/E4 per-claim - see this file's own Evidence register
x_provenance: imported research corpus (user-supplied), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the file's own evidence-discipline section unless separately reproduced
---

# OpenHands Software Agent SDK — Overview

**Research posture:** pattern-level reverse engineering and independent re-specification. No source-code reuse.
**Snapshot:** 2026 current main/docs snapshot
**License:** MIT (see licensing section for boundaries).

## Evidence register

- **E3** — SDK overview / local or ephemeral workspace: https://github.com/OpenHands/software-agent-sdk/blob/main/README.md
- **E3** — Docs index: Agent Server, Docker Sandbox, skills, persistence, MCP, observability: https://github.com/OpenHands/docs/blob/main/llms.txt
- **E4** — Agent reasoning-action loop: https://github.com/OpenHands/docs/blob/main/sdk/arch/agent.mdx
- **E4** — Security analyzer + confirmation policy: https://docs.openhands.dev/sdk/guides/security
- **E4** — Conversation persistence: https://docs.openhands.dev/sdk/guides/convo-persistence
- **E4** — Skills / trigger activation / MCP integration: https://docs.openhands.dev/sdk/arch/skill
- **E4** — Docker sandbox: https://docs.openhands.dev/sdk/guides/agent-server/docker-sandbox
- **E4** — Event model: https://docs.openhands.dev/sdk/arch/events
- **E4** — Development/testing structure: https://github.com/OpenHands/software-agent-sdk/blob/main/DEVELOPMENT.md
- **E3** — MIT license: https://github.com/OpenHands/software-agent-sdk/blob/main/LICENSE

## Evidence discipline

E0 prior/model knowledge; E1 community signal; E2 repository/source evidence; E3 official docs; E4 official docs + implementation/tests; E5 LabLaunchPad reproduction/benchmark.

**Status vocabulary:** VERIFIED, DOCUMENTED_NOT_REPRODUCED, PARTIAL, UNKNOWN, CONTRADICTED.

## Findings

OpenHands is unusually software-engineering-native. The SDK exposes Python/REST surfaces for agents that work with code, supports local workspaces and ephemeral workspaces through an Agent Server, and is the engine behind its CLI and Cloud experience. This is a runtime/harness-heavy design rather than a generic conversational-agent SDK.

**Primary JTBD:** execute verifiable software tasks against a workspace with tools, persistence, skills, MCP and safety controls.
**Best fit:** long-ish running coding/maintenance/refactor tasks; developer-first; hybrid local/remote.
**Counterweight:** the richer the software-agent substrate, the larger the surface area LabLaunchPad must govern and test.

## Claim ledger

| Claim                                          | Source                | Evidence        | Status                                                             | Confidence  | Limitation                                |
| ---------------------------------------------- | --------------------- | --------------- | ------------------------------------------------------------------ | ----------- | ----------------------------------------- |
| Core architectural/behavioral statements above | See evidence register | E3/E4 as marked | DOCUMENTED_NOT_REPRODUCED unless backed by E4 implementation/tests | High/Medium | No LabLaunchPad reproduction in this pass |
