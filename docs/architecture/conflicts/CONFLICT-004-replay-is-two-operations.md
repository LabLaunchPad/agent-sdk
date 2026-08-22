# CONFLICT-004 — "Replay" names two incompatible operations

**Tags:** `SCHEMA-AFFECTING` `BLOCKING`
**Affected ADR:** ADR-008 (Event Sourcing), ADR-046 (Determinism), ADR-039 (Replay)

## Current Decision

ADR-008 requires that append-only events be the source of truth and that state be derived from
them, listing "replay" among the properties this enables. ADR-046 states that LLM reasoning
cannot be deterministic but that harness, policy, state transitions and verification must be.
ADR-039 requires that "every significant execution should be replayable."

The Go/No-Go gate lists "Run can be replayed" and "Core state is replayable" as checklist items.

## Observed Design

"Replay" denotes two operations with fundamentally different guarantees:

1. **Strict fold.** Re-derive `RunState` from the recorded event log. Pure, deterministic,
   bit-exact, performs zero I/O and requires no model. This is what ADR-008 actually enables.
2. **Re-execution.** Re-run the agent against a live environment, re-invoking the model and
   re-dispatching capabilities. Nondeterministic by construction, produces real side effects, and
   may diverge from the original run.

## Contradiction

The ADRs use one word for both, and the Go/No-Go gate asserts "run can be replayed" without
saying which. As a result the gate item is **unfalsifiable**: an implementer can satisfy it with
either operation, and the two have opposite properties. A reviewer cannot tell whether a green
checkmark means "we can reconstruct state deterministically" or "we can re-run the agent and
usually get something similar."

There is a second-order consequence for the event schema. If observations are re-derivable, an
observation event may store a reference. If they are not, the observation's *content* is
authoritative and must be stored. That decision changes the event payload and cannot be made
without resolving the ambiguity first.

## Security / Reliability / Compatibility Impact

**Security — moderate.** Re-execution replays side effects. A "replay" of a run that sent an
email, made a payment, or deleted a file must not silently perform that effect a second time.
Conflating the two terms makes it possible to invoke the dangerous one believing it is the safe
one. This interacts directly with
[CONFLICT-006](CONFLICT-006-idempotency-vs-replay.md).

**Reliability — high.** The central M0 proof ("byte-exact replay") is meaningless until the term
is pinned.

**Compatibility — high.** Affects every effect-bearing event payload.

## Affected Schemas

- Every effect-bearing event gains a replayability marker
- Observation events — whether content is stored or referenced

## Affected APIs / ABIs

- The public replay entry point(s). Two operations require either two functions or an explicit
  mode parameter.

## Affected Tests

- `byte_exact_replay` — cannot be written without knowing which operation is under test
- `strict_replay_performs_zero_outbound_calls`
- `resume_from_checkpoint_matches_uninterrupted_run`

## Downstream Dependencies

ADR-040 (Evaluation) and ADR-041 (Computer Trajectory Dataset) both consume replay. A trajectory
dataset built from re-execution has different validity properties than one built from a recorded
fold.

## Evidence

- **FACT** — No reviewed project implements bit-exact replay. OpenAI, Anthropic, AgentScope,
  DeerFlow and Qwen all resume by re-invoking the model.
- **FACT** — OpenHands needed a *separate* `ReplayManager` distinct from its event fold, and
  documents its limits verbatim: "unexpected or even errorneous results could happen if 1) any
  action is non-deterministic, OR 2) if the initial state before the replay session is different
  from the initial state of the trajectory."
  <https://github.com/OpenHands/OpenHands> (`openhands/controller/replay.py`, tag 0.30.0)
- **FACT** — The OpenAI Agents SDK exposes a `RetryDecision(approve_unsafe_replay=True)` flag and
  documents that its single-delivery property is an SDK-level guarantee, not a provider-delivery
  guarantee — resent input may already have reached the provider, so provider-side work can
  repeat. <https://openai.github.io/openai-agents-python/ref/run_state/>
- **FACT** — Qwen's `open-computer-use` `--calls-file` executes a JSON array of typed calls
  sequentially against a *live* environment, halting on first error. This is re-execution
  presented in a form easily mistaken for replay.
  <https://github.com/QwenLM/open-computer-use>
- **INFERENCE** — OpenAI's `approve_unsafe_replay` marks precisely the boundary at issue here:
  effects that have left the process are not replayable. That is the correct invariant, arrived
  at independently.

## Recommended Resolution

Name both operations in the type system so the distinction cannot be lost. Proposed, not locked —
see [`../../adr/amendments/AMD-004-replay-modes.md`](../../adr/amendments/AMD-004-replay-modes.md).

```
ReplayMode = Strict | Reexecute
```

- **`Strict`** — pure fold over recorded events. Bit-exact. Performs zero outbound calls, requires
  no model, no network, no capability host. **This is the only mode the Go/No-Go gate tests.**
- **`Reexecute`** — re-invokes model and capabilities. Explicitly divergence-tolerant. Out of M0
  scope; named now so the schema reserves room for it.

Every effect-bearing event carries a replayability marker distinguishing a value that can be
re-derived by folding from one that is a *recorded outcome* of an external interaction. Strict
fold uses recorded outcomes and never re-dispatches.

Enforce the distinction structurally: the fold entry point must not accept an executor or
capability-host argument, so re-execution is impossible from that path by construction rather
than by discipline.

## Alternatives Considered

- **Leave it implicit.** Rejected: it makes the central M0 gate item unfalsifiable, and the
  ambiguity bites hardest in Phase 3 when real side effects exist.
- **Forbid re-execution entirely.** Rejected: it is genuinely useful for evaluation and debugging.
  The problem is the shared name, not the operation.
- **Distinguish by convention/documentation only.** Rejected: the reference implementations show
  this is exactly where such systems slip. A type-level split costs nothing.

## Migration Required

**Yes if deferred.** The replayability marker is a per-event field.

## Blocks Implementation

**Yes.** It determines the event payload shape and the signature of the fold.
