---
type: Runbook
title: Post-CI Verification Protocol
description: Post-CI Verification Protocol
tags: ['ci', 'verification', 'evidence']
x_verification_state: documented
generated:
  by: lablaunchpad-research/1.0
  at: 2026-08-17
---

A successful workflow is evidence about specific jobs, not proof about every requirement.

After CI becomes green:

1. Confirm the run corresponds to the intended commit or merge context.
2. Confirm all required checks are present.
3. Inspect skipped jobs and path filters.
4. Check artifacts/reports where applicable.
5. Review warnings and flaky retries.
6. Compare changed files against validated scope.
7. Re-run targeted tests locally for fixes introduced during CI repair.
8. Recalculate merge gate.
9. Do not reuse old approval assumptions after diff-changing edits.

## CI trust rule

`GREEN = required checks passed for this evaluated commit/context`

not

`GREEN = system is correct`.
