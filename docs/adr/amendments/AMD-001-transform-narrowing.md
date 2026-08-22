---
type: Architecture Decision
title: Transform Narrowing
description: Policy TRANSFORM is a depth-bounded, monotonically narrowing, namespace-contained typed replace, audited on the post-transform request.
generated:
  by: process:claude-code-session
  at: 2026-08-22T00:00:00Z
status: draft
---

# AMD-001 — TRANSFORM is a bounded, narrowing, namespace-contained typed replace

Resolves [CONFLICT-001](../../architecture/conflicts/CONFLICT-001-transform-privilege-escalation.md).
Amends [ADR-0013](../../../ADR/0013-security-at-policy-capability-boundary.md).
**Requires [AMD-009](AMD-009-effect-class-lattice.md)** — "narrowing" is undefined without the lattice.

| Field      | Value |
| ---------- | ----- |
| Phase      | P00   |
| Supersedes | —     |

## Context

`TRANSFORM` is named as a policy decision outcome alongside `ALLOW`, `DENY`, `APPROVAL` and
`ESCALATE`, with neither a termination condition nor a permitted direction of change. That leaves
a request-rewriting facility inside the component whose stated job is to enforce least privilege —
a privilege-granting primitive unless explicitly constrained.

Two failures follow directly from the text as written. A rule set containing `A → B` and `B → A`
**loops forever**, which is a natural consequence of rules authored independently. And a rule
transforming a `READ` request into an `IRREVERSIBLE` one is **permitted**, which is privilege
escalation located inside the escalation-prevention component.

A third concerns audit: if only the pre-transform request is recorded, the log is ambiguous about
what actually ran.

## Decision

Constrain `TRANSFORM` along four axes.

1. **Depth bound.** `MAX_TRANSFORM_DEPTH = 4`. Exceeding it is a **policy error**, not a silent
   stop — a silent stop would dispatch a partially-transformed request nobody authorized.
2. **Monotonic narrowing.** The post-transform effect class must be *strictly below* the
   pre-transform class in the [AMD-009](AMD-009-effect-class-lattice.md) lattice. Widening is
   rejected. Incomparable is rejected.
3. **Namespace containment.** The transformed capability must lie within the original's namespace.
   `fs.*` may narrow to `fs.read`; it may not become `net.*`.
4. **Auditability.** Every transform emits its own policy-decision event carrying
   `transform_of: Some(previous_request_id)`, and the dispatch event binds the digest of the
   **final, post-transform** request.

`TRANSFORM` is a **typed replace** — a new value of the same request schema, re-validated before
dispatch — never a patch or expression language. A patch language would be a second, unaudited
place where request semantics are decided.

Narrowing is validated **twice**: at rule-load time where statically decidable, and at evaluation
time always. Load-time validation is a convenience that catches authoring errors early; it is not
a substitute, because a transform's target may depend on the request.

## Adversarial review

**Attack:** `MAX_TRANSFORM_DEPTH = 4` is arbitrary. Any bound is arbitrary, and a rule set that
legitimately needs five will be rewritten to fit rather than reconsidered — the bound will shape
policy authoring rather than catch policy errors.

**Failure modes:** the depth limit becomes a design constraint authors work around, hiding the
composition it was meant to surface. Or narrowing is enforced on effect class only, while a
transform silently changes *arguments* to something more dangerous within the same class — a
`WRITE` to `/tmp/x` transformed to a `WRITE` to `~/.ssh/authorized_keys` narrows on nothing and
is permitted.

**Falsifying experiment:** the second failure is the serious one and is directly testable —
`transform_cannot_widen_argument_scope` for a path-scoped capability. This amendment does **not**
solve argument-level narrowing, and that gap is stated rather than papered over: effect-class
narrowing plus namespace containment is a necessary but not sufficient condition. Argument-scope
narrowing needs per-capability ordering and is deferred to the capability specs.

## Alternatives considered

| Alternative | Why rejected |
| ----------- | ------------ |
| Forbid TRANSFORM in M0 | Removes a primitive with real production precedent, and defers the constraint to a time when rules already assume unbounded rewriting |
| Bound depth only | Fixes the hang, leaves the security defect entirely intact |
| Allow widening behind an approval gate | Conflates two mechanisms. Escalation should be an explicit `ESCALATE` decision, not an implicit consequence of a rewrite — keeping them distinct is what makes the invariant testable |
| A patch/expression language for transforms | A second place where request semantics are decided, outside the request schema's own validation |

## Consequences

**Easier:** transform becomes testable. The audit trail answers "what actually ran" rather than
"what was asked". Non-termination becomes a diagnosable policy error.

**Harder:** rule authors must reason about the lattice and about namespaces. Argument-level
narrowing remains an open obligation on each capability spec.

**Foreclosed:** transform as a patch language. Transform as a means of escalation.

## Revisit trigger

Reopen when a legitimate rule set requires depth beyond 4, or when the first argument-scope
escalation is found in review — the latter would mean effect-class narrowing is carrying more
weight than it can bear and argument ordering must be promoted from the capability specs into
the policy engine itself.

## Evidence

- **FACT** — The Claude Agent SDK implements request transformation in production: a `PreToolUse`
  hook returns `hookSpecificOutput.updatedInput`, a **typed replacement bounded by the tool's own
  input schema** rather than a patch language, and when `permissionDecision` is omitted the
  modified input still flows through normal permission evaluation.
  <https://code.claude.com/docs/en/agent-sdk/hooks>
- **FACT** — The same SDK emits `CLAUDE_SDK_CAN_USE_TOOL_SHADOWED` because a layered permission
  flow allows an earlier layer to skip a later gate; its guidance is that checks which must run
  on every call belong in the one layer that cannot be bypassed.
  <https://code.claude.com/docs/en/agent-sdk/permissions>
- **FACT** — ADR-0013 independently warns that a separable security subsystem "could be bypassed
  if a caller skips it". [`ADR/0013`](../../../ADR/0013-security-at-policy-capability-boundary.md)
- **INFERENCE** — Transformation is a proven, useful primitive; layered gating is where such
  systems actually go wrong. The design that follows is a single unshadowable chokepoint with a
  typed, re-validated replacement.
- **UNKNOWN** — Argument-scope narrowing. Not solved here; see the adversarial review.
