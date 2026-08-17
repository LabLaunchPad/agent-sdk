---
type: Topic Research
title: ADR 003 DURABILITY BOUNDARY
description: ADR proposal imported from the wave1 research corpus
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus ("wave1", research run llp-rsch-2026-08-17-wave1), URLs not independently re-verified via WebFetch/WebSearch in this session unless otherwise noted - treat as DOCUMENTED_NOT_REPRODUCED
---

# ADR-003 — Replaceable Durability Boundary

**Decision:** ADOPT  
**Evidence:** Microsoft Agent Framework, DBOS, Restate, Cloudflare Workflows, Temporal and OpenAI runtime evidence  
**Reversibility:** R2

Keep durability as a replaceable boundary with explicit guarantees per backend. Do not create a universal “exactly once” abstraction without scoped semantics.
