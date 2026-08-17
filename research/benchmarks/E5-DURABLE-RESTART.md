---
type: Research Consolidation Report
title: E5 Durable Restart Harness
description: Design of the throwaway kill-mid-write experiment feeding ADR-0010's evidence base
sources:
  - resource: /benchmarks/durable-restart/run-e5.mjs
    id: harness
  - resource: /benchmarks/durable-restart/writer.mjs
    id: writer
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
---

# E5 — Durable Restart

## Claim under test

A SQLite-backed checkpoint (header row + N chunk rows, written inside one
transaction) survives a hard kill (`SIGKILL`, unblockable, no cleanup
handler runs) at any point during the write, without ever leaving
partially-written state visible to a subsequent reader. This is the
environmental assumption underneath ADR-0010's "SQLite as a first-class
local `CheckpointStore` backend" claim.

## Harness design

**Not part of any `@lablaunchpad/*` package** — `benchmarks/durable-restart/`,
outside `packages/`, generic Node.js + the built-in `node:sqlite` module
(`DatabaseSync`, no external dependency). Two files:

- `writer.mjs` — a child process. Opens a file-backed SQLite DB, creates
  `checkpoints`/`checkpoint_chunks` tables (auto-committed DDL, before the
  timed transaction), writes a `.started` sentinel file, then opens
  `BEGIN IMMEDIATE`, inserts a header row (`status='writing'`), inserts 6
  chunk rows (each ~50KB payload) with a 40ms delay between chunks
  (~240ms total in-transaction duration), updates the header to
  `status='complete'`, commits, writes a `.committed` sentinel file, exits.
- `run-e5.mjs` — the orchestrator. For each trial: deletes any prior DB/
  journal/sentinel files, spawns `writer.mjs`, waits `killAfterMs`, sends
  `SIGKILL` if the child hasn't already exited, waits for the child to be
  reaped, then opens the same DB file as a **fresh, separate connection**
  (simulating a process restart) and checks: `PRAGMA integrity_check`,
  whether the header row exists, its `status`, and whether the chunk count
  matches what was expected. Records `transactionStarted`/
  `transactionCommittedBeforeKill` from the sentinel files so each trial's
  outcome can be classified by what phase the kill actually landed in, not
  just guessed from wall-clock delay.

## Methodology note — the harness was corrected mid-run, not silently

The first run used short delays (5-80ms) calibrated against an assumed
near-instant child-process startup. Every trial, including the 80ms
"control" expected to land after commit, came back `ROLLED_BACK_CLEANLY`
with `transactionStarted: false` in the earliest trials — the child
process's own Node/ESM startup overhead under this container consumed
most of the intended window, so most trials never reached the transaction
at all. This was a real methodological gap, not a result — recorded here
rather than reported as a finding. Fixed by adding the `.started`/
`.committed` sentinel files (so trial classification comes from observed
process state, not assumed timing) and widening the delay sweep to
10-1000ms. See `E5-RESULT.md` for the corrected run's actual output.

## Trial design (corrected)

11 trials, `killAfterMs` ∈ {10, 100, 150, 180, 200, 220, 250, 300, 400,
600, 1000}, single machine, single run (not yet repeated for
variance — see Limitations in `E5-RESULT.md`).
