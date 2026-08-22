# CONFLICT-003 — The 12-phase run machine is over-modelled

**Tags:** `SCHEMA-AFFECTING` `BLOCKING`
**Affected ADR:** `UNVERIFIED` — cited ADR-007 (State Machine); does not exist in this repository. This conflict's premise is restated below on its own terms. See the [provenance note](README.md#citation-provenance)

## Current Decision

ADR-007 enumerates twelve run phases and requires that every transition be timestamped,
identified, authorized, observable and replayable:

```
CREATED PLANNED AUTHORIZED RUNNING WAITING STEERED
PAUSED RECOVERING VERIFYING COMPLETED FAILED CANCELLED
```

## Observed Design

A phase earns its place only if there is some event whose meaning cannot be determined without
it — that is, if the phase carries information not already recoverable from the event log. Several
of the twelve do not meet that bar:

- **`PLANNED`** — a run that has produced a plan is distinguishable by the presence of a
  plan-generated event. The phase adds nothing the log does not already say.
- **`AUTHORIZED`** — same, and it additionally collides with ADR-057's cancel-authorized step
  (see [CONFLICT-002](CONFLICT-002-cancellation-substate-unrepresentable.md)).
- **`STEERED`** — reads as an event, not a resting state. If it is a state, every exit edge must
  be defined, including what happens when steering arrives during `VERIFYING` or `WAITING`. In
  practice steering is applied *to* a running run and the run continues running.
- **`RECOVERING`** — plausible, but only if recovery is a distinct control flow rather than a
  retry policy applied within `RUNNING`.

## Contradiction

This is not a contradiction between two ADRs but between ADR-007 and the operational evidence
that motivates it. ADR-007's own stated purpose is that every transition be *observable* and
*testable*. Phases that exist only to be logged make the transition table larger without making
any behaviour assertable, which works against that purpose: a 12×12 table has 144 cells, most of
them illegal, and no test can meaningfully cover a state that is entered and left in the same
step.

## Security / Reliability / Compatibility Impact

**Security — none.**

**Reliability — moderate.** Over-modelled lifecycles concentrate complexity in the controller.
The reference project below documents its own controller growing unmanageable under exactly this
pressure.

**Compatibility — high.** The phase enum is serialized in every checkpoint. Removing a phase
after runs exist is a migration; removing one now is free.

## Affected Schemas

- The run phase enum
- Every checkpoint and state snapshot

## Affected APIs / ABIs

- The transition table and `can_transition` predicate
- Any external run-status API

## Affected Tests

- `all_phases_reachable_from_created` — currently would fail or require synthetic transitions for
  decorative phases.
- `terminal_states_have_no_outgoing_edges`
- The ADR-007 conformance test asserting the exact table.

## Downstream Dependencies

Phase 8 (product UI) renders run status; ADR-062's attention dashboard asks "what is working /
finished / failed / needs me", which maps onto roughly four states, not twelve.

## Evidence

This is the register's best-evidenced conflict, because a directly comparable project ran the
experiment.

- **FACT** — OpenHands v0 shipped a 12-member `AgentState`: `LOADING, RUNNING,
  AWAITING_USER_INPUT, PAUSED, STOPPED, FINISHED, REJECTED, ERROR, AWAITING_USER_CONFIRMATION,
  USER_CONFIRMED, USER_REJECTED, RATE_LIMITED`.
  <https://github.com/OpenHands/OpenHands> (`openhands/core/schema/agent.py`, tag 0.30.0)
- **FACT** — OpenHands v1, a ground-up rewrite with full hindsight, reduced this to a 7-member
  `ConversationExecutionStatus`: `IDLE, RUNNING, PAUSED, WAITING_FOR_CONFIRMATION, FINISHED,
  ERROR, STUCK`. Dropped: `LOADING`, `STOPPED`, `REJECTED`, `RATE_LIMITED`. The three-state
  confirmation dance (`AWAITING_USER_CONFIRMATION` / `USER_CONFIRMED` / `USER_REJECTED`) was
  collapsed into a single waiting state plus a `UserRejectObservation` **event**.
  <https://arxiv.org/html/2511.03690v1>
- **FACT** — `STUCK` is the one state that rewrite *added*.
- **FACT** — OpenHands filed an issue on its own controller having grown to roughly 1,400 lines
  and "doing a lot of things." <https://github.com/All-Hands-AI/OpenHands/issues/8111>
- **FACT** — The Claude Agent SDK models lifecycle through *message subtypes* rather than states,
  with typed terminal reasons: `error_max_turns`, `error_max_budget_usd`,
  `error_during_execution`, `error_max_structured_output_retries`.
  <https://code.claude.com/docs/en/agent-sdk/agent-loop>
- **FACT** — The OpenAI Agents SDK runs an implicit loop with approvals modelled as "paused runs,
  not as new turns." <https://developers.openai.com/api/docs/guides/agents/running-agents>
- **INFERENCE** — Across all reviewed systems, the load-bearing states converge on: idle/ready,
  running, awaiting-approval, paused, and a typed terminal outcome. No reviewed system models
  twelve.

## Recommended Resolution

Retain a phase only where an event exists that is uninterpretable in any other phase. Proposed,
not locked — see [`../../adr/amendments/AMD-003-phase-reduction.md`](../../adr/amendments/AMD-003-phase-reduction.md).

Specifically:

- **Demote `PLANNED` and `AUTHORIZED`** to events. A run with a plan is one whose log contains a
  plan event.
- **Demote `STEERED`** to a `SteeringApplied` event with no phase change.
- **Keep `RECOVERING`** only if recovery is a distinct control flow; otherwise fold into `RUNNING`
  with a retry counter in the log.
- **Adopt a typed terminal reason.** `FAILED` carries a reason enum, not a bare flag — directly
  copying the `error_max_turns` / `error_max_budget_usd` distinction.
- **Consider adding `STUCK`**, the one state the reference rewrite found it needed.

This is a *reduction*, so it must be decided before the enum is serialized anywhere.

## Alternatives Considered

- **Keep all twelve.** Rejected on the evidence above; the one directly comparable project
  removed five of its twelve when given the chance, and none of the five it kept are ones we
  would drop.
- **Reduce to exactly OpenHands' seven.** Rejected as cargo-culting: their states serve a
  conversation-centric product. Ours must serve a deterministic substrate, where `VERIFYING` is
  genuinely load-bearing (see [CONFLICT-004](CONFLICT-004-replay-is-two-operations.md)) even
  though they have no equivalent.
- **Defer until the harness exists.** Rejected: the enum is serialized from the first checkpoint,
  so deferral converts a free decision into a migration.

## Migration Required

**Yes if deferred.** Removing a serialized enum variant after runs exist requires a fold that
tolerates the old shape.

## Blocks Implementation

**Yes.** The phase enum and its transition table are the first thing the state crate defines.
