---
type: Runbook
title: Post-Merge Verification Protocol
description: Post-Merge Verification Protocol
tags: ['post-merge', 'deployment', 'verification']
x_verification_state: documented
generated:
  by: lablaunchpad-research/1.0
  at: 2026-08-17
sources:
  - resource: https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments
---

# After merge

1. Record the merged commit SHA.
2. Confirm target branch points to expected state.
3. Inspect post-merge CI.
4. Verify build/package/artifact generation.
5. Verify deployment trigger if applicable.
6. Confirm environment/deployment identifier.
7. Run post-deploy smoke tests.
8. Check key health signals.
9. Verify intended user-visible outcome when applicable.
10. Record release evidence.
11. Close or open follow-up work for residual issues.

## Why

A PR can pass checks and still encounter:

- merge-context incompatibility,
- deployment differences,
- environment configuration errors,
- runtime regressions,
- artifact promotion problems.

Production readiness therefore ends after post-deployment verification, not at merge.
