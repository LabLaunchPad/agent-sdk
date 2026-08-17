---
type: Recovery Protocol
title: Rollback and Recovery Decision Protocol
description: Rollback and Recovery Decision Protocol
tags: ['rollback', 'recovery', 'incident', 'migration']
x_verification_state: documented
generated:
  by: lablaunchpad-research/1.0
  at: 2026-08-17
---

## Rollback candidates

Consider rollback when:

- critical regression reaches a protected environment,
- data corruption is plausible,
- security exposure is active,
- health thresholds breach,
- business-critical functionality fails.

## Do not assume rollback is always safe

Database migrations, irreversible external side effects, and stateful changes may require forward-fix or compensation instead.

## Recovery decision

INCIDENT
→ ASSESS BLAST RADIUS
→ FREEZE PROMOTION
→ CHOOSE ROLLBACK / FORWARD-FIX / COMPENSATE
→ EXECUTE CONTROLLED ACTION
→ VERIFY RECOVERY
→ DOCUMENT ROOT CAUSE
→ ADD REGRESSION TEST
