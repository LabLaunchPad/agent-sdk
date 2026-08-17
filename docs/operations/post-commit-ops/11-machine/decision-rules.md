---
type: Machine Rules
title: Machine Decision Rules
description: Machine Decision Rules
tags: ['machine', 'rules', 'json']
x_verification_state: documented
generated:
  by: lablaunchpad-research/1.0
  at: 2026-08-17
---

```json
{
  "rules": [
    {
      "id": "R-MERGE-001",
      "when": "required_check_failed",
      "decision": "do_not_merge",
      "next": "diagnose"
    },
    {
      "id": "R-MERGE-002",
      "when": "required_check_missing",
      "decision": "do_not_merge",
      "next": "inspect_trigger_and_policy"
    },
    {
      "id": "R-MERGE-003",
      "when": "diff_changed_after_approval",
      "decision": "revalidate_review_status"
    },
    {
      "id": "R-MERGE-004",
      "when": "merge_result_unknown",
      "decision": "reconcile_authoritative_state_before_retry"
    },
    {
      "id": "R-DEPLOY-001",
      "when": "deployment_job_green",
      "decision": "verify_runtime"
    },
    {
      "id": "R-DEPLOY-002",
      "when": "deployment_result_unknown",
      "decision": "reconcile_before_retry"
    },
    {
      "id": "R-SEC-001",
      "when": "workflow_or_permission_change",
      "decision": "apply_security_review"
    }
  ]
}
```
