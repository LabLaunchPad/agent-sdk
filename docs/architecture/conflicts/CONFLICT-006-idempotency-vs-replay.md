# CONFLICT-006 — Idempotency keys defeat their own purpose under replay

**Tags:** `SCHEMA-AFFECTING` `BLOCKING`
**Affected ADR:** [ADR-0011](../../../ADR/0011-unknown-outcome-side-effect-state.md) (Unknown-Outcome Side-Effect State) — remapped from ADR-047 (Idempotency) and ADR-049 (Failure Recovery); its requirement that *"every side-effect-capable capability must expose an operation identity stable enough to support reconciliation"* is precisely the key-derivation requirement at issue. `UNVERIFIED` for ADR-008 (Event Sourcing). See the [provenance note](README.md#citation-provenance)

## Current Decision

ADR-047 requires that every external side-effecting operation define an idempotency key, naming
`send_email`, `create_issue`, `publish_post`, `charge_payment`, `deploy` and `delete` as examples,
so that "retries must not accidentally duplicate irreversible actions."

The ADR does not specify how the key is derived.

## Observed Design

The key must be **stable across the exact scenarios in which it is needed**: a crash mid-operation
followed by a resume, and a retry after a transient failure. Both scenarios reconstruct run state
from the event log.

## Contradiction

The natural implementation — generate a random UUID/ULID per operation — is *silently wrong*:

1. Run reaches the point of charging a payment. Generates key `K₁`. Dispatches.
2. Process dies after the provider received the request but before the completion event is
   appended.
3. Run resumes by folding the log. The operation is re-attempted. A fresh random key `K₂` is
   generated.
4. The provider sees `K₂ ≠ K₁`, treats it as a new request, and **charges twice.**

This is precisely the failure ADR-047 exists to prevent, reached by the most obvious reading of
it. The ADR's requirement and its likely implementation are in direct conflict.

Recording the key in the log before dispatch fixes step 3 only if the key was appended *before*
the crash — which reduces to requiring a durable write per key, and still fails when the crash
lands between key generation and its append.

A second, subtler trap: deriving the key from the event sequence number. A retry that occurs
after any intervening event lands at a different sequence number and therefore produces a
different key, again defeating deduplication.

## Security / Reliability / Compatibility Impact

**Security — moderate.** Duplicated irreversible operations (payments, deletions, deployments)
are a financial and data-integrity risk, not merely a correctness bug.

**Reliability — high.** The failure only manifests under crash-resume and retry, which are the
paths least covered by ordinary testing and most exercised in production.

**Compatibility — high.** The key is part of the capability-request payload and is persisted.

## Affected Schemas

- The capability request payload (the idempotency key field and its derivation)
- Any event recording a dispatch

## Affected APIs / ABIs

- The capability invocation contract, including the plugin ABI: a plugin receiving a request must
  see the same key on a retry.

## Affected Tests

- `crash_after_dispatch_resumes_with_identical_idempotency_key`
- `retry_after_transient_failure_reuses_key`
- `retry_with_changed_arguments_produces_a_different_key`
- `strict_replay_reproduces_every_key_exactly`

## Downstream Dependencies

ADR-048 (Transaction Boundary) classifies operations as `EXTERNAL_SIDE_EFFECT` and
`IRREVERSIBLE`; those are exactly the classes requiring keys. ADR-074 (Sync) merges logs across
devices and needs keys stable across machines, not merely across processes.

## Evidence

- **FACT** — The OpenAI Agents SDK documents that its single-delivery property is an SDK-level
  guarantee and not a provider-delivery guarantee: `RetryDecision(approve_unsafe_replay=True)` can
  resend input that may already have reached the provider, so provider-side work can repeat.
  <https://openai.github.io/openai-agents-python/ref/run_state/>
- **INFERENCE** — That flag exists because the boundary is real and cannot be papered over at the
  SDK layer. A content-derived key is the standard mitigation on the client side of exactly this
  boundary.
- **UNKNOWN** — No reviewed agent runtime implements content-derived idempotency keys. This is
  ordinary distributed-systems practice rather than agent-specific practice, so the absence of
  agent-ecosystem precedent is not evidence against it.

## Recommended Resolution

Derive the key from content, not from randomness or position. Proposed, not locked — see
[`../../adr/amendments/AMD-006-content-derived-idempotency.md`](../../adr/amendments/AMD-006-content-derived-idempotency.md).

```
idempotency_key = blake3(
    run_id ‖ logical_step_id ‖ capability_id ‖ canonical_cbor(arguments)
)
```

Properties this yields:

- **Crash-resume safe.** Re-deriving from the same inputs reproduces the same key.
- **Replay-exact.** Strict fold reproduces every key without storing it separately.
- **Correct on argument change.** Different arguments produce a different key, which is right —
  a retry with changed arguments *is* a new operation.

`logical_step_id` is deliberately **not** the event sequence number. It identifies the step in the
plan, so a retry after an intervening event still derives the same key. This distinction is the
part most easily got wrong.

Depends on [CONFLICT-005](CONFLICT-005-canonical-encoding-unspecified.md): the derivation requires
canonical argument encoding, so these two must be decided together.

## Alternatives Considered

- **Random key persisted before dispatch.** Rejected: requires a durable write per operation and
  still has a window between generation and append. Content derivation has no window.
- **Caller-supplied keys.** Rejected for M0: pushes the problem onto every capability author and
  guarantees inconsistency. May be offered later as an override.
- **Sequence-number derivation.** Rejected: breaks under any intervening event, as described
  above.

## Migration Required

**Yes if deferred.** Keys already issued under a different derivation cannot be reproduced, so
in-flight operations across the change cannot be deduplicated.

## Blocks Implementation

**Yes.** It is part of the capability request schema and depends on the canonical encoding
decision.
