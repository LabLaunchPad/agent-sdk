---
type: Comparison Matrix
title: Efficiency Matrix
description: 'Efficiency Matrix across the 5-framework supplementary corpus (OpenHands, Letta, Google ADK, Browser Use, CrewAI), imported from a prior external research pass'
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

# Efficiency Matrix

| Lever               | OpenHands                      | Letta                        | ADK                                       | Browser Use                  | CrewAI                | LabLaunchPad benchmark  |
| ------------------- | ------------------------------ | ---------------------------- | ----------------------------------------- | ---------------------------- | --------------------- | ----------------------- |
| context compression | present in ecosystem/docs      | hierarchy avoids overloading | explicit structured context + compression | skill token cost             | role/task/memory load | tokens/task + success   |
| retrieval           | skills/workspace tools         | files/archival/RAG           | context services                          | web retrieval is environment | knowledge             | repo context broker     |
| parallelism         | parallel tools                 | provider/runtime dependent   | parallel workflows                        | session/task parallelism     | async tasks           | useful-work / tool call |
| model routing       | documented                     | multi-provider               | model routing                             | model options                | LLM connections       | model tier policy       |
| caching             | not a primary reviewed feature | backend dependent            | context cache                             | managed session persistence  | platform features     | compiled context/cache  |
| human cost          | confirmations                  | memory inspection            | evaluation/deployment                     | auth/profile management      | HITL                  | human minutes/run       |

Primary KPI: **verified outcome / (AI tokens + compute + human attention)**.
