# CONFLICT-009 — Effect-class taxonomy mismatch defeats the no-widening invariant

**Tags:** `SECURITY-CRITICAL` `SCHEMA-AFFECTING` `BLOCKING`
**Affected ADR:** [ADR-0013](../../../ADR/0013-security-at-policy-capability-boundary.md) (Security at the Policy/Capability Boundary) — remapped from ADR-030/031 (Policy). **ADR-0013 already decides half of this conflict:** *"Tool output is treated as data, never authority — a tool's own description, annotations, or returned content must never be trusted to self-report its safety or grant capability access."* That is the model-assertion rule below, already locked; only the **lattice** remains open. `UNVERIFIED` for ADR-048 (Transaction Boundary) and for "the locked M0 security requirement", neither of which exists here. See the [provenance note](README.md#citation-provenance)

## Current Decision

ADR-048 classifies operations into four classes and requires progressively stricter policy:

```
READ  WRITE  EXTERNAL_SIDE_EFFECT  IRREVERSIBLE
```

The locked M0 security requirement instead mandates that policy transformation "at minimum
distinguish":

```
READ  WRITE  EXECUTE  NETWORK  IRREVERSIBLE
```

## Observed Design

The no-widening invariant from [CONFLICT-001](CONFLICT-001-transform-privilege-escalation.md)
is stated as "the post-transform effect class must not exceed the pre-transform class." That
statement presupposes an ordering over a single, agreed set of classes.

## Contradiction

The two taxonomies are not the same set, and neither is a refinement of the other:

- `EXECUTE` and `NETWORK` appear only in the security requirement.
- `EXTERNAL_SIDE_EFFECT` appears only in ADR-048.
- `NETWORK` is arguably an instance of `EXTERNAL_SIDE_EFFECT`, but `EXECUTE` is not — executing a
  local binary is not inherently external.

Until one taxonomy is authoritative, **the security invariant is not merely unimplemented, it is
unstateable.** "Does `EXECUTE → NETWORK` widen?" has no answer, because the two terms do not
co-exist in any single defined ordering.

There is a further defect concealed in the phrase "progressively stricter" (ADR-048) and in the
`<=` comparison implied by the narrowing rule: both assume a **total order**. That assumption is
wrong. `NETWORK` and `WRITE` are not comparable — sending data to a remote host and overwriting a
local file are different kinds of authority, and neither dominates the other. Forcing a total
order means some genuine widening compares as narrowing and is permitted.

Concretely: if the order were `READ < WRITE < EXECUTE < NETWORK < IRREVERSIBLE`, then a transform
from `NETWORK` to `EXECUTE` would compare as narrowing and be allowed — turning "fetch a URL"
into "run a binary", which is plainly an escalation.

## Security / Reliability / Compatibility Impact

**Security — high.** This is the enabling condition for
[CONFLICT-001](CONFLICT-001-transform-privilege-escalation.md). A wrong lattice produces an
invariant that passes its own tests while permitting real escalation. The total-order trap is the
specific way a competent implementer gets this wrong.

**Reliability — low.**

**Compatibility — high.** The effect class is part of the capability request payload and is
persisted in every policy decision event.

## Affected Schemas

- The capability request payload (`op_class` / effect class field)
- The policy decision event
- Plugin manifests, which declare the effect classes a plugin's capabilities may use

## Affected APIs / ABIs

- The policy engine's narrowing comparison
- The plugin manifest permission declaration

## Affected Tests

The entire negative-test suite for the security invariant depends on this:

- every widening pair in the lattice is rejected
- `network_to_execute_is_rejected_as_widening` — the total-order trap specifically
- `incomparable_classes_are_rejected_rather_than_ordered`

## Downstream Dependencies

Every capability added in every later phase declares an effect class. Phase 3 (filesystem, shell,
process, browser) is where `EXECUTE` and `NETWORK` become concrete and the distinction starts
carrying real weight.

## Evidence

- **FACT** — The locked M0 security requirement enumerates READ / WRITE / EXECUTE / NETWORK /
  IRREVERSIBLE and states that a transformation must not implicitly perform `READ → WRITE`,
  `READ → EXECUTE` or `READ → IRREVERSIBLE`. It does not address comparability among the middle
  classes.
- **FACT** — MCP declares a `readOnlyHint` on tools, and AgentScope auto-allows MCP tools carrying
  it — a policy decision keyed on a *declared property of the capability* rather than a per-tool
  allowlist. <https://java.agentscope.io/v2/en/docs/building-blocks/tool.html>
- **FACT** — OpenHands models risk as a four-level scale (`low`/`medium`/`high`/`unknown`) with an
  explicit rule that when no analyzer is configured, a model-declared risk field is ignored and
  forced to `UNKNOWN`. <https://github.com/OpenHands/software-agent-sdk>
  (`openhands-sdk/openhands/sdk/security/confirmation_policy.py`)
- **INFERENCE** — The OpenHands rule generalizes to a principle worth adopting independently: an
  effect class asserted by the model must never be trusted; it is a property of the *capability
  declaration*, not of the request.

## Recommended Resolution

Adopt the five-class set as authoritative and define it as a **partial order**, not a chain.
Proposed, not locked — see
[`../../adr/amendments/AMD-009-effect-class-lattice.md`](../../adr/amendments/AMD-009-effect-class-lattice.md).

- **Amend ADR-048** to the five-class set. `EXTERNAL_SIDE_EFFECT` is subsumed: a network call is
  `NETWORK`, and any operation that cannot be undone is `IRREVERSIBLE` regardless of locality.
- **Define an explicit partial order.** `READ` is the least element; `IRREVERSIBLE` is the
  greatest. `WRITE`, `EXECUTE` and `NETWORK` are **mutually incomparable** and sit between them.
- **Narrowing means "strictly below in the lattice."** Incomparable pairs are **rejected**, not
  ordered. `NETWORK → EXECUTE` is refused because neither dominates the other — which is the
  correct outcome and the one a total order would get wrong.
- **Effect class is declared by the capability, never asserted by the model.** A class present in
  a model-produced request is ignored, following the OpenHands rule.

Also adopt from OpenHands: pure control operations (finish, think, and their equivalents) bypass
the approval gate entirely, or every run stalls on trivia.

## Alternatives Considered

- **Keep ADR-048's four classes.** Rejected: it directly contradicts the locked security
  requirement, which is the more recent and more specific decision.
- **Total order over five classes.** Rejected: permits `NETWORK → EXECUTE`, an escalation, as
  shown above. This is the trap, and it is the option an implementer reaches for first because
  `<=` is easy.
- **Free-form capability tags with per-rule comparison.** Rejected: makes the invariant
  unprovable, since there is no fixed ordering to test exhaustively.

## Migration Required

**Yes if deferred.** The class enum is persisted in every policy decision event and every plugin
manifest.

## Blocks Implementation

**Yes.** [CONFLICT-001](CONFLICT-001-transform-privilege-escalation.md) cannot be resolved without
it, and the security invariant cannot even be written down.
