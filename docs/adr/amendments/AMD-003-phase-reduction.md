---
type: Architecture Decision
title: Phase Reduction
description: A phase is retained only where an event exists that is uninterpretable in any other phase; decorative phases become events.
generated:
  by: process:claude-code-session
  at: 2026-08-22T00:00:00Z
status: draft
---

# AMD-003 — A phase must earn its place

Resolves [CONFLICT-003](../../architecture/conflicts/CONFLICT-003-phase-list-over-modelled.md).
**Requires [AMD-002](AMD-002-cancellation-orthogonal-region.md)** — decide what a phase *is* before deciding which to remove.

| Field      | Value |
| ---------- | ----- |
| Phase      | P00   |
| Supersedes | —     |

## Context

The run machine enumerates twelve phases. Its own stated purpose is that every transition be
observable and testable — but phases that exist only to be logged make the transition table larger
without making any behaviour assertable. A 12 × 12 table has 144 cells, most illegal, and no test
can meaningfully cover a state entered and left within a single step.

This is not a contradiction between two decisions; it is a contradiction between a decision and
the evidence that motivates it.

## Decision

**Retain a phase only where an event exists that is uninterpretable in any other phase.**
Everything else becomes an event, which is where "it happened" belongs.

- **Demote `PLANNED` and `AUTHORIZED` to events.** A run with a plan is a run whose log contains a
  plan event. Neither changes what the run may do next.
- **Demote `STEERED` to a `SteeringApplied` event** with no phase change.
- **Keep `RECOVERING` only if recovery is a distinct control flow.** If recovery is "run again with
  a retry counter", fold it into `RUNNING` and put the counter in the log.
- **Adopt a typed terminal reason.** `FAILED` carries a reason enum, not a bare flag — the
  distinction between exhausting a turn limit and exhausting a budget is one callers act on
  differently.
- **Consider adding `STUCK`** — the one state a reference rewrite found it needed and did not have.

This is a **reduction**, so it must be decided before the enum is serialized anywhere. Removing a
variant after runs exist is a migration; adding one is not. The asymmetry is the whole reason this
is `BLOCKING` despite looking like tidying.

## Adversarial review

**Attack:** "uninterpretable in any other phase" is a criterion that can be argued either way for
almost any phase, so this amendment authorizes a judgement call and calls it a rule. Different
reviewers will reduce to different sets.

**Failure modes:** a phase is demoted, and six months later a legitimate transition guard needs it
back — costing the migration this amendment was meant to avoid. Or the reduction stops halfway
and the enum ends up neither minimal nor complete, which is worse than either.

**Falsifying experiment:** the criterion is more testable than it looks. For each candidate phase,
attempt to write a transition guard that reads it and rejects an event *that no other phase would
reject*. If no such guard can be written, the phase carries no behaviour and demotion is safe.
Run that test per phase and the judgement becomes mechanical. `STUCK` is the interesting case:
it earns its place only if something *acts* on it, so if no guard reads it, it is an event too.

## Alternatives considered

| Alternative | Why rejected |
| ----------- | ------------ |
| Keep all twelve | A 144-cell table nobody can cover; states entered and left in one step cannot be asserted |
| Reduce to a minimal three (`Running`/`Done`/`Failed`) | Loses genuine control-flow distinctions, and pushes real branching into ad-hoc flags — the hidden state problem again |
| Defer until usage shows which are needed | Removal after serialization is a migration; deferral chooses the expensive direction |
| Keep the phases, drop the transition table | The table is what makes transitions testable; dropping it abandons the original purpose entirely |

## Consequences

**Easier:** a smaller transition table that can actually be covered. The product state space from
AMD-002 shrinks proportionally.

**Harder:** consumers that switched on `PLANNED` or `STEERED` must read the log instead. Some
information moves from a field to a query.

**Foreclosed:** phases as a logging mechanism.

## Revisit trigger

Reopen when a transition guard is needed that cannot be written against the reduced set — that is
the concrete, observable signal that the reduction went one phase too far, and it is cheap to
detect because the guard simply cannot be expressed.

## Evidence

- **FACT** — OpenHands' agent state model and its later conversation-execution status are a
  worked example of a comparable phase set being reorganized under production pressure, including
  the addition of a stuck-detection concept.
  <https://github.com/OpenHands/software-agent-sdk>
- **INFERENCE** — A state entered and left within a single step has no observable extent, so no
  test can distinguish a system that enters it from one that does not. Such a state is a log line
  wearing a state's clothes.
- **UNKNOWN** — Whether `RECOVERING` is a distinct control flow in this architecture. The decision
  above is conditional on that answer, which has not been established, and it is the one item here
  that cannot be settled by the guard test alone.
