---
type: Comparison Matrix
title: Runtime Matrix
description: 'Runtime Matrix across the 5-framework supplementary corpus (OpenHands, Letta, Google ADK, Browser Use, CrewAI), imported from a prior external research pass'
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

# Runtime Matrix

| Runtime concern | OpenHands                       | Letta                 | ADK                  | Browser Use               | CrewAI               | Neutral Contract    |
| --------------- | ------------------------------- | --------------------- | -------------------- | ------------------------- | -------------------- | ------------------- |
| Workspace       | local/ephemeral                 | server data/tool env  | runtime environment  | browser session/workspace | app env              | WorkspaceContract   |
| Isolation       | Docker / remote                 | optional tool sandbox | deployment dependent | managed browser sandbox   | deployment dependent | SandboxContract     |
| Persistence     | conversation dir/DB-like stores | Postgres              | session services     | cloud session/profile     | flow persistence     | PersistenceContract |
| Resource limits | documented execution controls   | environment dependent | runtime config       | session timeout           | platform config      | ResourcePolicy      |
| Secrets         | registry                        | env/config            | auth services        | profiles/cookies          | integrations         | SecretContract      |
| Recovery        | resume/fork                     | persistent state      | resume/cancel        | long session              | flow resume          | RecoveryContract    |
