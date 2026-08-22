---
type: Architecture Decision
title: Cancellation Ownership
description: Cancel is a durable, single-winner request discovered by the executor on its own tick, with ownership-fenced terminal writes.
generated:
  by: process:claude-code-session
  at: 2026-08-22T00:00:00Z
status: draft
---

# AMD-011 — Cancel is a request with an owner, not a command

Resolves [CONFLICT-011](../../architecture/conflicts/CONFLICT-011-cancel-is-a-request-not-a-command.md).
**Requires [AMD-010](AMD-010-dual-action-identity.md)** — cancellation targets `action_id`, which AMD-010 defines.

| Field      | Value |
| ---------- | ----- |
| Phase      | P00   |
| Supersedes | —     |

## Context

Cancellation was written as though `REQUEST_CANCEL → AUTHORIZED` is a transition the *canceller*
performs. For a run executing inside another worker, process or device, it is not: the canceller
can only record a request; the executor observes it and acts.

Read as a command, the design yields an implementation where cancel appears to succeed and
silently does nothing — precisely the failure the original text warns against. Three gaps follow:
**no single-winner rule** (two concurrent cancels, or a cancel racing a timeout, can both believe
they won and produce two terminal writes); **unbounded, unspecified latency** on
`CancelAuthorized → Stopping`, presented as instantaneous when it is really up to one heartbeat
tick; and **no ownership fence**, so a worker that lost its lease can wake and write a terminal
status over a run another worker already finished, resurrecting a dead run.

## Decision

1. **Cancel is a request.** The API returns *requested* or *cancelled* as **distinct outcomes**.
   It never claims a completion it cannot observe.
2. **The request is durably persisted and atomically single-winner.** Exactly one cancel action
   wins among concurrent requests; the others observe the winner rather than proceeding.
3. **The executor discovers it on its own tick.** The `CancelAuthorized → Stopping` edge carries a
   latency bounded by the heartbeat/lease period, and **that bound is specified**, not left implicit.
4. **Terminal writes are ownership-fenced.** A worker that has lost ownership must not write a
   terminal state.
5. **Mint run-owner identity in M0**, even though M0 is single-process.

Point 5 is the one that looks unnecessary and is not. Retrofitting an ownership key was the
expensive part of this change in both reference projects; the field costs nothing now and a
migration later. M0 can hold a constant owner and still have the field.

## Adversarial review

**Attack:** points 2–4 are distributed-systems machinery for a single-process M0. Nothing in M0
can lose a lease, so the fence is untestable there, and untested machinery is usually broken
machinery.

**Failure modes:** the fence is written but never exercised, and is wrong when federation
arrives — the worst of both worlds, since its presence discourages re-examination. Or the
specified latency bound is honoured in M0 (where it is trivially zero) and quietly violated in
the first real deployment.

**Falsifying experiment:** the fence *is* testable without federation — simulate lease loss by
revoking ownership in-process and assert the terminal write is rejected. That test is cheap and
must be written, otherwise point 4 is decoration. For the latency bound, the observable is that
the bound is a **declared value** rather than a comment: assert that a cancel request
outstanding past the declared bound raises rather than waits indefinitely.

## Alternatives considered

| Alternative | Why rejected |
| ----------- | ------------ |
| Cancel as a synchronous command | Cannot be honoured across a process or device boundary; the API would claim a completion it cannot observe |
| Cooperative token only | Works in-process, but has no answer for a worker that has hung or partitioned — and no terminal-write fence |
| Last-writer-wins on terminal state | Precisely the resurrection bug: a partitioned worker overwrites a completed run |
| Defer ownership until federation | The retrofit was the expensive part in both reference projects; the field is free now |

## Consequences

**Easier:** cancellation semantics are honest — callers can distinguish "recorded" from "done".
Terminal state has exactly one writer. Federation later needs no schema change.

**Harder:** every terminal write goes through an ownership check. The heartbeat period becomes a
published contract rather than an implementation detail.

**Foreclosed:** a cancel API that claims completion synchronously. Unfenced terminal writes.

## Revisit trigger

Reopen when the first genuinely remote executor exists — the lease/heartbeat parameters are
specified here as a shape, not as tuned values, and real network conditions will set them.

## Evidence

- **FACT** — OpenHands v1 uses a cooperative cancellation token and has no `CANCELLED` status at
  all, which is one coherent design point: cancellation as a cooperative in-process concern.
  <https://github.com/OpenHands/software-agent-sdk>
- **INFERENCE** — That design does not extend across a process boundary, which the surrounding
  architecture anticipates. Where the executor is remote, "record a request and let the executor
  observe it" is the only implementable shape.
- **INFERENCE** — The resurrection failure (a partitioned worker overwriting a terminal state) is
  a standard lease/fencing problem, and fencing tokens are the standard answer; nothing here is
  novel, which is an argument for adopting rather than inventing.
- **UNKNOWN** — Heartbeat and lease periods. Deliberately unset; they are deployment-dependent and
  guessing them would give the bound false precision.
