---
type: Topic Research
title: ADR 001 MCP BASELINE
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

# ADR-001 — MCP 2026-07-28 Baseline

**Decision:** ADOPT  
**Evidence:** E3 official MCP specification release  
**Reversibility:** R2

Use a version-aware MCP adapter and do not encode protocol-level session state into the kernel. Legacy revision support, where needed, must be isolated behind compatibility adapters.

Revisit on spec change, major SDK change, or conformance failure.
