---
type: Research Consolidation Report
title: E5-02 UNKNOWN_OUTCOME Reconciliation Result
description: Actual executed result of the SIMULATED UNKNOWN_OUTCOME/side-effect reconciliation experiment, real environment and observed data, feeding ADR-0011 and KERNEL-CONSTITUTION.md section 2
sources:
  - resource: /benchmarks/e5-02-unknown-outcome/runs/summary.json
    id: raw-results
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_evidence_level: E5 — executed, environment pinned, procedure reproducible, artifacts retained; harness_type SIMULATED (see Harness type below)
---

# E5-02 Result — UNKNOWN_OUTCOME / Side-Effect Reconciliation

## Harness type — read this before the results below

**SIMULATED.** The external side-effect service (`benchmarks/e5-02-unknown-outcome/service.mjs`)
is a local child process with its own durable SQLite log, standing in for
a real remote system. No real capability/policy/side-effect implementation
exists yet (Phase 8/9 unstarted), so this experiment tests the kernel-side
Operation state machine and reconciliation logic against a service that
behaves the way ADR-0011 assumes a well-behaved external system would
(idempotent, logs before it responds) — it is not evidence about any real
external system's actual behavior. This is exactly the gap
`research/benchmarks/E5-RESULT.md`'s scope-qualified verdict named as
`external_side_effect_durability: NOT_YET_PROVEN`; this experiment narrows
that gap for the _reconciliation logic_, not for real network/API failure
modes, which remain untested.

## Record

| Field                 | Value                                                                                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `experiment_id`       | `E5-02-UNKNOWN-OUTCOME`                                                                                                                                                                    |
| `dependency_versions` | Node `v24.19.0`, `node:sqlite` built-in (no external package), platform `linux`, arch `x64`                                                                                                |
| `model` / `provider`  | N/A — no model call involved                                                                                                                                                               |
| `configuration`       | Two SQLite databases per trial (`<trial>-kernel.db` — the Operation state machine; `<trial>-service.db` — the SIMULATED external service's own durable log), default rollback-journal mode |
| `input`               | 1 primary 12-step scenario + 8 adversarial-case trials, each a fresh pair of databases                                                                                                     |
| `expected`            | Every executed case reaches the terminal state its scenario implies, with no blind duplicate side effect and no silent corruption acceptance                                               |
| `observed`            | 9/9 executed cases pass on the recorded run below; 7 further cases explicitly `NOT_EXECUTED` with stated reasons (see Not-executed cases)                                                  |
| `artifacts`           | `benchmarks/e5-02-unknown-outcome/runs/summary.json` (raw output, retained), `benchmarks/e5-02-unknown-outcome/{store,service,reconcile-worker,run-e5-02}.mjs` (harness source)            |

## Observed results — executed cases (9/9 pass)

| #   | Case                                     | What it proves                                                                                                                                                                                                                                                              | Result                                                                                        |
| --- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | **Primary 12-step scenario**             | create → authorize → dispatch(checkpoint) → real side effect happens → ack lost → process killed → restart → recover → classify `UNKNOWN_OUTCOME` → reconcile against the service's own log → reach `ACKED` → no blind duplicate dispatch (service `dispatch_attempts = 1`) | `pass: true` — all 12 steps observed in order                                                 |
| 2   | **Duplicate operation**                  | Redispatching the already-ACKED operation's idempotency key hits the service's own dedup path; effect is not re-performed (`committed_at` unchanged), attempt counter increments                                                                                            | `pass: true`                                                                                  |
| 3   | **Timeout after real side effect**       | Kernel stops waiting for a still-running (never-killed) service call; correctly classifies `UNKNOWN_OUTCOME` rather than assuming failure; later reconciles to `ACKED` once the service's own log catches up                                                                | `pass: true`                                                                                  |
| 4   | **Response lost after real side effect** | Isolated from the primary scenario's composite result: side effect commits, response is never observed by the kernel, reconciliation still reaches `ACKED` from the service's own log                                                                                       | `pass: true`                                                                                  |
| 5   | **Kill before checkpoint**               | No `DISPATCHED` checkpoint was ever written (simulated crash between `AUTHORIZED` and dispatch); restart correctly finds `AUTHORIZED`, not `UNKNOWN_OUTCOME` — safe to redispatch fresh, and the service has no record                                                      | `pass: true`                                                                                  |
| 6   | **Kill after checkpoint**                | `DISPATCHED` checkpoint is durable but the service call never actually happened; restart classifies `UNKNOWN_OUTCOME`, reconciliation finds no service evidence and resolves `REJECTED`                                                                                     | `pass: true`, with a stated limitation (see below)                                            |
| 7   | **Checkpoint corruption**                | Direct byte-level corruption of the kernel database's SQLite header is detected (`threwOnOpen: true`) rather than silently trusted                                                                                                                                          | `pass: true` — see Corrections below; the first corruption technique tried did **not** detect |
| 8   | **Replay determinism**                   | The identical persisted database state, reconciled twice from independent snapshots, produces byte-identical resulting `state`/`outcome` both times                                                                                                                         | `pass: true`                                                                                  |
| 9   | **Concurrent state mutation**            | Two independently spawned "restarted worker" processes race to reconcile the same `UNKNOWN_OUTCOME` operation via the guarded, optimistic-concurrency transition; exactly one wins, no duplicate dispatch is triggered                                                      | `pass: true`                                                                                  |

Re-run 5 consecutive times after the corrections below (see Corrections);
all 5 runs show `all_executed_pass: true`. Not a large-N statistical
sample, but more than the single-run discipline `E5-DURABLE-RESTART`
used, specifically because trial 1 below surfaced a real flake worth
confirming was actually fixed.

## Corrections made during this run (recorded, not silently fixed)

1. **`service_log` table missing on first query of a service database
   that was never dispatched to** (the `kill-before-checkpoint` case
   queries `service.db` for evidence, but that database was freshly
   created and the service process never ran). Fixed by having the query
   helper create the table if absent, matching the schema `service.mjs`
   itself defines — an empty result, not a crash, is the correct outcome
   when no evidence exists.
2. **Stale sentinel files from a prior run caused a false-positive
   "already committed" read on a fresh trial.** `service.mjs` writes
   `<serviceDb>.<idempotencyKey>.{started,committed,deduped}` sentinel
   files next to the database; the orchestrator's per-trial cleanup
   deleted the database files but not these sentinels, so a second
   invocation of the whole script inherited a leftover `.committed`
   sentinel from the first invocation and killed the new dispatch
   immediately — before the new database write had actually happened.
   Fixed by sweeping all sentinel files matching the trial's database
   basename before each trial.
3. **`checkpoint-corruption` case initially did not detect corruption.**
   The first attempt overwrote 200 bytes in the middle of the file (byte
   offset 2000), landing in unallocated space inside an otherwise nearly-
   empty SQLite page that `PRAGMA integrity_check` does not inspect —
   `integrityCheckResult: "ok"` on a file that had, in fact, been altered.
   This is an honest miss, not a silently-accepted one: corrected to
   overwrite the fixed 16-byte `"SQLite format 3\0"` header magic instead,
   which reliably makes the file fail to open at all
   (`threwOnOpen: true`) — a real, reproducible detection, at the cost of
   testing a cruder corruption than criterion 1's full intent (see
   Limitations).
4. **`response-lost-after-real-side-effect` flaked once (1 run out of the
   initial 3) with `responseObserved: true`** — the orchestrator's
   poll-then-`SIGKILL` round trip (an `fs.existsSync` poll plus a
   `process.kill` syscall) occasionally lost the race against the SIMULATED
   service's own synchronous close/print/exit path under real OS
   scheduling in this container. Fixed the same way
   `benchmarks/durable-restart/` fixed its own timing problem: widened the
   window (added a deliberate 60ms delay in `service.mjs` between writing
   the `.committed` sentinel and printing/exiting) so the intended
   "response never observed" scenario is reliably reproducible rather than
   racing on shared-container scheduling noise. 5 consecutive re-runs after
   this fix show no further flake.

## Not-executed cases (7) — reasons, not silence

| #   | Case                    | Reason not executed                                                                                                                                                                                                                                                      |
| --- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Illegal transition      | This harness's `transition()` guard rejects any `fromStates` mismatch, but no real Guard/Context model (`KERNEL-CONSTITUTION.md` section 1) exists to mount an actually adversarial illegal-transition attempt against — only the one legal path per case was exercised. |
| 2   | Duplicate event         | No Event identity/log exists in this harness (section 1's `Event` carries its own identity) — only Operation-level idempotency was exercised, a different mechanism.                                                                                                     |
| 3   | Reordered event         | Same reason as duplicate event: no persisted Event log to reorder.                                                                                                                                                                                                       |
| 4   | Stale authorization     | `Capability`/`PolicyDecision` fields are recorded but never expire or get re-evaluated in this harness — needs a real Capability grant with an expiry (ADR-0013).                                                                                                        |
| 5   | Capability escalation   | No real Capability enforcement boundary exists yet (Phase 8/9 unstarted) — the `capability` field here is a label, not an enforced grant.                                                                                                                                |
| 6   | Policy bypass           | Same reason as capability escalation — `PolicyDecision` is recorded, not enforced by a real PolicyEngine.                                                                                                                                                                |
| 7   | Schema-version mismatch | This harness runs a single schema version throughout — no second version exists to test migration/mismatch against (ADR-0010's schema migration invariant, Phase 4).                                                                                                     |

This matches the plan's own scoping exactly: these 7 all require a real
Policy/Capability/state-machine-guard implementation this phase
deliberately does not build (`.context/research/reconciliation/phase-gate.json`'s
`PHASE_2_IMPLEMENTATION: LOCKED`).

## Conclusion

This run **supports** ADR-0011's `UNKNOWN_OUTCOME` state design and the
Operation state machine formalized in `KERNEL-CONSTITUTION.md` section 2:
against a SIMULATED external service, a lost response after a real side
effect is correctly classified `UNKNOWN_OUTCOME` rather than silently
`REJECTED`, reconciliation against the service's own durable log correctly
resolves the true outcome, and no case produced a blind duplicate
dispatch. It does not prove the design holds against a real external
system's actual failure modes (network partition, ambiguous partial
responses, a service with no reliable status-check endpoint) — see
Limitations.

## Architecture impact (per the operating prompt's own E5-decision-feedback framework)

- **Does it support ADR-0011?** Yes — first empirical evidence (not just
  documentation) that the `UNKNOWN_OUTCOME` → `RECONCILING` →
  terminal-state path is implementable and behaves as designed against a
  well-behaved simulated service.
- **Does it invalidate ADR-0011?** No.
- **Does it require an ADR-CANDIDATE?** No — confirmatory, not surprising.
- **Does it change `KERNEL-CONSTITUTION.md`?** No — section 2's `RECONCILING`
  behavior already anticipated exactly the degrade-to-`MANUAL_REVIEW` case
  this run's `kill-after-checkpoint` limitation calls out; the spec is
  unchanged, this experiment is evidence for it, not a correction to it.

## Limitations — read before treating this as more than it is

1. **SIMULATED, not real.** The single largest limitation, stated up
   front and repeated here: no real external system, no real network
   boundary, no real capability/policy enforcement.
2. **`kill-after-checkpoint`'s `REJECTED` result is trustworthy only
   because this SIMULATED service honors a log-before-respond invariant
   with a reliable status check.** A real external system with no
   equivalently reliable idempotent status endpoint must degrade this same
   no-evidence-found case to `MANUAL_REVIEW` instead of `REJECTED` — this
   harness always has a reliable status check available, so it never
   actually exercises the `MANUAL_REVIEW` exit path described in
   `KERNEL-CONSTITUTION.md` section 2.
3. **Corruption detection tested only a crude form** (destroying the file
   header entirely) after a subtler mid-file byte corruption went
   undetected by `PRAGMA integrity_check` — of the 7 corruption criteria
   defined in `E5-RESULT.md`, this run measured criterion 1 (schema
   violation, via unreadable-file detection) only; criteria 2, 3, 5, 6,
   and 7 remain unmeasured by this harness, same as `E5-DURABLE-RESTART`.
4. **Concurrency case used 2 workers only, reconcile-only (no dispatch
   race).** A real multi-worker deployment could have more workers and
   could race on dispatch itself, not just reconciliation — this harness's
   `duplicate-operation` case and `concurrent-state-mutation` case together
   approximate that but do not test it directly combined.
5. **Single machine, single container, synchronous SQLite.** Same
   environment caveats as `E5-DURABLE-RESTART`.
6. **7 of 15 named adversarial cases NOT_EXECUTED**, each for a stated,
   real reason (see table above) — not a partial attempt at all 15.

This is the second real E5 data point (`GAP-E5-ZERO`, now 2/14+, still not
closed). The next highest-leverage E5s per `research/benchmarks/E5-LADDER.md`
(`E5-03` replay determinism against a real state machine, `E5-08`
policy/capability bypass) require Phase 4 and Phase 8/9 implementation
surfaces to exist first.
