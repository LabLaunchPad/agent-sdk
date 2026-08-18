---
type: Framework Research
title: Google Agent Development Kit (ADK) — Security
description: 'security dimension research for google-adk, imported from a prior external research pass'
sources:
  - resource: https://adk.dev/
    id: adk-home-languages-graph-workflows-runti
  - resource: https://adk.dev/agents/
    id: agents-composition-model
  - resource: https://google.github.io/adk-docs/sessions/
    id: sessions-services-and-event-state-semant
  - resource: https://adk.dev/evaluate/
    id: evaluation-criteria-and-trajectory-match
  - resource: https://adk.dev/deploy/
    id: deployment-options
  - resource: https://adk.dev/
    id: adk-models-providers-and-context-managem
  - resource: https://github.com/google/adk-python
    id: python-apache-2-0-current-release
  - resource: https://github.com/google/adk-go
    id: go-variant-apache-2-0
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_evidence_level: E3/E4 per-claim - see this file's own Evidence register
x_provenance: imported research corpus (user-supplied), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the file's own evidence-discipline section unless separately reproduced
---

# Google Agent Development Kit (ADK) — Security

**Research posture:** pattern-level reverse engineering and independent re-specification. No source-code reuse.
**Snapshot:** 2026 current docs/release snapshot
**License:** Apache-2.0 (see licensing section for boundaries).

## Evidence register

- **E3** — ADK home: languages, graph workflows, runtime, observability, evaluation, A2A: https://adk.dev/
- **E3** — Agents / composition model: https://adk.dev/agents/
- **E4** — Sessions/services and event/state semantics: https://google.github.io/adk-docs/sessions/
- **E4** — Evaluation criteria and trajectory matching: https://adk.dev/evaluate/
- **E3** — Deployment options: https://adk.dev/deploy/
- **E3** — ADK models/providers and context management: https://adk.dev/
- **E3** — Python Apache-2.0 + current release: https://github.com/google/adk-python
- **E3** — Go variant Apache-2.0: https://github.com/google/adk-go

## Evidence discipline

E0 prior/model knowledge; E1 community signal; E2 repository/source evidence; E3 official docs; E4 official docs + implementation/tests; E5 LabLaunchPad reproduction/benchmark.

**Status vocabulary:** VERIFIED, DOCUMENTED_NOT_REPRODUCED, PARTIAL, UNKNOWN, CONTRADICTED.

## Findings

ADK documents safety/security, action confirmations, authenticated tools and deployment security, but the reviewed sources do not establish a single unified capability security model as explicit as OpenHands' risk analyzer.

LabLaunchPad should therefore borrow ADK's lifecycle hooks while retaining an explicit action-boundary policy layer from OpenHands.

## Claim ledger

| Claim                                          | Source                | Evidence        | Status                                                             | Confidence  | Limitation                                |
| ---------------------------------------------- | --------------------- | --------------- | ------------------------------------------------------------------ | ----------- | ----------------------------------------- |
| Core architectural/behavioral statements above | See evidence register | E3/E4 as marked | DOCUMENTED_NOT_REPRODUCED unless backed by E4 implementation/tests | High/Medium | No LabLaunchPad reproduction in this pass |
