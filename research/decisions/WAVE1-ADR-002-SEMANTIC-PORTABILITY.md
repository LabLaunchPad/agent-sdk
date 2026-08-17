---
type: Topic Research
title: ADR 002 SEMANTIC PORTABILITY
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

# ADR-002 — Semantic Portability

**Decision:** ADOPT  
**Evidence:** Current routing/SDK evidence plus the explicit requirement for matched tests  
**Reversibility:** R1

Never equate adapter/API compatibility with semantic portability. Publish `TESTED_SEMANTIC_PORTABILITY` for the tested task class only.
