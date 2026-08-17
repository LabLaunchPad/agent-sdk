---
type: Decision Summary
title: Operating Contract
description: Canonical cross-agent operating contract summary
sources:
  - resource: /AGENTS.md
    id: agents-md
generated:
  by: process:context-refresh
  at: 2026-08-17T15:38:50.759Z
status: stable
x_source_sha256: 731c00dc50bb8fd260519cab723c81e6c146071781b674a65fe905dc24457865
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
- **Claim classification** (added 2026-08-17): optional
  FACT/INFERENCE/ASSUMPTION/HYPOTHESIS/RECOMMENDATION/DECISION/UNKNOWN
  vocabulary refining the Evidence principle — see
  `research/reconciliation/KNOWLEDGE-OS-RECONCILIATION.md`

[^agents-md]: AGENTS.md, repository root.
