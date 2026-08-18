---
type: Comparison Matrix
title: Capability Matrix
description: 'Capability Matrix across the 5-framework supplementary corpus (OpenHands, Letta, Google ADK, Browser Use, CrewAI), imported from a prior external research pass'
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

# Capability Matrix

| Capability        |              OpenHands |                   Letta |                  ADK |                 Browser Use |                       CrewAI | LabLaunchPad stance        |
| ----------------- | ---------------------: | ----------------------: | -------------------: | --------------------------: | ---------------------------: | -------------------------- |
| Shell/filesystem  |               Built-in |          Tool-dependent |       tool-dependent |                    not core |               tool-dependent | capability, not Agent      |
| Browser           | supported in workspace |           tool/provider |                tools |                        core |                        tools | environment capability     |
| MCP               |                    Yes |      Yes/out-of-process |                  Yes | possible/cloud integrations |                 integrations | protocol adapter only      |
| Skills            |                    Yes |   skills/code ecosystem |               Skills |                         Yes | official coding-agent skills | versioned capability packs |
| Subagents         |                    Yes |       multi-agent/state |                  Yes |                    not core |                          yes | optional workflow          |
| Human approval    |  explicit confirmation | policy/client dependent | action confirmations |            product-specific |                         HITL | state transition           |
| Remote runtime    |           Agent Server |       self-host/managed |     managed runtimes |                       Cloud |                          AMP | separate RuntimeContract   |
| Structured output |            APIs/models |             API schemas |   agent/tool schemas |                 task result |             Pydantic outputs | typed ResultContract       |
