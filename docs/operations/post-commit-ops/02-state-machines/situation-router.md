---
type: Decision Table
title: Situation Router: State and Evidence Based Decisions
description: Situation Router: State and Evidence Based Decisions
tags: ["routing", "decision", "situation"]
x_verification_state: documented
generated:
  by: lablaunchpad-research/1.0
  at: 2026-08-17
---

## Decision algorithm

1. Identify current state.
2. Identify target outcome.
3. Gather only evidence required to distinguish the next possible states.
4. Classify the condition.
5. Select the narrowest safe action.
6. Execute.
7. Verify.
8. Record transition.

## Situation matrix

| Situation                                    | Agent action                                        | Forbidden action                     |
| -------------------------------------------- | --------------------------------------------------- | ------------------------------------ |
| Uncommitted changes remain unrelated to task | Isolate or ask for direction                        | Include unrelated work               |
| Commit exists but local validation not run   | Run risk-appropriate checks                         | Declare ready                        |
| PR opened, checks pending                    | Monitor/inspect                                     | Merge                                |
| Review comment is actionable                 | Reproduce → fix → test → reply                      | Say "done" without evidence          |
| Required check red                           | Diagnose root cause                                 | Disable check                        |
| Check red from unrelated flaky infra         | Verify reproducibility and policy; retry if allowed | Hide failure                         |
| Required check missing                       | Determine workflow trigger/policy mismatch          | Assume green                         |
| CI green but diff changed after approval     | Determine stale approval/policy status              | Merge blindly                        |
| Merge queue active                           | Treat queue's merged context as authoritative       | Rely only on PR branch CI            |
| Merge operation reports unknown result       | Query repository state before retry                 | Re-run merge blindly                 |
| Main changed after PR validation             | Re-evaluate required checks                         | Assume old green state is sufficient |
| Deploy job green                             | Perform runtime verification                        | Declare production healthy           |
| Deployment unknown                           | Reconcile environment state                         | Retry deployment blindly             |
| Runtime regression detected                  | Stop promotion / rollback per policy                | Continue rollout                     |
| Security-sensitive change                    | Require required security evidence/owner            | Self-approve                         |
| Agent lacks permission                       | Report blocker                                      | Attempt bypass                       |
| Architecture conflict                        | Create ADR candidate                                | Rewrite silently                     |
