---
type: Runbook
title: CI Failure Diagnosis and Repair Protocol
description: CI Failure Diagnosis and Repair Protocol
tags: ['ci', 'failure', 'debugging', 'repair']
x_verification_state: documented
generated:
  by: lablaunchpad-research/1.0
  at: 2026-08-17
sources:
  - resource: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks
  - resource: https://docs.github.com/en/actions/how-tos/manage-workflow-runs/re-run-workflows-and-jobs
---

# Required loop

FAIL
→ IDENTIFY CHECK
→ CLASSIFY FAILURE
→ LOCATE ROOT CAUSE
→ REPRODUCE
→ PATCH
→ TARGETED TEST
→ FULL REQUIRED SUITE
→ RECHECK DIFF
→ REASSESS REVIEW
→ REPORT

## Failure classes

### Product defect

Fix code/test/config.

### Test defect

Verify whether test expectation, fixture, or environment is wrong before changing production code.

### CI configuration defect

Treat workflow configuration as production infrastructure. Check triggers, permissions, caching, matrix logic, secrets, runner assumptions.

### Dependency/environment defect

Determine whether the failure is deterministic, transient, or incompatibility-related.

### External service failure

Do not rewrite application code until the service failure is established.

### Flake

Re-run only under repository policy, capture repeated outcomes, and create a flake record if recurrence is meaningful.

### Missing required check

Inspect workflow trigger and branch/merge-queue configuration. GitHub documents that missing required checks can block merges, and merge-queue workflows require `merge_group` triggers.

## Repair discipline

One hypothesis per repair attempt whenever practical.

Do not make five unrelated changes and then claim the failing check was fixed.

GitHub supports re-running failed jobs and enabling debug logging; use these as diagnostic tools, not as substitutes for root-cause analysis.
