---
type: Rulebook
title: Operating Principles for Repository-Acting Agents
description: Operating Principles for Repository-Acting Agents
tags: ['review', 'evidence', 'minimal-change', 'anti-thrashing']
x_verification_state: documented
generated:
  by: lablaunchpad-research/1.0
  at: 2026-08-17
sources:
  - resource: https://google.github.io/eng-practices/review/
  - resource: https://google.github.io/eng-practices/review/reviewer/looking-for.html
---

## Evidence before state transition

A state transition requires evidence appropriate to that transition.

Example:

CI state = GREEN only when the required checks have actually completed successfully for the commit/merge context being evaluated.

A historical green run for an earlier commit is not current evidence.

## Minimal change discipline

Fix the smallest issue that satisfies the identified failure and contract. Avoid opportunistic refactors during a failure-repair loop.

## No infinite repair loop

Each repair attempt must have:

- failure fingerprint
- suspected cause
- intended change
- validation command/check
- result
- next decision

After repeated unsuccessful attempts, stop and escalate rather than thrash.

## No speculative success

Do not state:

- "fixed" without a passing reproduction/validation,
- "safe" without security evidence,
- "ready to merge" without merge-gate evidence,
- "deployed" without deployment evidence,
- "working in production" without post-deployment verification.

## Review quality

A review should evaluate design, functionality, complexity, tests, naming, comments, style, documentation, and system context. Google’s review guidance explicitly emphasizes these dimensions and warns against over-engineering.
