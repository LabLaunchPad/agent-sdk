---
type: Recovery Protocol
title: UNKNOWN_OUTCOME Reconciliation Protocol
description: UNKNOWN_OUTCOME Reconciliation Protocol
tags: ['unknown-outcome', 'idempotency', 'reconciliation']
x_verification_state: documented
generated:
  by: lablaunchpad-research/1.0
  at: 2026-08-17
---

Unknown outcome is a first-class state.

Use it when:

- network request timed out,
- merge response was lost,
- deployment client crashed,
- CI UI is stale,
- webhook delivery is uncertain,
- external API returned ambiguous result.

## Procedure

1. Do not repeat the side effect.
2. Query authoritative state.
3. Determine operation identifier if available.
4. Compare observed state to intended state.
5. If already applied: mark successful/reconciled.
6. If not applied: decide whether retry is safe/idempotent.
7. If state cannot be established: escalate.

This avoids duplicate merges, duplicate deployments, duplicate payments, duplicate migrations, and other unsafe retries.
