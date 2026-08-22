# CONFLICT-001 — Policy TRANSFORM permits privilege escalation

**Tags:** `SECURITY-CRITICAL` `BLOCKING`
**Affected ADR:** [ADR-0013](../../../ADR/0013-security-at-policy-capability-boundary.md) (Security at the Policy/Capability Boundary) — remapped from ADR-030 (Policy Engine) and ADR-031 (Capability Security); see the [provenance note](README.md#citation-provenance)

## Current Decision

ADR-030 states that every capability request passes through the policy engine, and that the
result is one of:

```
ALLOW
DENY
APPROVAL
ESCALATE
TRANSFORM
```

`TRANSFORM` is named as a decision outcome. The ADR specifies neither a termination condition
nor a permitted direction of change.

## Observed Design

Any implementation of `TRANSFORM` must answer two questions the ADR leaves open:

1. **When does transformation stop?** A transform produces a new request, which must itself be
   evaluated — otherwise the transform bypasses policy. But re-evaluation can transform again.
2. **What may a transform change?** If it may change the capability or its effect class, it can
   produce a request with *more* authority than the one the principal asked for.

## Contradiction

The ADR simultaneously requires that (a) the policy engine is the enforcement point for least
privilege (ADR-031), and (b) the policy engine may rewrite requests arbitrarily (ADR-030). These
are incompatible. A rewrite facility inside the enforcement point is a privilege-granting
primitive unless explicitly constrained.

Two concrete failures follow directly from the ADR as written:

- **Non-termination.** A rule set containing `A → B` and `B → A` loops forever. Nothing in the
  ADR forbids it, and it is a natural consequence of independent rules authored separately.
- **Privilege widening.** A rule transforming a `READ` request into an `IRREVERSIBLE` one is
  permitted by the text. This is privilege escalation located inside the component whose stated
  job is to prevent it.

A third, subtler failure concerns audit: `CapabilityRequested` records what was asked for, not
what ran. Without an explicit binding, the audit trail is ambiguous about which request was
actually dispatched.

## Security / Reliability / Compatibility Impact

**Security — high.** Privilege widening via transform is exploitable by anyone who can influence
rule authoring, and is invisible in the request log if only the pre-transform request is recorded.
This is the highest-severity item in the register.

**Reliability — high.** Non-terminating transform cycles hang the run inside the policy engine,
which is a synchronous, pure component with no timeout of its own.

**Compatibility — moderate.** Adding a depth counter and a narrowing check later changes the
policy evaluation event payload, which is persisted.

## Affected Schemas

- The policy decision event payload (gains `transform_of`, `transform_depth`)
- The capability request digest recorded on dispatch (must bind post-transform, not pre-transform)

## Affected APIs / ABIs

- `PolicyEngine::evaluate` return type — the `Transform` variant's payload
- The policy rule-set format, if narrowing is to be validated at rule-load time as well as at
  evaluation time

## Affected Tests

Cannot currently be written, because the correct behaviour is undefined:

- transform terminates rather than looping
- transform cannot widen effect class
- transform cannot leave the original capability namespace
- dispatch and audit bind the post-transform request

## Downstream Dependencies

Every later phase that adds a capability inherits this. Phase 3 (local computer: filesystem,
shell, process) is where widening becomes materially dangerous — a `READ` on a path transformed
into an `EXECUTE` is a full compromise of the local-first promise.

## Evidence

- **FACT** — The Claude Agent SDK implements request transformation in production: a `PreToolUse`
  hook returns `hookSpecificOutput.updatedInput`, documented with an example that rewrites
  `file_path` to prepend a sandbox prefix. Critically, it is a **typed replacement bounded by the
  tool's own input schema** — the hook returns a replacement input object, not a patch language —
  and if `permissionDecision` is omitted "the modified input still applies and flows through the
  normal permission evaluation." <https://code.claude.com/docs/en/agent-sdk/hooks>
- **FACT** — The same SDK emits a `CLAUDE_SDK_CAN_USE_TOOL_SHADOWED` process warning because its
  layered permission flow allows an earlier layer to silently skip a later gate; its own guidance
  is that checks which must run on every call belong in the one layer that cannot be bypassed.
  <https://code.claude.com/docs/en/agent-sdk/permissions>
- **INFERENCE** — Taken together, these establish that transformation is a proven, useful
  primitive *and* that layered gating is where such systems actually go wrong. The design lesson
  is a single unshadowable chokepoint with a typed, re-validated replacement.

## Recommended Resolution

Constrain `TRANSFORM` along four axes. Proposed, not locked — see
[`../../adr/amendments/AMD-001-transform-narrowing.md`](../../adr/amendments/AMD-001-transform-narrowing.md).

1. **Depth bound.** `MAX_TRANSFORM_DEPTH = 4`. Exceeding it is a policy error, not a silent stop.
2. **Monotonic narrowing.** The post-transform effect class must be less-or-equal to the
   pre-transform class under the lattice fixed by [CONFLICT-009](CONFLICT-009-effect-class-taxonomy-mismatch.md).
   Widening is rejected outright.
3. **Namespace containment.** The transformed capability must lie within the original
   capability's namespace. A transform may narrow `fs.*` to `fs.read`; it may not move to `net.*`.
4. **Auditability.** Every transform emits its own policy-decision event carrying
   `transform_of: Some(previous_request_id)`, and the dispatch event binds the digest of the
   **final, post-transform** request.

Transform is a **typed replace** — a new value of the same request schema, re-validated before
dispatch — never a patch or expression language.

## Alternatives Considered

- **Forbid TRANSFORM in M0.** Rejected: it removes a genuinely useful primitive with real
  precedent, and deferring it means the constraint gets designed later, under pressure, once
  rules already exist that assume unbounded rewriting.
- **Bound depth only.** Rejected: fixes the hang, leaves the security defect entirely intact.
- **Allow widening with an approval gate.** Rejected for M0: it conflates two mechanisms.
  Escalation should be an explicit, separately authorized decision (`ESCALATE`), not an implicit
  consequence of a rewrite. Keeping them distinct is what makes the invariant testable.

## Migration Required

**Yes if deferred.** The policy decision event is persisted. Adding `transform_of` and
`transform_depth` after runs exist requires a schema version bump and a fold that tolerates both
shapes. Deciding now costs nothing.

## Blocks Implementation

**Yes.** The policy engine is the M0 kernel's central gate. Its decision type and event payload
cannot be written before this is settled, and a wrong answer is a security defect rather than a
refactor.
