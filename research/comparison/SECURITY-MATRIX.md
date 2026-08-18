---
type: Comparison Matrix
title: Security Matrix
description: 'Security Matrix across the 5-framework supplementary corpus (OpenHands, Letta, Google ADK, Browser Use, CrewAI), imported from a prior external research pass'
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

# Security Matrix

| Attack                 | OpenHands evidence                        | Letta evidence            | ADK evidence         | Browser Use risk            | CrewAI evidence       | LabLaunchPad requirement                  |
| ---------------------- | ----------------------------------------- | ------------------------- | -------------------- | --------------------------- | --------------------- | ----------------------------------------- |
| prompt injection       | analyzer explicitly not complete solution | memory/tool boundary risk | safety/tool controls | browser page can be hostile | guardrails/HITL       | untrusted-content labeling + policy rails |
| tool injection         | MCP/tools                                 | MCP outside server        | MCP/OpenAPI          | browser scripts/cloud       | tools/integrations    | capability provenance                     |
| memory poisoning       | skills/context risk                       | first-class risk          | memory context       | less central                | memory/knowledge      | signed/provenance memory writes           |
| workspace escape       | sandbox/mount model                       | tool sandbox optional     | deployment dependent | browser sandbox             | environment dependent | hard sandbox + mount policy               |
| secret exfiltration    | secret registry/workspace                 | env/API keys              | auth tools           | profiles/cookies            | integrations          | secret scopes + redaction                 |
| false completion       | goal completion/stuck detector            | agent continuity          | eval/trajectory      | task result                 | task outputs          | proof-bearing completion                  |
| runaway loops          | stuck detector                            | agent runtime             | event loop/workflow  | timeout                     | workflow controls     | budgets + loop detector                   |
| duplicate side effects | confirmation/policy                       | tool state                | workflow control     | browser replays             | task retries          | idempotency keys                          |
