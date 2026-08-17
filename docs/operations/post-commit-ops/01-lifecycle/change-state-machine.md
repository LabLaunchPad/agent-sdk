---
type: State Machine
title: Change Lifecycle State Machine
description: Change Lifecycle State Machine
tags: ['state', 'lifecycle', 'merge', 'deployment']
x_verification_state: documented
generated:
  by: lablaunchpad-research/1.0
  at: 2026-08-17
---

# Canonical states

| State              | Meaning                                                | Entry evidence                  | Allowed next states                |
| ------------------ | ------------------------------------------------------ | ------------------------------- | ---------------------------------- |
| DRAFT              | Work not yet ready                                     | Working intent exists           | IMPLEMENTING                       |
| IMPLEMENTING       | Code being changed                                     | Active task                     | LOCAL_VERIFIED, BLOCKED            |
| LOCAL_VERIFIED     | Local checks appropriate to risk passed                | Test/lint/type/build evidence   | COMMITTED                          |
| COMMITTED          | Commit created                                         | Commit SHA + diff               | PUSHED                             |
| PUSHED             | Branch commit available remotely                       | Remote SHA matches expected     | PR_OPEN                            |
| PR_OPEN            | Pull request exists                                    | PR id + base/head               | REVIEWING, CI_RUNNING              |
| REVIEWING          | Review in progress                                     | Reviewer/agent review started   | CHANGES_REQUESTED, APPROVED        |
| CHANGES_REQUESTED  | Review identified defects                              | Review findings                 | IMPLEMENTING                       |
| CI_RUNNING         | Required checks executing                              | Run ids/check suite             | CI_GREEN, CI_RED, CI_UNKNOWN       |
| CI_RED             | At least one relevant check failed                     | Failure evidence                | DIAGNOSING                         |
| CI_UNKNOWN         | Check missing, cancelled, stale, blocked, or ambiguous | Status evidence                 | DIAGNOSING, ESCALATE               |
| CI_GREEN           | Required checks passed for current merge context       | Current passing checks          | MERGE_READY                        |
| MERGE_READY        | Review + policy + checks satisfy gate                  | Gate matrix                     | MERGING, BLOCKED                   |
| MERGING            | Merge operation initiated                              | Merge action                    | MERGED, MERGE_UNKNOWN              |
| MERGE_UNKNOWN      | Merge result uncertain                                 | No authoritative result         | RECONCILING                        |
| MERGED             | PR merged to target                                    | Merge commit/SHA                | POST_MERGE_VERIFY                  |
| POST_MERGE_VERIFY  | Main branch verified                                   | Main SHA + checks               | DEPLOYING, COMPLETE                |
| DEPLOYING          | Deployment executing                                   | Deployment id                   | DEPLOYED, DEPLOY_UNKNOWN           |
| DEPLOY_UNKNOWN     | Outcome uncertain                                      | Incomplete/ambiguous evidence   | RECONCILING                        |
| DEPLOYED           | Deployment succeeded                                   | Environment/deployment evidence | POST_DEPLOY_VERIFY                 |
| POST_DEPLOY_VERIFY | Runtime health validated                               | Smoke/health/business evidence  | COMPLETE, ROLLBACK_CANDIDATE       |
| COMPLETE           | Change verified through declared release boundary      | Evidence bundle complete        | —                                  |
| BLOCKED            | Waiting on external condition                          | Explicit blocker                | REVIEWING, DIAGNOSING, ESCALATE    |
| ESCALATE           | Agent must not proceed autonomously                    | Policy/ambiguity/risk           | —                                  |
| RECONCILING        | Determine actual external state before retrying        | Unknown outcome                 | MERGED, DEPLOYED, FAILED, ESCALATE |
| FAILED             | Outcome did not satisfy contract                       | Failure evidence                | IMPLEMENTING, ROLLBACK_CANDIDATE   |

## Transition invariant

Every transition must append an evidence record:

`timestamp + actor + from + to + evidence + decision + remaining uncertainty`.
