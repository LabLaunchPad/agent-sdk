---
type: Comparison Matrix
title: DX / AX / OX / UX / PX Matrix
description: 'DX / AX / OX / UX / PX Matrix across the 5-framework supplementary corpus (OpenHands, Letta, Google ADK, Browser Use, CrewAI), imported from a prior external research pass'
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

# DX / AX / OX / UX / PX Matrix

| Dimension | OpenHands                   | Letta                   | ADK                         | Browser Use             | CrewAI                 | LabLaunchPad rule            |
| --------- | --------------------------- | ----------------------- | --------------------------- | ----------------------- | ---------------------- | ---------------------------- |
| DX        | rich, more concepts         | stateful, clear         | broad lifecycle             | excellent minimal start | intuitive roles/tasks  | few core concepts            |
| AX        | strong machine docs/skills  | clear API model         | llms.txt + agent CLI skills | simple primitive        | official coding skills | versioned agent context pack |
| OX        | event/approval/resume       | memory/state inspection | traces/eval/deploy          | session/result          | flows/metrics          | event timeline + proof       |
| UX        | inspectable coding run      | editable memory         | lifecycle/runtime           | task/session            | crew/flow              | simple Run mental model      |
| PX        | portability via SDK/runtime | cloud/local             | multi-language/provider     | OSS/cloud split         | OSS/AMP split          | semantic adapter layer       |
