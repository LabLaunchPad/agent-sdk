---
type: Topic Research
title: DURABLE EXECUTION
description: Comparison matrix imported from the wave1 research corpus
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus ("wave1", research run llp-rsch-2026-08-17-wave1), URLs not independently re-verified via WebFetch/WebSearch in this session unless otherwise noted - treat as DOCUMENTED_NOT_REPRODUCED
---

# Durable Execution

Current evidence shows materially different durability boundaries:

- Microsoft Agent Framework: checkpoints capture executor state, cross-executor state, pending messages and workflow position.
- DBOS: workflows recover from the last completed step; steps are at-least-once, while documented DBOS transactions have exactly-once transaction semantics.
- Restate: durable execution, state, timers and interaction flows; exactly-once semantics are tied to specific constructs.
- Cloudflare Workflows: persisted state, retries, long-running execution and external-event pauses.
- Temporal: crash-resistant workflow resumption is a core platform property.

Architecture implication: do not collapse all of these into a generic “exactly once” claim. Record the exact boundary and external-side-effect responsibility.

E5 comparison: NOT RUN.
