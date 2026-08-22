---
type: Architecture Decision
title: Cancellation as an Orthogonal Region
description: Run state is a phase plus an independent cancel sub-machine, so "running and also stopping" is representable.
generated:
  by: process:claude-code-session
  at: 2026-08-22T00:00:00Z
status: draft
---

# AMD-002 — Cancellation is an orthogonal region, not a phase

Resolves [CONFLICT-002](../../architecture/conflicts/CONFLICT-002-cancellation-substate-unrepresentable.md).

| Field      | Value |
| ---------- | ----- |
| Phase      | P00   |
| Supersedes | —     |

## Context

A run executing a capability when cancellation is authorized is simultaneously `RUNNING` and
`STOPPING`. With a single flat phase enum, that state is **unrepresentable**, and the implementer
is forced into one of three unsanctioned choices: invent a `STOPPING` phase (silently extending a
locked enum), stay `RUNNING` and track stopping out-of-band (reintroducing exactly the hidden
state the phase enum exists to eliminate, and making cancellation invisible to the fold), or jump
to `CANCELLED` with a capability still in flight (losing the in-flight operation).

Separately, `AUTHORIZED` names two different things — a run-lifecycle phase and a cancellation
step. A name meaning two things cannot be reasoned about in a transition table or asserted in a
test without ambiguity.

## Decision

Model cancellation as an **orthogonal region** — the standard statechart treatment for concurrent,
independent state.

```
RunState {
    phase:  RunPhase,      // the run lifecycle
    cancel: CancelState,   // the cancellation sub-machine
}

CancelState = None | Requested | Authorized | Stopping | Done
```

The run's `phase` moves to `CANCELLED` only when the cancel region reaches `Done`.

This satisfies both original decisions literally: the phase list is unchanged, all four
cancellation steps are representable, and "RUNNING and also STOPPING" is expressible as
`{ phase: Running, cancel: Stopping }`.

**Rename the cancellation step to `CancelAuthorized`** to remove the collision with the lifecycle
phase `AUTHORIZED`.

Both regions are folded from the log. Neither is tracked out-of-band — that is the property this
amendment exists to preserve, and it is what distinguishes an orthogonal region from "just keep a
flag next to it".

## Adversarial review

**Attack:** a product of two enums is a larger state space than one, and most combinations are
meaningless. `{ phase: Completed, cancel: Stopping }` is nonsense, and nothing here forbids it —
the amendment trades an *unrepresentable* legal state for a crop of *representable* illegal ones.

**Failure modes:** illegal combinations occur and no test catches them, because the test matrix
now has 12 × 5 cells and nobody enumerates it. A run reports `Completed` while its cancel region
still says `Stopping`, and downstream consumers disagree about whether it finished.

**Falsifying experiment:** enumerate the product exhaustively — 60 cells is small enough to
enumerate in a test — and assert that each is either reachable or explicitly rejected by a
validity predicate. If no such predicate exists, this amendment has moved the problem rather than
solved it. Writing that predicate is a required part of accepting this decision, not a follow-up.

Note that [AMD-003](AMD-003-phase-reduction.md) shrinks `RunPhase`, which shrinks this product
too — another reason the two must be decided in that order.

## Alternatives considered

| Alternative | Why rejected |
| ----------- | ------------ |
| Add `STOPPING` to the phase enum | Silently extends a locked enum, and does not generalize: the next concurrent concern needs another phase, and the enum becomes a product encoded as a sum |
| Track stopping out-of-band | Reintroduces hidden state; cancellation becomes invisible to the fold, breaking replay |
| Jump straight to `CANCELLED` | Loses the in-flight operation and makes cancellation non-stateful, which is the thing being fixed |
| Model the full product as one flat enum | 60 explicit variants, most illegal; unmaintainable and no better tested |

## Consequences

**Easier:** cancellation is representable, foldable, and testable. Adding a future concurrent
concern (pause, quota exhaustion) follows the same pattern rather than growing the phase enum.

**Harder:** the state space is a product, so validity needs an explicit predicate rather than
being implied by the type.

**Foreclosed:** out-of-band cancellation tracking. Reusing `AUTHORIZED` for two meanings.

## Revisit trigger

Reopen when a third orthogonal region is proposed. Two regions are a pair of fields; three or more
is a statechart, and at that point the machinery deserves a proper representation rather than
another field.

## Evidence

- **FACT** — Orthogonal regions are the standard statechart construct for concurrent independent
  state, dating to Harel's statecharts and carried into UML state machines.
- **FACT** — OpenHands distinguishes an agent-level state from a conversation-level execution
  status, which is the same separation-of-concerns applied to a comparable problem.
  <https://github.com/OpenHands/software-agent-sdk>
- **INFERENCE** — The forced-choice analysis above shows a flat enum admits no correct
  implementation, so this is not a preference between two workable designs.
- **UNKNOWN** — Whether a validity predicate over the product can be expressed as data (a table)
  or needs code. Affects how the exhaustive test is written, not whether the decision is right.
