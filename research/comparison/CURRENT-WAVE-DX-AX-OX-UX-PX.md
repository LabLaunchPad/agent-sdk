---
type: Framework Research
title: DX / AX / OX / UX / PX Findings
description: 'Comparison matrix: DX / AX / OX / UX / PX Findings, imported from the "current wave" research corpus'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus ("current wave"), URLs not independently re-verified via WebFetch/WebSearch in this session - treat as DOCUMENTED_NOT_REPRODUCED
---

# DX / AX / OX / UX / PX Findings

## Developer experience

OpenAI intentionally exposes few primitives and a built-in runner. Microsoft uses a progressive model from agent -> tools -> sessions -> persistence -> workflows -> harness. Both approaches favour a small initial mental model with opt-in complexity. [OpenAI](https://openai.github.io/openai-agents-python/) [Microsoft](https://learn.microsoft.com/en-us/agent-framework/get-started/)

## Agent experience

An agent needs visibility into available capabilities, workspace state, approvals, progress, errors and durable checkpoints. OpenAI sandbox agents and browser-use both make workspace/browser state explicit rather than expecting the model to infer everything from transcript. [OpenAI](https://openai.github.io/openai-agents-python/sandbox_agents/) [browser-use](https://github.com/browser-use/browser-use/blob/main/browser_use/agent/service.py)

## Operator experience

MCP emphasizes user consent around data access and tool use. OpenAI and Microsoft both expose approval/HITL constructs. This supports an approval UX built around capability risk, not around arbitrary text prompts. [MCP](https://modelcontextprotocol.io/specification/2025-11-25) [OpenAI](https://openai.github.io/openai-agents-python/guardrails/) [Microsoft](https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-autogen/)

## AI maintainability

The agent-instruction ecosystem increasingly uses repository-local instruction and skill directories. OpenAI's current skills repository describes skills as discoverable folders containing a required SKILL.md plus optional scripts/references/assets; this is strongly aligned with AI-native progressive disclosure. [OpenAI Skills](https://github.com/openai/skills/blob/main/skills/.system/skill-creator/SKILL.md)

## LabLaunchPad decision

ADOPT progressive disclosure and repository-local instructions. Treat instructions, skills and memory as **data with provenance and trust level**, not as unconditional policy.
