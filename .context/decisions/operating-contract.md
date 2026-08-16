---
type: Decision Summary
title: Operating Contract
description: Canonical cross-agent operating contract summary
sources:
  - resource: /AGENTS.md
    id: agents-md
generated:
  by: process:context-refresh
  at: 2026-08-16T20:59:54.637Z
status: stable
x_source_sha256: 049a0ef1911489dff2701111b640b673d9eef988fb0290f536e45ba05bba35a7
x_summary_version: 1.0.0
---

# Operating Contract

Compiled summary of [`/AGENTS.md`](/AGENTS.md)[^agents-md], the single canonical
cross-agent operating contract.

- **Role**: canonical cross-agent operating contract
- **Adapters**: `CLAUDE.md`, `OPENCODE.md`, `CODEX.md` — mechanically prevented
  from duplicating this contract
- **Cache rules**: C1–C10
- **Efficiency order**: deterministic function → compiled workflow → local
  model → normal model → frontier model → multi-agent → human
- **Unknown is a valid state**: yes — never claim verified/correct/stable
  without evidence

[^agents-md]: AGENTS.md, repository root.
