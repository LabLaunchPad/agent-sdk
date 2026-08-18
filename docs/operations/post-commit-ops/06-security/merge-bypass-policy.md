---
type: Policy
title: No-Bypass Merge Policy
description: No-Bypass Merge Policy
tags: ['security', 'governance', 'merge', 'policy']
x_verification_state: documented
generated:
  by: lablaunchpad-research/1.0
  at: 2026-08-17
sources:
  - resource: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets
---

An AI agent MUST NOT:

- disable required checks,
- remove branch protection/rulesets,
- dismiss blocking reviews without explicit authorization,
- rewrite protected branch history,
- use force-push to bypass policy,
- merge through an alternate path to avoid review,
- weaken tests solely to make CI green,
- change workflow triggers solely to avoid a failing check.

Acceptable exception:
A human authorized by repository policy intentionally changes governance/configuration for a legitimate reason.

The agent must record:

- who authorized it,
- why,
- exact policy changed,
- scope,
- rollback plan,
- verification.
