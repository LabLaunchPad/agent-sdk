---
type: Research Consolidation Report
title: E5-08 Policy/Capability Bypass Result
description: Actual executed result of the SIMULATED Capability/Policy enforcement experiment, real environment and observed data, feeding ADR-0013 and KERNEL-CONSTITUTION.md sections 4.1/4.2
sources:
  - resource: /benchmarks/e5-08-policy-capability/runs/summary.json
    id: raw-results
generated:
  by: process:claude-code-session
  at: 2026-08-18T00:00:00Z
status: draft
x_evidence_level: E5 — executed, environment pinned, procedure reproducible, artifacts retained; harness_type SIMULATED (see Harness type below)
---

# E5-08 Result — Policy/Capability Bypass

## Harness type — read this before the results below

**SIMULATED.** `benchmarks/e5-08-policy-capability/store.mjs` implements
a minimal, deterministic Capability/Policy rule evaluator — not a real
`PolicyEngine`/`CapabilityEngine` (Phase 8/9 unstarted). This experiment
proves the enforcement _logic_ described in
`docs/architecture/KERNEL-CONSTITUTION.md` sections 4.1/4.2 (stale-
authorization re-checking, capability-scope matching, policy-version
freshness) is internally consistent and actually catches the named
failure modes — it is not evidence that a real Phase 8/9 implementation
will enforce identically, any more than E5-02's SIMULATED external
service proved anything about a real one.

## Record

| Field                 | Value                                                                                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `experiment_id`       | `E5-08-POLICY-CAPABILITY-BYPASS`                                                                                                                           |
| `dependency_versions` | Node `v24.19.0`, `node:sqlite` built-in (no external package), platform `linux`, arch `x64`                                                                |
| `model` / `provider`  | N/A — no model call involved                                                                                                                               |
| `configuration`       | One fresh SQLite database per trial (`capabilities`/`policies`/`operations` tables), default rollback-journal mode                                         |
| `input`               | 3 named adversarial cases (`ADV-12`/`ADV-13`/`ADV-14`), 1 positive control, 1 extra case (revocation)                                                      |
| `expected`            | The 3 adversarial cases are rejected at dispatch with the SIMULATED service never called; the control succeeds                                             |
| `observed`            | 5/5 executed cases pass on the recorded run below; stable across 5 consecutive re-runs (no flake, unlike E5-02's first attempt)                            |
| `artifacts`           | `benchmarks/e5-08-policy-capability/runs/summary.json` (raw output, retained), `benchmarks/e5-08-policy-capability/{store,run-e5-08}.mjs` (harness source) |

## Observed results (5/5 pass)

| #   | Case                                                      | What it proves                                                                                                                                                                              | Result                                                                             |
| --- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1   | **`ADV-12` stale-authorization**                          | A capability valid at authorize time but expired before dispatch is re-checked at the source-to-sink point and rejected — not silently trusted from the earlier check                       | `pass: true` — `serviceCalled: false`, `outcome: CAPABILITY_EXPIRED_AT_DISPATCH`   |
| 2   | **`ADV-13` capability-escalation**                        | A principal holding a valid, unexpired capability for one action cannot dispatch a _different_ action under it                                                                              | `pass: true` — `serviceCalled: false`, `outcome: CAPABILITY_SCOPE_MISMATCH`        |
| 3   | **`ADV-14` policy-bypass**                                | A `PolicyDecision` of `ALLOW` bound to policy v1 at authorize time is re-evaluated against the current active version (v2, denying) at dispatch — the stale cached `ALLOW` is never trusted | `pass: true` — `serviceCalled: false`, `outcome: POLICY_STALE_REEVALUATION_DENIED` |
| 4   | **Positive control**                                      | An unexpired, correctly-scoped capability under an unchanged policy dispatches successfully — the 3 rejections above are the gate working, not blanket rejection                            | `pass: true` — `serviceCalled: true`, `finalState: ACKED`                          |
| 5   | **Capability revocation** (extra, not a named `ADV` case) | Revocation takes effect independent of the expiry clock                                                                                                                                     | `pass: true` — `serviceCalled: false`, `outcome: CAPABILITY_REVOKED`               |

## Conclusion

This run **supports** the Capability lifecycle and Policy freshness rules
added to `KERNEL-CONSTITUTION.md` sections 4.1/4.2 this same pass: the
enforcement logic, exercised for real (not asserted in prose), correctly
gates all 3 named failure modes at the source-to-sink point and correctly
lets a valid operation through. It does not prove a real
`PolicyEngine`/`CapabilityEngine` implementation (Phase 8/9) will enforce
identically — see Limitations.

## Architecture impact

- **Does it support ADR-0013?** Yes — first empirical evidence (not just
  documentation) that source-to-sink enforcement, applied to Capability
  and Policy independently, actually catches stale-authorization,
  scope-escalation, and policy-staleness in a working implementation of
  the described logic.
- **Does it invalidate ADR-0013?** No.
- **Does it require an ADR-CANDIDATE?** No — confirmatory.
- **Does it change `KERNEL-CONSTITUTION.md`?** The sections 4.1/4.2
  additions this same pass are elaboration of ADR-0013, written _before_
  this harness (spec first, then test, matching E5-02's own sequencing) —
  this run validates that elaboration, it doesn't further change it.

## Limitations — read before treating this as more than it is

1. **SIMULATED, not real** — the single largest limitation, same as
   E5-02. No real `PolicyEngine`/`CapabilityEngine`, no real principal
   identity system, no real network boundary.
2. **Single-process, synchronous evaluation.** The freshness check
   (`ADV-14`) works here because both the authorize-time and dispatch-time
   reads happen in the same process against the same SQLite file with no
   concurrent policy-version writers — a real system with concurrent
   policy updates across multiple processes needs its own concurrency
   story (related to, but not tested by, `ADV-08`'s optimistic-
   concurrency guard from E5-02).
3. **Only 2 of the 3 originally-named `PHASE_2_IMPLEMENTATION`-adjacent
   `NOT_EXECUTED` cases from `kernel-core.json` needed genuinely new
   mechanics** — `ADV-12` and `ADV-13` share the same `checkCapability`
   gate; only `ADV-14` required the separate policy-version-freshness
   mechanism. This is a real design observation, not a shortcut: it
   suggests Capability and Policy enforcement may be closer to one
   unified gate than two independent ones in practice, worth revisiting
   when a real implementation is built.
4. **The "action" and "object" concepts here are opaque strings.** A real
   system's action/object taxonomy (what counts as "the same action") is
   itself a design question this harness sidesteps by using exact string
   matching.
5. **Does not test `ADV-09`/`ADV-10`/`ADV-11`** (illegal-transition,
   duplicate-event, reordered-event — still `NOT_EXECUTED`, need a real
   Guard/Event-log model per section 1) or `ADV-15` (schema-version-
   mismatch — needs Phase 4). Those remain open, unaffected by this pass.

This is the third real E5 data point this session (`E5-DURABLE-RESTART`,
`E5-02-UNKNOWN-OUTCOME`, now `E5-08`). `GAP-E5-ZERO` is 3/14+.
`E5-08`'s own named trigger in `E5-LADDER.md` was "Phase 8/9 PolicyEngine/
CapabilityEngine exists" — a SIMULATED one doesn't fully satisfy that
trigger, so this is recorded as `PASS_SIMULATED`, not a full close.
