---
type: Architecture Decision
title: Effect-Class Lattice
description: Five effect classes ordered as a partial order, with incomparable pairs rejected rather than ordered.
generated:
  by: process:claude-code-session
  at: 2026-08-22T00:00:00Z
status: draft
---

# AMD-009 — The effect-class set is five classes ordered as a lattice, not a chain

Resolves [CONFLICT-009](../../architecture/conflicts/CONFLICT-009-effect-class-taxonomy-mismatch.md).
Amends [ADR-0013](../../../ADR/0013-security-at-policy-capability-boundary.md).

| Field      | Value |
| ---------- | ----- |
| Phase      | P00   |
| Supersedes | —     |

## Context

Two effect-class taxonomies were in play — a four-class set
(`READ`/`WRITE`/`EXTERNAL_SIDE_EFFECT`/`IRREVERSIBLE`) and a five-class set
(`READ`/`WRITE`/`EXECUTE`/`NETWORK`/`IRREVERSIBLE`) — which are not the same set and neither of
which refines the other. Until one is authoritative, the no-widening security invariant is not
merely unimplemented: **it is unstateable**, because "does `EXECUTE → NETWORK` widen?" has no
answer when the two terms do not co-exist in any defined ordering.

The second force is subtler and is the one that actually bites. Both "progressively stricter" and
the `<=` implied by a narrowing check presuppose a **total order**. That assumption is wrong, and
wrong in an exploitable direction.

ADR-0013 already decides part of this. Its clause *"Tool output is treated as data, never
authority — a tool's own description, annotations, or returned content must never be trusted to
self-report its safety or grant capability access"* settles who declares an effect class. That
half is not reopened here; only the ordering is.

## Decision

**Adopt the five-class set, ordered as a partial order.**

```
                 IRREVERSIBLE          ← greatest
                /     |      \
           WRITE   EXECUTE  NETWORK    ← mutually incomparable
                \     |      /
                    READ                ← least
```

1. `EXTERNAL_SIDE_EFFECT` is **subsumed**, not retained: a network call is `NETWORK`; anything
   that cannot be undone is `IRREVERSIBLE` regardless of locality.
2. `READ` is the least element. `IRREVERSIBLE` is the greatest.
3. `WRITE`, `EXECUTE` and `NETWORK` are **mutually incomparable**.
4. **Narrowing means strictly below in the lattice.** Incomparable pairs are **rejected**, not
   ordered.
5. Effect class is a property of the **capability declaration**, never of a request. A class
   appearing in a model-produced request is ignored — this is ADR-0013's rule applied, not a new one.
6. **Pure control operations** (finish, think, and equivalents) bypass the approval gate entirely,
   or every run stalls on trivia.

The comparison function must be **total in its result and partial in its ordering**: it returns
`Narrower`, `Wider`, `Equal`, or `Incomparable`, and `Incomparable` is a rejection. It must not
return a `bool`.

## Adversarial review

**Attack:** a partial order is more machinery than a chain, and every incomparable pair is a
transform someone will eventually want. The lattice will accrete comparability by exception
until it is a chain again, at which point the complexity bought nothing.

**Failure modes:** exceptions are added one at a time, each locally reasonable, and the invariant
erodes without any single change looking wrong. Or: the lattice is right but the *classification*
is wrong — a capability declared `WRITE` that actually executes something — and a correct
comparison over wrong inputs is still a bypass.

**Falsifying experiment:** `network_to_execute_is_rejected_as_widening` and
`incomparable_classes_are_rejected_rather_than_ordered` are direct tests. For erosion, the
observable is the count of comparability exceptions over time: if it exceeds zero, this decision
is failing in practice. For misclassification, audit every capability's declared class against
what it actually invokes — that is a review obligation this amendment creates and does not solve.

## Alternatives considered

| Alternative | Why rejected |
| ----------- | ------------ |
| Keep the four-class set | Contradicts the five-class requirement, which is the more specific statement of intent; `EXECUTE` is not an instance of `EXTERNAL_SIDE_EFFECT` since running a local binary is not external |
| Total order over five classes | Permits `NETWORK → EXECUTE` as narrowing — "fetch a URL" becomes "run a binary". This is the trap, and it is the option an implementer reaches for first because `<=` is easy |
| Free-form capability tags compared per-rule | Makes the invariant unprovable: no fixed ordering to test exhaustively |
| A numeric risk score | Reintroduces a total order wearing different clothes, with the same failure |

## Consequences

**Easier:** the security invariant becomes stateable, and therefore testable. The negative suite
can enumerate every pair in a five-element lattice exhaustively — twenty ordered pairs, a
complete test.

**Harder:** every capability must declare a class, and that declaration is now a security-relevant
assertion subject to review. Transform authors must reason about incomparability, which is less
intuitive than a scale.

**Foreclosed:** any `bool`-returning narrowing check. Any ordering of `WRITE`, `EXECUTE` and
`NETWORK` relative to each other.

## Revisit trigger

Reopen when a capability appears that genuinely cannot be classified into these five — the
concrete candidate is a capability whose effect depends on its arguments rather than its identity
(a shell command, where `ls` and `rm -rf` share one declaration). That case is not resolved here
and is the most likely source of a future amendment.

## Evidence

- **FACT** — ADR-0013 requires every capability invocation to pass through a policy check
  independent of any agent-level guardrail, and treats tool output as data rather than authority.
  [`ADR/0013`](../../../ADR/0013-security-at-policy-capability-boundary.md)
- **FACT** — MCP declares a `readOnlyHint` on tools and AgentScope auto-allows MCP tools carrying
  it: a policy decision keyed on a declared property of the capability rather than a per-tool
  allowlist. <https://java.agentscope.io/v2/en/docs/building-blocks/tool.html>
- **FACT** — OpenHands models risk as `low`/`medium`/`high`/`unknown` and forces a model-declared
  risk field to `UNKNOWN` when no analyzer is configured.
  <https://github.com/OpenHands/software-agent-sdk>
- **INFERENCE** — The OpenHands rule generalizes: an effect class asserted by the model is not
  evidence. It is a property of the declaration.
- **UNKNOWN** — Whether argument-dependent capabilities (shell) can be handled by declaration
  alone, or need per-invocation classification. Recorded rather than guessed; see the revisit
  trigger.
