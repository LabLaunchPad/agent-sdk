---
type: Architecture Decision
title: UNKNOWN_OUTCOME as a First-Class Side-Effect State
description: Any operation whose remote outcome cannot be confirmed after a timeout must be representable as UNKNOWN_OUTCOME, never silently retried or silently treated as failed
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: stable
---

# ADR-0011 — `UNKNOWN_OUTCOME` as a First-Class Side-Effect State

| Field      | Value                                                                |
| ---------- | -------------------------------------------------------------------- |
| Phase      | P03 (task), P04 (state)                                              |
| Supersedes | Amends `specs/persistence/STORE-INTERFACES.md` (does not replace it) |

## Context

This is the single most cross-corpus-corroborated finding in the entire
research graph. Three corpora that never saw each other's output
independently proposed the identical requirement: batch 2's
`adr-candidate-006-durable-side-effect-reconciliation` (an Operation ID +
`UNKNOWN_OUTCOME` model, flagged at import as the weakest-evidenced of
batch 2's 6 candidates — no cited sources); the `post-commit-ops` bundle's
own `MERGE_UNKNOWN`/`DEPLOY_UNKNOWN`/`RECONCILING` states for this
repository's own git/CI/deploy lifecycle
(`post-commit-ops-unknown-outcome-convergence`); and wave1's scoped
exactly-once semantics topic plus its `E5-A` durable-restart benchmark plan
(`current-wave-cw-007-unknown-outcome-mutation-state`,
`CTR-UNKNOWN-OUTCOME-CONVERGENCE` in `research/canonical/canonical-research.json`).

The convergence strengthens what was individually the weakest-evidenced
claim into the strongest-corroborated one in the whole graph — a direct
demonstration that cross-corpus agreement matters more than any single
source's evidence level. `specs/persistence/STORE-INTERFACES.md` already
states the adjacent invariant ("side-effect completion is itself persisted
state, not inferred from progress") without naming the failure state that
makes it necessary — that gap is what this ADR closes.

## Decision

Any operation with an external side effect (a tool call, a capability
invocation, an MCP/A2A remote call) whose completion cannot be confirmed
after a timeout or a disconnection must transition to an explicit
**`UNKNOWN_OUTCOME`** state, never silently collapsed into `SUCCESS` or
`FAILED`, and never silently retried without first attempting
reconciliation (checking actual remote state before re-issuing the
operation). This is a contract addition to `@lablaunchpad/task`/
`@lablaunchpad/state`'s operation model, not a new package
(`SideEffectEngine` fails the delete-test as a standalone boundary — the
kernel cannot work without this _concept_, but the concept is a state
value and a reconciliation contract, not independent code with its own
dependency cut). Every side-effect-capable capability must expose an
operation identity stable enough to support reconciliation after an
`UNKNOWN_OUTCOME`.

## Adversarial review

**Attack:** this adds a fourth outcome state to what implementers expect
to be a three-state (pending/success/failure) model, and "reconcile before
retry" is meaningfully harder to implement correctly than "retry with
backoff" — teams will get the reconciliation step wrong or skip it under
deadline pressure, and a skipped reconciliation with the state formally
named `UNKNOWN_OUTCOME` is not actually safer than one where the ambiguity
was never named at all.

**Failure modes:** reconciliation requires the capability itself to expose
a way to check actual remote state — if a capability can't (a fire-and-
forget webhook with no read-back path, for instance), `UNKNOWN_OUTCOME`
becomes a dead-end state nothing can resolve, and the contract has to
degrade to "escalate to a human," which is exactly what `post-commit-ops`'s
own `ESCALATE` state does for its unreconcilable cases.

**Falsifying experiment:** implement one capability with a genuine timeout
window (an MCP tool call against a slow/flaky server) and inject a forced
timeout during the response. Confirm the operation surfaces as
`UNKNOWN_OUTCOME`, not silently retried or silently failed, and that a
reconciliation check (if the capability supports one) correctly resolves
it. If no realistic capability in Phase 8-9's actual set can support
reconciliation, this decision should be narrowed to "escalate," not
"reconcile."

## Alternatives considered

| Alternative                                                     | Why rejected                                                                                                                                                                                                 |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Collapse ambiguous outcomes into `FAILED`, let the caller retry | Directly produces duplicate side effects on operations that actually succeeded remotely — exactly the failure mode `post-commit-ops`'s own no-blind-retry rule and all three converging corpora warn against |
| Collapse ambiguous outcomes into `SUCCESS` (optimistic)         | Silently proceeds on an operation that may never have happened — worse than the failure case for anything with real-world consequences                                                                       |
| A standalone `SideEffectEngine` package                         | Fails the delete-test; this is a state value and reconciliation contract that belongs on `task`/`state`'s existing operation model, not independent code                                                     |

## Consequences

Easier: capability authors get one, explicit place to express "I don't
know if this happened" instead of inventing ad hoc timeout-handling per
capability; consumers of `@lablaunchpad/task` get a state they can build
retry/escalation policy around deliberately. Harder: every side-effect
capability now needs a stable operation identity and, where possible, a
reconciliation path — a meaningfully bigger interface surface than
fire-and-forget. Forecloses: any capability contract that treats a timeout
as equivalent to failure.

## Revisit trigger

When Phase 8-9 (Capability, Policy) design work finds a real capability
category (not a hypothetical) that cannot support any reconciliation path
at all, forcing `UNKNOWN_OUTCOME` to degrade to escalate-only for that
category; or when the first `UNKNOWN_OUTCOME`-triggering E5 (a future,
not-yet-run experiment distinct from this phase's durable-restart test)
shows the reconciliation contract doesn't hold up in practice.

## Evidence

`research/canonical/canonical-research.json` contradiction
`CTR-UNKNOWN-OUTCOME-CONVERGENCE`; `docs/operations/post-commit-ops/08-recovery/unknown-outcome-protocol.md`;
`docs/operations/post-commit-ops/01-lifecycle/change-state-machine.md`
(`MERGE_UNKNOWN`/`DEPLOY_UNKNOWN`/`RECONCILING`); `research/topics/durability-exactly-once.md`;
`.context/research/decisions.json` entries
`adr-candidate-006-durable-side-effect-reconciliation`,
`post-commit-ops-unknown-outcome-convergence`,
`current-wave-cw-007-unknown-outcome-mutation-state`;
`specs/persistence/STORE-INTERFACES.md` §12 (Recovery).
