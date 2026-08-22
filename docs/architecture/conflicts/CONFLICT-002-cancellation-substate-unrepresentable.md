# CONFLICT-002 — Two state machines, only one enumerated

**Tags:** `SCHEMA-AFFECTING` `BLOCKING`
**Affected ADR:** ADR-007 (State Machine), ADR-057 (Cancellation)

## Current Decision

ADR-007 enumerates the run lifecycle as twelve phases:

```
CREATED PLANNED AUTHORIZED RUNNING WAITING STEERED
PAUSED RECOVERING VERIFYING COMPLETED FAILED CANCELLED
```

ADR-057 separately requires that cancellation be "explicit and stateful":

```
REQUEST_CANCEL -> AUTHORIZED -> STOPPING -> CANCELLED
```

## Observed Design

These are two different state machines that terminate in the same state, and only one of them is
enumerated in the phase list.

- `STOPPING` does not appear in ADR-007's phases.
- `REQUEST_CANCEL` does not appear in ADR-007's phases.
- `AUTHORIZED` appears in **both**, meaning two unrelated things: "the run's plan was authorized
  to begin" (ADR-007) and "the cancellation request was authorized" (ADR-057).
- `CANCELLED` appears in both, meaning the same thing.

## Contradiction

A run that is executing a capability when cancellation is authorized is simultaneously `RUNNING`
and `STOPPING`. With a single flat phase enum, that state is unrepresentable. The implementer is
forced into one of three bad choices, none sanctioned by the ADRs:

1. Transition to a `STOPPING` phase that ADR-007 does not define — silently extending a locked
   enum.
2. Stay `RUNNING` and track stopping out-of-band — reintroducing the hidden state ADR-007 exists
   to eliminate, and making the cancellation invisible to the fold.
3. Jump straight to `CANCELLED` while a capability is still in flight — losing the in-flight
   operation and violating ADR-057's requirement that cancellation be *stateful*.

The `AUTHORIZED` collision is independently a defect: a phase name that means two different
things cannot be reasoned about in a transition table, and cannot be asserted in a test without
ambiguity.

## Security / Reliability / Compatibility Impact

**Security — low.**

**Reliability — high.** Option 2 above is the path of least resistance and is what an implementer
will reach for under time pressure. It produces exactly the failure ADR-057 was written to
prevent: a cancel that appears to have been accepted but never takes effect, because the stopping
state is not part of the folded run state and therefore does not survive a restart.

**Compatibility — high.** The phase enum is serialized into every checkpoint and every state
snapshot. Changing its cardinality or semantics later is a migration.

## Affected Schemas

- `RunState` — gains a second, orthogonal field if resolved as recommended
- The run phase enum itself
- Every checkpoint and state snapshot containing a phase

## Affected APIs / ABIs

- The public transition table / `can_transition` predicate
- Any external API exposing run status

## Affected Tests

- The ADR-007 transition-table conformance test cannot be written, because the table's membership
  is disputed between two ADRs.
- `cancel_while_running_is_stateful` cannot be written.
- `cancel_survives_process_restart` cannot be written under option 2.

## Downstream Dependencies

Phase 5 (collaboration: teams, delegation, handoffs) inherits this directly — a handoff to a
cancelled-but-still-stopping run has no defined semantics. Phase 8 (product UI) surfaces run
status to users and needs an unambiguous state to display.

## Evidence

- **FACT** — OpenHands models cancellation-adjacent lifecycle in its own status enum and, in its
  v1 rewrite, has no `CANCELLED` status at all: cancellation is cooperative via a cancellation
  token, with `PAUSED` as the escape hatch.
  <https://github.com/OpenHands/software-agent-sdk>
- **FACT** — DeerFlow names its terminal state `interrupted` rather than `cancelled`, and tracks
  `timeout` separately. <https://github.com/bytedance/deer-flow/releases>
- **INFERENCE** — Neither reference project runs a flat enum containing both lifecycle and
  cancellation-progress states, which is weak corroboration that the two concerns want separate
  representations.

## Recommended Resolution

Model cancellation as an **orthogonal region**, the standard statechart treatment. Proposed, not
locked — see [`../../adr/amendments/AMD-002-cancellation-orthogonal-region.md`](../../adr/amendments/AMD-002-cancellation-orthogonal-region.md).

```
RunState {
    phase:  RunPhase,      // the ADR-007 lifecycle
    cancel: CancelState,   // the ADR-057 sub-machine
}

CancelState = None | Requested | Authorized | Stopping | Done
```

The run's `phase` moves to `CANCELLED` only when the cancel region reaches `Done`. This satisfies
both ADRs literally: ADR-007's phase list is unchanged, ADR-057's four steps are all
representable, and "RUNNING and also STOPPING" is expressible as `{ phase: Running, cancel:
Stopping }`.

Rename ADR-057's second step to `CancelAuthorized` to remove the collision with ADR-007's
`AUTHORIZED` phase.

## Alternatives Considered

- **Add `STOPPING` to `RunPhase`.** Rejected: deviates from a locked enumeration, and still
  cannot express the *combination* of a lifecycle phase with cancellation progress — it only
  moves the problem, since a run stopping out of `VERIFYING` differs from one stopping out of
  `WAITING`.
- **Flatten into a cross-product.** 12 phases × 5 cancel states = 60 states. Rejected as
  unmaintainable and untestable; the transition table becomes 3,600 entries.
- **Track cancellation outside the state machine.** Rejected: this is precisely the hidden state
  ADR-082 forbids, and it does not survive a fold.

## Migration Required

**Yes if deferred.** `RunState` is serialized in every snapshot. Adding a field later is a
schema-version bump; doing it now is free.

## Blocks Implementation

**Yes.** `RunState` is the central type of the M0 kernel. Its shape cannot be deferred.
