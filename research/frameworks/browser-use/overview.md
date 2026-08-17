---
type: Framework Research
title: Browser Use — Overview
description: 'overview dimension research for browser-use, imported from a prior external research pass'
sources:
  - resource: https://docs.browser-use.com/open-source/quickstart
    id: open-source-quickstart-and-agent-surface
  - resource: https://docs.browser-use.com/cloud/agent/quickstart
    id: cloud-sdk-sessions-browsers-workspaces
  - resource: https://docs.browser-use.com/open-source/customize/skills/basics
    id: skills-as-reusable-apis
  - resource: https://docs.browser-use.com/cloud/legacy/skills
    id: skill-creation-execution-model
  - resource: https://github.com/browser-use/browsercode
    id: browser-native-minimal-architecture-exam
  - resource: https://github.com/browser-use/browser-use/blob/main/LICENSE
    id: browser-use-mit-license
  - resource: https://github.com/browser-use/sdk
    id: cloud-sdk-repository
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_evidence_level: E3/E4 per-claim - see this file's own Evidence register
x_provenance: imported research corpus (user-supplied), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the file's own evidence-discipline section unless separately reproduced
---

# Browser Use — Overview

**Research posture:** pattern-level reverse engineering and independent re-specification. No source-code reuse.
**Snapshot:** 2026 current docs/main snapshot
**License:** MIT (see licensing section for boundaries).

## Evidence register

- **E3** — Open-source quickstart and agent surface: https://docs.browser-use.com/open-source/quickstart
- **E3** — Cloud SDK / sessions / browsers / workspaces: https://docs.browser-use.com/cloud/agent/quickstart
- **E3** — Skills as reusable APIs: https://docs.browser-use.com/open-source/customize/skills/basics
- **E3** — Skill creation/execution model: https://docs.browser-use.com/cloud/legacy/skills
- **E4** — Browser-native minimal architecture example (BrowserCode): https://github.com/browser-use/browsercode
- **E3** — Browser Use MIT license: https://github.com/browser-use/browser-use/blob/main/LICENSE
- **E3** — Cloud SDK repository: https://github.com/browser-use/sdk

## Evidence discipline

E0 prior/model knowledge; E1 community signal; E2 repository/source evidence; E3 official docs; E4 official docs + implementation/tests; E5 LabLaunchPad reproduction/benchmark.

**Status vocabulary:** VERIFIED, DOCUMENTED_NOT_REPRODUCED, PARTIAL, UNKNOWN, CONTRADICTED.

## Findings

Browser Use is the key minimalism counterexample. The open-source API can be as small as Agent(task, llm).run(), while the cloud layer exposes sessions, browsers, profiles and workspaces. Skills can turn a demonstrated website interaction into a reusable endpoint.

**Primary JTBD:** make web automation easy and reusable.
**Unique strength:** let the model drive a highly capable browser substrate instead of forcing a large orchestration hierarchy.
**Important caution:** cloud features and open-source/local features are not the same surface.

## Claim ledger

| Claim                                          | Source                | Evidence        | Status                                                             | Confidence  | Limitation                                |
| ---------------------------------------------- | --------------------- | --------------- | ------------------------------------------------------------------ | ----------- | ----------------------------------------- |
| Core architectural/behavioral statements above | See evidence register | E3/E4 as marked | DOCUMENTED_NOT_REPRODUCED unless backed by E4 implementation/tests | High/Medium | No LabLaunchPad reproduction in this pass |
