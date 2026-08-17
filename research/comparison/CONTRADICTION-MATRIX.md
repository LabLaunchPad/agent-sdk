---
type: Comparison Matrix
title: Contradiction Matrix
description: 'Contradiction Matrix across the 5-framework supplementary corpus (OpenHands, Letta, Google ADK, Browser Use, CrewAI), imported from a prior external research pass'
sources:
  - resource: /research/frameworks/openhands/overview.md
    id: openhands
  - resource: /research/frameworks/letta/overview.md
    id: letta
  - resource: /research/frameworks/google-adk/overview.md
    id: google-adk
  - resource: /research/frameworks/browser-use/overview.md
    id: browser-use
  - resource: /research/frameworks/crewai/overview.md
    id: crewai
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus (user-supplied), not independently re-verified via WebFetch in this session
---

# Contradiction Matrix

These are evidence-grounded design tensions, not claims that one framework is wrong.

| #   | Tension                                             | Evidence poles                                                                                    | LabLaunchPad interpretation                                         | Decision                     |
| --- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------- |
| 1   | Minimal core vs rich runtime                        | Browser Use minimal surface vs OpenHands/ADK broad lifecycle                                      | simple path must remain first-class; governance layers are optional | ADOPT both via layers        |
| 2   | Durable memory vs poisoning risk                    | Letta writable persistent blocks vs read-only blocks/policy need                                  | memory writes must be provenance/policy controlled                  | ADOPT guarded memory         |
| 3   | Multi-agent collaboration vs coordination cost      | CrewAI crews/hierarchical manager vs Browser Use single loop                                      | require measured gain per total cost                                | DEFAULT single agent         |
| 4   | More context vs context distraction/cost            | Letta always-visible blocks vs ADK structured filtering/compression; Browser Use skill token cost | visibility must be scoped                                           | ADOPT policy-driven context  |
| 5   | Rich abstraction vs maintainability                 | ADK multi-language/graphs + CrewAI concepts vs Browser Use thin SDK                               | semantic core should stay small                                     | ADOPT core + adapters        |
| 6   | Local-first vs managed infrastructure               | OpenHands local/ephemeral, Letta local/cloud, ADK managed runtimes, Browser Use cloud, CrewAI AMP | runtime portability must be contract-driven                         | ADOPT RuntimeContract        |
| 7   | LLM security judgement vs deterministic enforcement | OpenHands LLM analyzer + deterministic rails                                                      | policy must not rely on model judgement alone                       | ADOPT deterministic baseline |
| 8   | Role specialization vs one strong general agent     | CrewAI role/task abstraction vs minimal Browser Use loop                                          | roles should be optional metadata unless they improve outcome       | INVESTIGATE                  |
