# CONFLICT-011 — Cancellation is modelled as a command but behaves as a request

**Tags:** `SCHEMA-AFFECTING` `BLOCKING`
**Affected ADR:** ADR-057 (Cancellation), ADR-088 (Heartbeats), ADR-089 (Dead Worker Recovery), ADR-056 (Ownership)

## Current Decision

ADR-057 requires that cancellation be explicit and stateful:

```
REQUEST_CANCEL -> AUTHORIZED -> STOPPING -> CANCELLED
```

and warns against treating a disappeared HTTP request as equivalent to a cancelled task.

## Observed Design

The four-state sequence is correct as far as it goes, but it describes only the *shape* of the
transition. It leaves three mechanics undefined, each of which is load-bearing:

1. **Who may authorize?** The party requesting cancellation is frequently not the party executing
   the run.
2. **How does the executor learn of it?** Nothing pushes the request into a busy executor.
3. **What prevents a stale executor from overwriting a terminal state?**

## Contradiction

ADR-057 is written as though `REQUEST_CANCEL → AUTHORIZED` is a transition the canceller performs.
For a run executing inside another worker, process or device — which ADR-076 (Device Federation)
explicitly anticipates — it is not. The canceller can only *record a request*; the executor
observes it and acts.

Read as a command, the ADR yields an implementation where cancel appears to succeed and silently
does nothing, which is precisely the failure mode the ADR's own text warns against. The ADR
diagnoses the disease and then prescribes a state list that does not prevent it.

Three specific gaps follow:

- **No single-winner rule.** Two concurrent cancel requests (or a cancel racing a timeout) can
  both believe they won, producing two terminal writes.
- **Unbounded, unspecified latency on `AUTHORIZED → STOPPING`.** If the executor discovers the
  request on a heartbeat or lease tick, that edge takes up to one tick. The ADR presents it as
  instantaneous.
- **No ownership fence.** A worker that lost its lease — because it hung, or was partitioned —
  can wake and write a terminal status over a run another worker already finished, resurrecting a
  dead run.

## Security / Reliability / Compatibility Impact

**Security — moderate.** Cancellation is the mechanism by which a human stops an agent that is
misbehaving (ADR-029 TAKE CONTROL, ADR-063 Computer Takeover). A cancel that silently no-ops is a
safety-relevant failure, not merely an availability one.

**Reliability — high.** Terminal-state overwrites by stale executors corrupt run history and are
extremely difficult to diagnose after the fact.

**Compatibility — high.** Ownership identity, once absent from the schema, is expensive to add.

## Affected Schemas

- Cancellation events (request, authorization, completion)
- `RunState` — gains an owner identity and lease/heartbeat fields
- The run record's terminal status write path

## Affected APIs / ABIs

- The cancellation API's return type: cancel must be able to report *requested* as distinct from
  *cancelled*
- The heartbeat/lease contract

## Affected Tests

- `two_concurrent_cancels_produce_exactly_one_authorization`
- `stale_owner_cannot_overwrite_terminal_state`
- `cancel_request_survives_process_restart`
- `cancel_latency_is_bounded_by_the_lease_period`

## Downstream Dependencies

ADR-088 (heartbeats), ADR-089 (dead worker recovery) and ADR-076 (device federation) all depend
on the ownership model this establishes. ADR-024's ephemeral Workers each need an owner.

## Evidence

This conflict is drawn almost entirely from a project that hit it in production and rewrote for it.

- **FACT** — DeerFlow 2.0.0 ships as a breaking change: "Cancellation now requires the worker who
  owns the run; cross-worker cancels return `409`" and "runs now hydrate from `RunStore` and
  persist `interrupted` status." <https://github.com/bytedance/deer-flow/releases>
- **FACT** — Its mechanism: `cancel()` checks local ownership first; for a remote run it evaluates
  lease expiry, and if the owner's lease is valid it **persists the cancel request** via the store
  (store-side atomicity ensuring exactly one action wins across competing workers) and returns a
  *requested* outcome. The owner picks the request up during lease renewal and sets a local abort
  flag *without* immediately persisting status. The terminal write is guarded so that a worker
  which has lost ownership returns early rather than writing.
  <https://github.com/bytedance/deer-flow/blob/main/backend/AGENTS.md>
- **FACT** — The same ownership problem recurs one level down for subagents, where a server-minted
  `execution_id` is the cancellation key — see
  [CONFLICT-010](CONFLICT-010-action-correlation-needs-two-ids.md).
- **FACT** — OpenHands v1 by contrast implements cooperative cancellation only, via a per-session
  cancellation token, and has no `CANCELLED` status at all.
  <https://github.com/OpenHands/software-agent-sdk>
- **INFERENCE** — The divergence is explained by scope: OpenHands v1 is single-owner in-process,
  DeerFlow is multi-worker. Our ADR-076 puts us in DeerFlow's regime eventually, so we should
  adopt the ownership key early even while M0 is single-process.

## Recommended Resolution

Model cancel as a durable request with an owner. Proposed, not locked — see
[`../../adr/amendments/AMD-011-cancellation-ownership.md`](../../adr/amendments/AMD-011-cancellation-ownership.md).

1. **Cancel is a request.** The API returns *requested* or *cancelled* as distinct outcomes; it
   never claims completion it cannot observe.
2. **The request is durably persisted and atomically single-winner.** Exactly one cancel action
   wins among concurrent requests; the others observe the winner.
3. **The executor discovers it on its own tick.** The `CancelAuthorized → Stopping` edge carries a
   latency bounded by the heartbeat/lease period, and that bound is **specified**, not left
   implicit.
4. **Terminal writes are ownership-fenced.** A worker that has lost ownership must not write a
   terminal state.
5. **Mint run-owner identity in M0**, even though M0 is single-process. Retrofitting an ownership
   key was the expensive part of this change for both reference projects; adding the field now is
   free.

## Alternatives Considered

- **Cooperative token only, as OpenHands v1.** Rejected as the *final* design because ADR-076
  requires cross-device operation. Acceptable as the M0 *mechanism*, provided the ownership field
  and the request/authorize events exist in the schema from the start.
- **Cancel as a synchronous command.** Rejected: unimplementable across processes, and it is the
  failure ADR-057's own text warns against.
- **Defer ownership until multi-worker.** Rejected on direct evidence: both reference projects
  found this the costly path.

## Migration Required

**Yes if deferred.** Owner identity and lease fields live in the persisted run record.

## Blocks Implementation

**Yes.** `RunState` and the cancellation event payloads are M0 kernel types.
