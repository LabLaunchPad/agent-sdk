---
type: Comparison Matrix
title: Additional SDK Master Matrix
description: 'Additional SDK Master Matrix across the 5-framework supplementary corpus (OpenHands, Letta, Google ADK, Browser Use, CrewAI), imported from a prior external research pass'
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

# Additional SDK Master Matrix

| Framework   | Primary JTBD                    | Core primitive                   | State                          | Memory                            | Runtime                                | Local-first posture | Evaluation                                               | Security emphasis                       | Distinctive pattern                      | LabLaunchPad decision |
| ----------- | ------------------------------- | -------------------------------- | ------------------------------ | --------------------------------- | -------------------------------------- | ------------------- | -------------------------------------------------------- | --------------------------------------- | ---------------------------------------- | --------------------- |
| OpenHands   | software task execution         | Agent + Conversation + Events    | persisted conversation/runtime | skills/context-oriented           | local + Agent Server + cloud workspace | strong              | tests/trajectory/goal completion, not one canonical eval | action risk + confirmation + sandbox    | software-native workspace/event model    | ADOPT/ADAPT           |
| Letta       | stateful long-lived agents      | AgentState + Memory Blocks       | durable DB-backed agent state  | first-class, persistent, editable | managed/local/self-hosted              | strong              | memory evaluation needs independent harness              | read-only memory + tool sandbox options | durable memory as coordination primitive | ADOPT/ADAPT           |
| Google ADK  | production agent lifecycle      | Agent + Session/Event + Workflow | session/state/event            | explicit context/memory services  | local + managed deployment             | broad               | strong trajectory/eval framework                         | lifecycle/tool/security controls        | deterministic graph + adaptive AI        | ADOPT/ADAPT           |
| Browser Use | web automation                  | Agent/Task + Browser Session     | environment/session-centric    | not core                          | local + managed cloud                  | strong for OSS      | benchmark claims documented; reproduce                   | browser/profile/network boundary        | minimal abstraction                      | ADOPT principle       |
| CrewAI      | business multi-agent automation | Agent + Task + Crew/Flow         | typed flow state + run state   | first-class                       | local + managed AMP                    | broad               | metrics/guardrails/observability                         | guardrails/HITL/managed controls        | role/task mental model                   | ADOPT/ADAPT           |

**Evidence basis:** official docs/repositories for each framework; no source-code copying. See framework folders for evidence registers.
