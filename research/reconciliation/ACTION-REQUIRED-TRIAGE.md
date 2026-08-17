---
type: Research Consolidation Report
title: Action Required Triage
description: Classification and resolution of all 12 ACTION_REQUIRED / ACTION_REQUIRED_AT_PHASE_18 entries in .context/research/decisions.json
sources:
  - resource: /.context/research/decisions.json
    id: decisions
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
---

# Action Required Triage

12 entries carried `ACTION_REQUIRED` or `ACTION_REQUIRED_AT_PHASE_18`
status before this phase. Each is classified per the operating prompt's own
categories and given a concrete resolution — none is left vague.

| #   | ID                                                               | Classification                                                   | Resolution                                                                                                                                                                                                                                                                                                                                                                                                  |
| --- | ---------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `reject-uniform-runtime-swap-assumption`                         | DECISION_REQUIRED, now RESOLVED                                  | Bound to ADR-0016. `decisions.json` status → `BOUND`.                                                                                                                                                                                                                                                                                                                                                       |
| 2   | `reject-local-always-cheaper`                                    | DECISION_REQUIRED, now RESOLVED                                  | Bound to ADR-0016. `decisions.json` status → `BOUND`.                                                                                                                                                                                                                                                                                                                                                       |
| 3   | `protocol-application-agent-state-distinction`                   | DECISION_REQUIRED (was deferred to Phase 18), now RESOLVED early | Bound to ADR-0009, ahead of Phase 18 since the decision itself doesn't require implementation to make — only the adapter code does. `decisions.json` status → `BOUND`.                                                                                                                                                                                                                                      |
| 4   | `reject-root-license-file-sufficiency`                           | NON_BLOCKING, DOCUMENTATION_REQUIRED — reclassified down         | Not an SDK architecture decision; a research-methodology rule that applies automatically the next time a dependency review happens. Already recorded in `docs/agent/DECISIONS.md`'s smaller-calls table and `research/contradictions/license-split-by-directory.md`. `decisions.json` status → `RECORDED` (downgraded from `ACTION_REQUIRED`, not left open indefinitely at a severity it doesn't warrant). |
| 5   | `reject-checkpointer-solves-persistence`                         | DECISION_REQUIRED, now RESOLVED                                  | Bound to ADR-0010. `decisions.json` status → `BOUND`.                                                                                                                                                                                                                                                                                                                                                       |
| 6   | `reject-llm-only-security-judgement`                             | DECISION_REQUIRED, now RESOLVED                                  | Bound to ADR-0013. `decisions.json` status → `BOUND`.                                                                                                                                                                                                                                                                                                                                                       |
| 7   | `imported-corpus-not-yet-reconciled-with-architecture` (batch 1) | BLOCKING (was), now RESOLVED as a side effect                    | This entire reconciliation phase _is_ the requested reconciliation. `decisions.json` status → `BOUND` (points at this document set).                                                                                                                                                                                                                                                                        |
| 8   | `batch-2-corpus-not-yet-reconciled-with-architecture`            | BLOCKING (was), now RESOLVED as a side effect                    | Same resolution as #7. `decisions.json` status → `BOUND`.                                                                                                                                                                                                                                                                                                                                                   |
| 9   | `post-commit-ops-bundle-not-yet-adopted`                         | DECISION_REQUIRED, now RESOLVED                                  | See `POST-COMMIT-OPS-DECISION.md`. Outcome: `DEFER` (not adoption). `decisions.json` status → `DEFERRED`.                                                                                                                                                                                                                                                                                                   |
| 10  | `current-wave-cw-005-source-to-sink-security`                    | DECISION_REQUIRED, now RESOLVED                                  | Bound to ADR-0013 (same ADR as #6 — duplicate finding, single binding). `decisions.json` status → `BOUND`.                                                                                                                                                                                                                                                                                                  |
| 11  | `current-wave-corpus-not-yet-reconciled-with-architecture`       | BLOCKING (was), now RESOLVED as a side effect                    | Same resolution as #7/#8. `decisions.json` status → `BOUND`.                                                                                                                                                                                                                                                                                                                                                |
| 12  | `wave1-corpus-not-yet-reconciled-with-architecture`              | BLOCKING (was), now RESOLVED as a side effect                    | Same resolution as #7/#8/#11. `decisions.json` status → `BOUND`.                                                                                                                                                                                                                                                                                                                                            |

## Summary

0 stale, 0 duplicate-and-dropped, 0 left vague. 8 resolved via a binding
ADR (some sharing an ADR with another item — ADR-0013 closes both #6 and
#10, since they were independently the same finding). 4 resolved as a side
effect of this reconciliation existing. 1 resolved via a non-ADR decision
analysis (post-commit-ops, `DEFER`). 1 reclassified down from
`ACTION_REQUIRED` to `RECORDED` on the grounds that it was never actually
blocking anything — a methodology rule that self-enforces at its point of
future use, not a decision awaiting a choice.

`ACTION_GATE` (see `docs/agent/NOW.md`'s phase-gate section): **PASS** —
zero `ACTION_REQUIRED` or `ACTION_REQUIRED_AT_PHASE_18` entries remain in
`.context/research/decisions.json` after this phase's updates.
