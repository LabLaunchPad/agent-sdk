---
type: Contract
title: Merge and Release Gate Contract
description: Merge and Release Gate Contract
tags: ['merge', 'release', 'gates', 'security']
x_verification_state: documented
generated:
  by: lablaunchpad-research/1.0
  at: 2026-08-17
sources:
  - resource: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets
  - resource: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks
  - resource: https://google.github.io/eng-practices/review/reviewer/looking-for.html
---

# MERGE READY requires all applicable gates

## Gate A — Scope

- PR title/description identify what and why.
- Diff matches requested scope.
- No unexplained unrelated files.

Google treats a change description as a durable record of what and why.

## Gate B — Review

- Required reviewers approved.
- Code-owner requirements satisfied where applicable.
- No unresolved blocking review comments.
- Approval still applies to the current diff.

GitHub rules can require approvals, code-owner reviews, and can dismiss stale approvals when the diff changes.

## Gate C — Correctness

- Relevant unit/integration/e2e tests pass.
- New behavior has appropriate tests.
- Negative/error paths are tested where material.
- UI changes receive behavioral/visual validation where applicable.

## Gate D — CI

- All required checks are green for the current merge context.
- No missing required status.
- No unexplained bypass.
- Cancellations and skipped checks are understood.

For merge queues, workflows must run on the `merge_group` event when required checks are used.

## Gate E — Security

- Secrets not introduced.
- Dependency changes reviewed.
- Dangerous permissions reviewed.
- CI workflow changes reviewed as infrastructure code.
- Deployment credentials follow least privilege.

## Gate F — Operational readiness

- Migration/rollback implications understood.
- Feature flags/config changes accounted for.
- Observability exists for material runtime changes.
- Deployment target and environment policy satisfied.

## Final decision

Only transition to MERGE_READY when the gate matrix is explicitly satisfied.

A green CI badge alone is never sufficient.
