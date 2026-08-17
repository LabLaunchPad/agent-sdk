---
type: Framework Research
title: Browser Use — Lablaunchpad Extraction
description: 'lablaunchpad-extraction dimension research for browser-use, imported from a prior external research pass'
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

# Browser Use — Lablaunchpad Extraction

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

**ADOPT:** minimal core loop; environment-specific high-power capability; reusable skills as compiled procedures; progressive complexity.
**ADAPT:** skill loading with explicit token budgets and provenance.
**REJECT:** large general-purpose abstraction stack for simple environment tasks.
**DEFER:** broad browser-agent platform until browser security/credential policy is mature.
**INVESTIGATE:** measure whether model-native browser coding primitives reduce framework overhead versus structured action APIs.

## Claim ledger

| Claim                                          | Source                | Evidence        | Status                                                             | Confidence  | Limitation                                |
| ---------------------------------------------- | --------------------- | --------------- | ------------------------------------------------------------------ | ----------- | ----------------------------------------- |
| Core architectural/behavioral statements above | See evidence register | E3/E4 as marked | DOCUMENTED_NOT_REPRODUCED unless backed by E4 implementation/tests | High/Medium | No LabLaunchPad reproduction in this pass |

## Decision gate

**Facts -> Evidence -> Assumptions -> Counterexamples -> Options -> Tradeoff -> Recommendation -> Test -> Revisit trigger.**

No architecture rewrite is authorized by this research artifact. Any conflict with the existing LabLaunchPad design becomes an **ADR-CANDIDATE**.
