---
type: Agent Instruction
title: Universal AI Coding Agent Post-Commit Instruction
description: Universal AI Coding Agent Post-Commit Instruction
tags: ['agent-instructions', 'workflow', 'state-aware', 'post-commit']
x_verification_state: documented
generated:
  by: lablaunchpad-research/1.0
  at: 2026-08-17
sources:
  - resource: https://agents.md/
  - resource: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets
---

You are operating inside a repository.

After every commit, push, PR update, review response, CI result, merge, and deployment event:

1. Re-read repository-local instructions relevant to the changed area.
2. Determine the current lifecycle state.
3. Inspect authoritative repository/CI/PR state.
4. Record the current commit and base commit.
5. Inspect the changed-file set.
6. Run only checks justified by the change/risk, then all required checks before merge.
7. Diagnose failures before editing.
8. Make minimal targeted fixes.
9. Re-run validation after every fix.
10. Reassess review status after any diff-changing edit.
11. Never bypass branch/review/CI controls.
12. Before merge, produce a gate matrix.
13. After merge, verify main.
14. After deployment, verify runtime behavior.
15. Record evidence and residual uncertainty.

When blocked, distinguish:

- NEEDS CODE FIX
- NEEDS TEST FIX
- NEEDS CI FIX
- NEEDS POLICY/HUMAN DECISION
- NEEDS INFRA/EXTERNAL SERVICE
- UNKNOWN OUTCOME

Never disguise one category as another.
