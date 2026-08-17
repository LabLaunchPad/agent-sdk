---
type: Comparison Matrix
title: Portability Matrix
description: 'Portability Matrix across the 5-framework supplementary corpus (OpenHands, Letta, Google ADK, Browser Use, CrewAI), imported from a prior external research pass'
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

# Portability Matrix

| Source semantic        | LabLaunchPad semantic          | Compatibility level | Note                                             |
| ---------------------- | ------------------------------ | ------------------- | ------------------------------------------------ |
| OpenHands Agent        | Agent                          | high                | keep loop semantics, not class API               |
| OpenHands Conversation | Run + Transcript + State       | partial             | split overloaded concept                         |
| Letta AgentState       | DurableAgentState              | high                | preserve recreation semantics                    |
| Letta Memory Block     | MemoryBlock                    | high                | add provenance/TTL                               |
| ADK Session            | Session/Run                    | high                | retain event/state delta semantics               |
| ADK Graph workflow     | Workflow                       | high                | optional deterministic layer                     |
| Browser Use Agent      | Agent + Environment Capability | high                | keep minimal path                                |
| Browser Use Skill      | CapabilityPackage              | partial/high        | compile to deterministic procedure when possible |
| CrewAI Task            | Task                           | high                | keep expected output + dependencies              |
| CrewAI Crew            | Workflow/Team                  | partial             | avoid mandatory multi-agent semantics            |
| CrewAI Flow            | Harness/Workflow               | high                | typed state + events                             |

**No drop-in compatibility is promised.**
