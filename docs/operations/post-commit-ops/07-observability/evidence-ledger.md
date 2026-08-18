---
type: Data Contract
title: Evidence Ledger for Repository-Acting Agents
description: Evidence Ledger for Repository-Acting Agents
tags: ['evidence', 'audit', 'events', 'provenance']
x_verification_state: documented
generated:
  by: lablaunchpad-research/1.0
  at: 2026-08-17
---

Each lifecycle transition creates an append-only evidence record.

```yaml
id: evt-unique
timestamp: ISO-8601
actor: agent-or-human
change_id: PR-or-task-id
state_from: REVIEWING
state_to: CI_RUNNING
commit_sha: abc123
base_sha: def456
evidence:
  - kind: workflow_run
    id: 123456
    status: in_progress
    url: https://...
decision:
  action: monitor
  reason: required checks are pending
uncertainty:
  - production impact not yet evaluated
```

## Required evidence classes

- source state
- diff state
- review state
- CI state
- security state
- deployment state
- runtime state
- rollback state

The final release record should make it possible for a later agent to reconstruct why the system considered the change complete.
