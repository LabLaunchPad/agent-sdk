---
type: Research Consolidation Report
title: E5 Durable Restart Result
description: Actual executed result of the durable-restart experiment, real environment and observed data, feeding ADR-0010
sources:
  - resource: /benchmarks/durable-restart/runs/summary.json
    id: raw-results
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_evidence_level: E5 — executed, environment pinned, procedure reproducible, artifacts retained
---

# E5 Result — Durable Restart

## Record

| Field                 | Value                                                                                                                                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `experiment_id`       | `E5-DURABLE-RESTART`                                                                                                                                                                                       |
| `repository_commit`   | `37223b3a9df3d302f657d1ee44530949f84faba0` (this phase's own changes are not yet included at the moment this experiment ran — expected for a benchmark run mid-development)                                |
| `dependency_versions` | Node `v24.19.0`, `node:sqlite` built-in (no external package), platform `linux`, arch `x64`                                                                                                                |
| `model` / `provider`  | N/A — no model call involved                                                                                                                                                                               |
| `configuration`       | 6 chunk rows, ~50KB payload each, 40ms delay between chunk writes, default SQLite rollback-journal mode (not WAL)                                                                                          |
| `input`               | 11 trials, `killAfterMs` ∈ {10, 100, 150, 180, 200, 220, 250, 300, 400, 600, 1000}                                                                                                                         |
| `expected`            | Every trial resolves to either fully absent (clean rollback) or fully present with matching chunk count (clean commit) — never a partial/corrupted state, and `PRAGMA integrity_check` always reports `ok` |
| `observed`            | Matches expected in all 11 trials — see table below                                                                                                                                                        |
| `artifacts`           | `benchmarks/durable-restart/runs/summary.json` (raw output, retained), `benchmarks/durable-restart/{writer,run-e5}.mjs` (harness source)                                                                   |

## Observed results

| Trial | `killAfterMs` | Transaction phase at kill                    | Verdict               | Integrity check |
| ----- | ------------- | -------------------------------------------- | --------------------- | --------------- |
| 0     | 10            | Before transaction started                   | `ROLLED_BACK_CLEANLY` | `ok`            |
| 1     | 100           | Mid-transaction (started, not committed)     | `ROLLED_BACK_CLEANLY` | `ok`            |
| 2     | 150           | Mid-transaction                              | `ROLLED_BACK_CLEANLY` | `ok`            |
| 3     | 180           | Mid-transaction                              | `ROLLED_BACK_CLEANLY` | `ok`            |
| 4     | 200           | Mid-transaction                              | `ROLLED_BACK_CLEANLY` | `ok`            |
| 5     | 220           | Mid-transaction                              | `ROLLED_BACK_CLEANLY` | `ok`            |
| 6     | 250           | Mid-transaction                              | `ROLLED_BACK_CLEANLY` | `ok`            |
| 7     | 300           | Process already exited (committed naturally) | `COMMITTED_CLEANLY`   | `ok`            |
| 8     | 400           | Process already exited (committed naturally) | `COMMITTED_CLEANLY`   | `ok`            |
| 9     | 600           | Process already exited (committed naturally) | `COMMITTED_CLEANLY`   | `ok`            |
| 10    | 1000          | Process already exited (committed naturally) | `COMMITTED_CLEANLY`   | `ok`            |

**6 genuine mid-transaction kills (trials 1-6), 6/6 rolled back cleanly.**
**4 genuine post-commit controls (trials 7-10), 4/4 committed cleanly with
the full expected chunk count.** 1 trivial pre-start trial. Zero
`CORRUPTED_PARTIAL_STATE` or `DB_UNREADABLE_AFTER_KILL` outcomes across
all 11 trials.

## Failure

None. Every trial matched its expected outcome.

## Conclusion

This run **supports** ADR-0010's evidence basis: SQLite's default
rollback-journal mode protected checkpoint state integrity across every
tested kill point in this harness, on this environment. It does not
**prove** the general claim — see Limitations.

## Architecture impact (per the operating prompt's own E5-decision-feedback framework)

- **Does it support ADR-0010?** Yes — this is the first empirical evidence
  (not just documentation) that SQLite-as-first-class-local-backend is a
  reasonable premise, at least for the specific write pattern tested.
- **Does it invalidate ADR-0010?** No.
- **Does it require an ADR-CANDIDATE?** No — the result is confirmatory,
  not surprising enough to warrant a new decision.
- **Does it change the spec?** Not yet — `specs/persistence/STORE-INTERFACES.md`'s
  retention/migration requirements (added via ADR-0010, this phase) are
  unaffected. A future, larger E5 run (see Limitations) could still change
  this.

## Limitations — read before treating this as more than it is

1. **Single run, no repetition.** Each trial ran once. No variance data —
   a single favorable outcome per kill point is not statistical confidence.
2. **Default rollback-journal mode only.** WAL mode (which a real
   `CheckpointStore` implementation might reasonably choose for
   concurrent-reader performance) was not tested and has different crash
   characteristics.
3. **Single machine, single container, no concurrent readers.** No test of
   a reader observing the database _during_ the write, only after restart.
4. **Small dataset** (~300KB total per checkpoint). Larger checkpoints, or
   ones spanning multiple OS-level `write()` calls under memory pressure,
   were not tested.
5. **Kill signal only, not other failure modes.** Power loss, disk-full,
   filesystem corruption, and OOM-kill (which may behave differently from
   `SIGKILL`) were not tested.
6. **No trial landed exactly at the commit boundary itself** — the gap
   between the last genuine mid-transaction trial (250ms) and the first
   post-commit control (300ms) is real, not deliberately probed finer. The
   actual moment of commit (the single highest-risk instant) was not
   directly targeted.

This is one real E5 data point, converting `GAP-E5-ZERO` from 0/14 to a
genuine but partial 1/14+ — not a closed gap. The next highest-leverage E5
(per `FIRST-E5-SELECTION.md`'s own deferred candidates) requires Phase 8/9
implementation to exist first.
