---
type: Comparison Matrix
title: Local-First Matrix
description: 'Local-First Matrix across the 5-framework supplementary corpus (OpenHands, Letta, Google ADK, Browser Use, CrewAI), imported from a prior external research pass'
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

# Local-First Matrix

| Framework   | Local execution          | Remote/managed                  | Durable local state        | Sandbox                             | Key caveat                                        |
| ----------- | ------------------------ | ------------------------------- | -------------------------- | ----------------------------------- | ------------------------------------------------- |
| OpenHands   | Yes                      | Agent Server / Cloud            | conversation persistence   | DockerWorkspace                     | local mount can expose writable host files        |
| Letta       | Yes via Docker/self-host | Cloud / remote                  | PostgreSQL-backed          | optional tool sandbox; MCP external | memory and tool trust zones differ                |
| Google ADK  | Yes/container            | Agent Runtime/Cloud Run/GKE     | pluggable session services | deployment-specific                 | platform services expand core surface             |
| Browser Use | OSS/local browser        | Cloud browser/session/workspace | session/profile dependent  | managed cloud                       | auth/cookies/network are privileged state         |
| CrewAI      | Yes                      | AMP                             | flow persistence           | environment-dependent               | open-source framework and managed platform differ |

**LabLaunchPad requirement:** `RuntimeContract` must be portable across local, isolated local, remote ephemeral, and managed execution without changing Agent semantics.
