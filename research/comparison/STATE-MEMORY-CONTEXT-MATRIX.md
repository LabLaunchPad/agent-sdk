---
type: Comparison Matrix
title: State / Memory / Context Matrix
description: 'State / Memory / Context Matrix across the 5-framework supplementary corpus (OpenHands, Letta, Google ADK, Browser Use, CrewAI), imported from a prior external research pass'
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

# State / Memory / Context Matrix

| Concept       | OpenHands            | Letta                         | ADK                     | Browser Use               | CrewAI           | LabLaunchPad recommendation |
| ------------- | -------------------- | ----------------------------- | ----------------------- | ------------------------- | ---------------- | --------------------------- |
| Run/session   | Conversation         | Session                       | Session                 | browser/agent session     | Flow/run         | `Run`                       |
| Durable state | conversation state   | AgentState                    | session services/state  | limited/environment       | Flow state       | `State`                     |
| Memory        | event/skills/context | first-class blocks + archival | explicit memory/context | not core                  | memory subsystem | `Memory`                    |
| Knowledge     | workspace/skills     | files/external RAG            | artifacts/search/RAG    | website data              | knowledge        | `Knowledge`                 |
| Evidence      | events/tool outputs  | messages/memory               | events/trace            | task result/browser trace | outputs/usage    | `Evidence`                  |
| Transcript    | event log            | messages/conversation         | events                  | session trace/result      | run/task logs    | `Transcript`                |

**Key conclusion:** do not collapse these six concepts; each has a distinct lifecycle and trust model.
