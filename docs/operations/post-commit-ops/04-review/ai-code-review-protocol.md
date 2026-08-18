---
type: Protocol
title: AI Code Review Protocol
description: AI Code Review Protocol
tags: ['code-review', 'findings', 'severity']
x_verification_state: documented
generated:
  by: lablaunchpad-research/1.0
  at: 2026-08-17
sources:
  - resource: https://google.github.io/eng-practices/review/reviewer/looking-for.html
  - resource: https://google.github.io/eng-practices/review/
  - resource: https://google.github.io/eng-practices/review/reviewer/comments.html
---

## Review order

1. Read PR description.
2. Inspect changed-file inventory.
3. Understand architecture impact.
4. Review highest-risk paths first.
5. Review every human-authored changed line.
6. Inspect tests.
7. Inspect documentation and configuration.
8. Check concurrency, security, compatibility, migration and rollback concerns.
9. Produce findings with severity and evidence.

## Finding format

`SEVERITY / LOCATION / CLAIM / WHY / EVIDENCE / FIX / VALIDATION`

Severity:

- BLOCKER: cannot safely merge
- HIGH: likely defect, security, data loss, breaking behavior
- MEDIUM: correctness/maintainability concern needing resolution
- LOW: non-blocking improvement
- NIT: preference only; never block on style preference alone

## Review principles

- Review design before details.
- Prefer simple solutions.
- Do not demand speculative abstractions.
- Tests are part of production code and must themselves be credible.
- Documentation must change when user/build/release behavior changes.
- Security/privacy/accessibility/concurrency require appropriate expertise.

These principles align closely with Google’s published review guidance.
