# CONFLICT-012 — Log linearity forecloses fork and rewind

**Tags:** `SCHEMA-AFFECTING`
**Affected ADR:** `UNVERIFIED` — cited ADR-008 (Event Sourcing) and ADR-009 (Checkpointing); neither exists in this repository. Related but not equivalent: [ADR-0010](../../../ADR/0010-durability-checkpoint-boundary.md) supplies the `CheckpointStore` contract any rewind would resume from. This conflict's premise is restated below on its own terms. See the [provenance note](README.md#citation-provenance)

## Current Decision

The event log is append-only and **linear**: events carry a monotonically increasing sequence
number, and run state is the fold of every event from the beginning to the head. One run, one
sequence, one history.

## Observed Design

Three capabilities the architecture separately expects all require the *same* structural thing,
which linearity does not provide:

1. **Rewind.** "Undo the last three steps and try differently" — the operator moves the run's
   head backwards and proceeds along a different path.
2. **Fork.** Speculative execution, subagent branching, or an A/B comparison of two plans from a
   shared prefix.
3. **Steering after the fact.** [CONFLICT-003](CONFLICT-003-phase-list-over-modelled.md) demotes
   `STEERED` to an event; if steering can retroactively invalidate work already done, the
   invalidated events must go somewhere other than "deleted".

Each needs a history where more than one successor of a given event can exist — a tree, or more
generally a DAG.

## Contradiction

A strictly linear sequence has exactly one successor per position, so rewind can only be
implemented by one of three moves, none of which the architecture permits:

1. **Truncate the log.** Destroys the audit trail, and directly contradicts append-only.
2. **Append compensating events.** Works for semantically reversible operations only. An
   `IRREVERSIBLE` effect class exists precisely because some operations have no compensation, so
   this cannot be the general mechanism.
3. **Copy the prefix into a new run.** Loses the relationship between the two histories; the fork
   point becomes invisible, and the two runs look unrelated to any consumer.

The deeper issue is that **the sequence number is doing two jobs**: it orders events, and it
identifies them. In a tree those separate — a node's identity is its position in the DAG, while
ordering is only meaningful along a single path from the root. Any later attempt to add
branching therefore changes the meaning of the field every persisted event already carries.

## Security / Reliability / Compatibility Impact

**Security — low.** No enforcement boundary is involved. One caveat: if fork is later added
without care, an operator could fork past an `APPROVAL` event and inherit the approval on a
branch the approver never saw. That is a real escalation path, and it is created by *retrofitting*
branching rather than by branching itself.

**Reliability — moderate.** Without a sanctioned rewind, operators will reach for log truncation,
which is the destructive option.

**Compatibility — high.** The sequence number is on every persisted event. Reinterpreting it after
runs exist is a migration over the entire log.

## Affected Schemas

- The event envelope: gains a parent reference (`parent_id`) alongside, or instead of, a bare
  sequence number
- The run record: gains a head pointer, since "the head" is no longer simply "the last event"
- Checkpoint records: must identify *which* branch they checkpoint

## Affected APIs / ABIs

- The fold entry point — takes a path or head identifier, not merely "the log"
- Any store interface that enumerates events, which must now enumerate along a path

## Affected Tests

- fold along a branch ignores events on sibling branches
- forking twice from one parent yields two independent heads
- a checkpoint on one branch does not resume another
- (deferred with fork itself) approval does not transit a fork point

## Downstream Dependencies

Subagents, speculative planning, and any "try again differently" operator affordance. The
`llm_response_id` grouping reserved in [CONFLICT-010](CONFLICT-010-action-correlation-needs-two-ids.md)
is a natural fork granularity, which is why the two should be decided in the same pass.

## Evidence

- **FACT** — Event sourcing's defining constraint is that events are append-only, never updated
  or deleted, with current state computed by replay.
  <https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing>
- **FACT** — Git is a widely-cited existence proof that an append-only, content-addressed history
  can be a DAG rather than a line, with branching and merging as first-class operations, and that
  the resulting model remains auditable.
  <https://dev.to/devcorner/git-as-an-event-sourced-system-understanding-event-sourcing-through-git-271p>
- **INFERENCE** — Reserving a nullable `parent_id` now is close to free: for a linear log every
  event's parent is its predecessor, so the field is derivable and adds one reference per event.
  Adding it later is a whole-log migration. The asymmetry is the entire argument for deciding now.
- **UNKNOWN** — Whether fork is actually wanted in the product, or only rewind. They have
  different costs: rewind alone can be served by a head pointer over a linear log, whereas fork
  requires the tree. This is the question that decides the resolution below, and it has not
  been answered.

## Recommended Resolution

**Reserve the shape; do not build the feature.** Proposed, not locked.

1. **Add `parent_id` to the event envelope now**, as a nullable reference. In M0 it always points
   at the immediate predecessor, so behaviour is unchanged and the linear fold still works.
2. **Give the run an explicit `head` pointer** rather than deriving the head as "max sequence".
3. **Keep the sequence number, but demote it to ordering-along-a-path**, documented as such, so
   nothing comes to depend on it being a global identity.
4. **Do not implement fork or rewind in M0.** No branching API, no UI, no tests beyond the fold's
   indifference to the new field.
5. **Log compaction folds in here rather than being deferred separately** — compaction over a tree
   is a different operation than over a line (it must preserve fork points), so the two decisions
   share a resolution and should not be taken apart.

This is the cheapest available insurance: one nullable field and one pointer, against a
whole-log migration.

## Alternatives Considered

- **Commit to linearity permanently.** Rejected: it forecloses subagent branching and speculative
  execution, both of which the surrounding architecture anticipates, and the register's own
  purpose is to avoid foreclosing schema decisions by accident.
- **Build the full DAG in M0.** Rejected: it is a large amount of machinery serving no M0 proof,
  and the `UNKNOWN` above means it might be built for a requirement that does not exist.
- **Fork by copying the prefix into a new run.** Rejected: loses the fork relationship, so the
  audit trail cannot answer "where did these two histories diverge" — the main question anyone
  forking wants answered.

## Migration Required

**Yes if deferred.** `parent_id` lands on every persisted event. Adding it after runs exist means
back-filling the entire log and bumping the envelope schema version.

## Blocks Implementation

**No** — tagged `SCHEMA-AFFECTING` rather than `BLOCKING`. The kernel can be built on a linear
fold. But the *field reservation* must happen before the event envelope is serialized anywhere,
which in practice means before the first M0 event is written.
