# CONFLICT-014 — "No hidden global state" read literally bans the ecosystem

**Tags:** `NON-BLOCKING`
**Affected ADR:** `UNVERIFIED` — cited ADR-082 (No Hidden Global State); does not exist in this repository. Related but not equivalent: the M0 proof matrix carries a "no hidden state" gate item, and [CONFLICT-002](CONFLICT-002-cancellation-substate-unrepresentable.md) invokes the same principle when it rejects tracking cancellation out-of-band. This conflict's premise is restated below on its own terms. See the [provenance note](README.md#citation-provenance)

## Current Decision

"No hidden global state" is stated as an architectural invariant, and the M0 gate tests it. The
motivating concern is sound and specific: run state must live in the fold, so that replay
reconstructs it exactly and nothing material is carried in an ambient variable the log cannot see.

## Observed Design

Read literally — "no process-global mutable state anywhere in the system" — the invariant
prohibits a large amount of ordinary, well-behaved infrastructure that any real deployment uses:

- **Async context propagation.** Node's `AsyncLocalStorage`, and the equivalent task-local
  mechanisms elsewhere, are ambient by construction. Structured logging, request correlation and
  trace propagation are all built on them.
- **Tracing and metrics.** OpenTelemetry's context propagation and its global meter/tracer
  providers are process-global by design.
- **Process facilities.** Signal handlers, the allocator, connection pools, `rustls`' crypto
  provider installation, the logger.

A runtime that genuinely forbade all of these could not be observed in production, which is a
strange property for a system whose central claim is auditability.

## Contradiction

The invariant conflates two different things under one phrase:

- **Hidden *run* state** — anything that changes what a run does, or what its outcome is, without
  appearing in the event log. This is what makes replay unfaithful, and it is the real defect the
  invariant exists to prevent.
- **Ambient *infrastructure* state** — things that affect how the process is observed or
  resourced, but not what the fold produces. A logger, a metrics registry, a connection pool.

Only the first breaks determinism. Banning the second buys nothing and costs the ecosystem.

There is a sharper way to state the distinction, and it also makes it testable: **state is hidden
if removing it changes the fold's output.** A tracer does not; a cached policy decision does. That
is a property a test can assert, whereas "no globals" is a property that can only be asserted by
grep — and it will produce false positives on every well-behaved dependency.

A literal reading also invites a worse outcome than the one it prevents. Told they may not have
ambient context, implementers thread a context object through every signature; when that becomes
unwieldy they smuggle state through a `static` anyway, unreviewed, because the rule made the
honest option unavailable.

## Security / Reliability / Compatibility Impact

**Security — low, with one real edge.** Ambient *authority* is genuinely dangerous — a globally
installed capability host, or a policy engine reachable from a `static`, could be used to bypass
the chokepoint that [CONFLICT-001](CONFLICT-001-transform-privilege-escalation.md) requires be
unshadowable. The refined rule must keep prohibiting that specific case.

**Reliability — low.**

**Compatibility — moderate.** Read literally, it constrains the dependency set permanently, which
is a large consequence for an invariant that has not been stated precisely.

## Affected Schemas

None.

## Affected APIs / ABIs

- Whether the kernel's public entry points take an explicit context parameter or read an ambient one
- Whether adapters may install process-global providers (tracer, logger, crypto)

## Affected Tests

- the "no hidden state" gate asserts *fold equivalence*, not the absence of statics
- two runs interleaved in one process do not observe each other's state
- removing the tracer does not change the fold's output
- no capability host or policy engine is reachable from a process-global

## Downstream Dependencies

Every adapter, and the entire observability story. The kernel/adapter boundary is where the
refined rule bites: layer 0–1 stays pure, adapters at layer 4 may hold process-global resources.
That aligns with `boundaries.json`'s existing layering rather than inventing a new axis.

## Evidence

- **FACT** — `boundaries.json` already encodes a layered dependency direction (contracts → core →
  composition → runtime → adapters) with a `runtimeNeutral` flag per package, which is exactly the
  seam this conflict needs.
  [`boundaries.json`](../../../boundaries.json)
- **FACT** — ADR-0013 requires that every capability invocation pass through a policy check
  "independent of any agent-level guardrail", and warns that a separate subsystem "could be
  bypassed if a caller skips it".
  [`ADR/0013-security-at-policy-capability-boundary.md`](../../../ADR/0013-security-at-policy-capability-boundary.md)
- **INFERENCE** — That warning is the security-relevant half of this conflict. Ambient
  *authority* must stay banned even as ambient *infrastructure* is permitted; the two must not be
  relaxed together.
- **INFERENCE** — "Removing it changes the fold's output" is testable in a way "no globals" is
  not, which is the practical argument for restating the invariant rather than merely softening it.
- **UNKNOWN** — Whether the original ADR-082 already drew this distinction. The document cannot be
  produced, so the literal reading is the only one available to work from, and this conflict may
  be arguing against a strawman its author never intended.

## Recommended Resolution

Restate the invariant in terms of the fold. Proposed, not locked.

1. **Replace "no hidden global state" with: no state outside the event log may change the fold's
   output.** Ambient infrastructure that cannot affect the fold is permitted.
2. **Keep ambient *authority* prohibited, explicitly.** No capability host, policy engine,
   credential, or approval decision may be reachable from a process-global. This preserves
   ADR-0013's unshadowable chokepoint, which is the part with teeth.
3. **Locate the rule on the existing layer boundary.** Layers 0–1 (`contracts`, `core`) hold no
   process-global mutable state at all; layer 4 (`adapters`) may, and declares it. `boundaries.json`
   already carries the layer manifest and a `runtimeNeutral` flag, so no new mechanism is needed.
4. **Test it as fold equivalence,** not as a source-code grep: the same fixtures folded in a
   process with and without observability installed must produce identical output.
5. **Permit async-context propagation for correlation only** — trace IDs and log context, never
   run-affecting values.

## Alternatives Considered

- **Keep the literal reading.** Rejected: it bans standard observability, and pressure to work
  around it produces exactly the unreviewed `static` the rule was meant to prevent.
- **Drop the invariant.** Rejected: the underlying concern is real and is a genuine M0 gate item.
  Replay is only meaningful if nothing outside the log moves the result.
- **Allow globals but require declaration in a manifest.** Rejected as the primary mechanism —
  declaration is not enforcement, and it would still not distinguish a tracer from a cached policy
  decision. Useful as a supplement to (3), not a replacement.

## Migration Required

**No.** No persisted state is involved.

## Blocks Implementation

**No.** But the M0 gate item "no hidden state" is currently **unfalsifiable as written** — the same
defect [CONFLICT-004](CONFLICT-004-replay-is-two-operations.md) identifies in the replay gate item.
The proof must be defined as fold equivalence before it can be claimed as passing.
