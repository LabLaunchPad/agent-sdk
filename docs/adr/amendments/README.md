# ADR Amendments

**Source-of-truth status: PROPOSED.** Nothing here is locked.

Each amendment resolves exactly one entry in the
[M0 Architecture Conflict Register](../../architecture/conflicts/README.md). They exist because
the register is a list of problems, and a problem list cannot be signed off — a decision can.

Amendments use [`ADR/TEMPLATE.md`](../../../ADR/TEMPLATE.md) and carry `status: draft`
(OKF `Proposed`). On sign-off they become `status: stable` and, where they change an existing
decision, the amended ADR gains a `Superseded by` line. **Until then no runtime code may be
written against them** — the register's own rule.

## Index

| Amendment | Resolves | Amends | Tags |
|---|---|---|---|
| [AMD-001](AMD-001-transform-narrowing.md) | [001](../../architecture/conflicts/CONFLICT-001-transform-privilege-escalation.md) | ADR-0013 | `SECURITY-CRITICAL` |
| [AMD-002](AMD-002-cancellation-orthogonal-region.md) | [002](../../architecture/conflicts/CONFLICT-002-cancellation-substate-unrepresentable.md) | — | `SCHEMA-AFFECTING` |
| [AMD-003](AMD-003-phase-reduction.md) | [003](../../architecture/conflicts/CONFLICT-003-phase-list-over-modelled.md) | — | `SCHEMA-AFFECTING` |
| [AMD-004](AMD-004-replay-modes.md) | [004](../../architecture/conflicts/CONFLICT-004-replay-is-two-operations.md) | — | `SCHEMA-AFFECTING` |
| [AMD-005](AMD-005-canonical-encoding.md) | [005](../../architecture/conflicts/CONFLICT-005-canonical-encoding-unspecified.md) | ADR-0010 | `SCHEMA-AFFECTING` `ABI-AFFECTING` |
| [AMD-006](AMD-006-content-derived-idempotency.md) | [006](../../architecture/conflicts/CONFLICT-006-idempotency-vs-replay.md) | ADR-0011 | `SCHEMA-AFFECTING` |
| [AMD-007](AMD-007-plugin-abi-scope.md) | [007](../../architecture/conflicts/CONFLICT-007-plugin-abi-cannot-be-one-integer.md) | ADR-0012 | `ABI-AFFECTING` |
| [AMD-008](AMD-008-environment-capability-negotiated.md) | [008](../../architecture/conflicts/CONFLICT-008-environment-is-os-shaped.md) | — | `SCHEMA-AFFECTING` |
| [AMD-009](AMD-009-effect-class-lattice.md) | [009](../../architecture/conflicts/CONFLICT-009-effect-class-taxonomy-mismatch.md) | ADR-0013 | `SECURITY-CRITICAL` `SCHEMA-AFFECTING` |
| [AMD-010](AMD-010-dual-action-identity.md) | [010](../../architecture/conflicts/CONFLICT-010-action-correlation-needs-two-ids.md) | ADR-0009 | `SCHEMA-AFFECTING` |
| [AMD-011](AMD-011-cancellation-ownership.md) | [011](../../architecture/conflicts/CONFLICT-011-cancel-is-a-request-not-a-command.md) | — | `SCHEMA-AFFECTING` |

Conflicts 012–014 have recommended resolutions recorded in their own files and no amendment yet;
012 is `SCHEMA-AFFECTING` but non-blocking, and 013/014 are `NON-BLOCKING`.

## Sign-off order

These are not independent. Four pairs interlock, and taking them out of order means deciding a
question whose input is still open:

```
AMD-009  effect-class lattice
   │      (defines the ordering "narrowing" is measured against)
   ▼
AMD-001  transform narrowing

AMD-005  canonical encoding
   │      (defines the digest that keys are derived from)
   ├──▶ AMD-006  content-derived idempotency
   └──▶ AMD-008  environment fingerprint

AMD-010  dual action identity
   │      (defines the ownership key cancellation targets)
   ▼
AMD-011  cancellation ownership

AMD-002  cancellation as an orthogonal region
   │      (fixes what a phase is before phases are removed)
   ▼
AMD-003  phase reduction
```

`AMD-009` and `AMD-005` are the roots. Neither has a prerequisite, and between them they gate
six of the remaining nine.

## Full citation mapping

The register originally cited an ADR set numbered ADR-002 through ADR-089. **None of those
documents exist in this repository** — verified across every branch and every commit. Only
[`ADR/0001`–`0016`](../../../ADR/) are real. This table records what each original citation was
mapped to, so the rewrite is auditable rather than silent.

| Originally cited | Mapped to | Basis |
|---|---|---|
| ADR-030 Policy Engine | ADR-0013 | Same subject: policy as the enforcement point |
| ADR-031 Capability Security | ADR-0013 | Same subject: security at the capability boundary |
| ADR-054 Agent Communication | ADR-0009 | Protocol/application/agent state distinction covers the identifier question |
| ADR-047 Idempotency | ADR-0011 | ADR-0011 requires "operation identity stable enough to support reconciliation" |
| ADR-049 Failure Recovery | ADR-0011 | `UNKNOWN_OUTCOME` + reconciliation is the recovery contract |
| ADR-009 Checkpointing | ADR-0010 | Durability/checkpoint boundary, incl. schema versioning |
| ADR-072 Storage | ADR-0006 | Persistence interfaces, local-first defaults |
| ADR-004 Plugin Architecture | ADR-0012 *(partial)* | Covers isolation mechanism only, not plugin ABI |
| ADR-044 Plugin Lifecycle | ADR-0012 *(partial)* | Same |
| ADR-080 Versioning | ADR-0010 *(partial)* | Covers persisted-schema versioning only |
| ADR-002 Runtime Model | `UNVERIFIED` | No counterpart |
| ADR-003 WASM Strategy | `UNVERIFIED` | No counterpart; ADR-0001 carries the runtime-surface argument |
| ADR-007 State Machine | `UNVERIFIED` | No counterpart |
| ADR-008 Event Sourcing | `UNVERIFIED` | No counterpart |
| ADR-010 Environment | `UNVERIFIED` | No counterpart |
| ADR-039 Replay | `UNVERIFIED` | No counterpart |
| ADR-046 Determinism | `UNVERIFIED` | No counterpart |
| ADR-048 Transaction Boundary | `UNVERIFIED` | No counterpart |
| ADR-056 Ownership | `UNVERIFIED` | No counterpart |
| ADR-057 Cancellation | `UNVERIFIED` | No counterpart |
| ADR-071 Trace Context | `UNVERIFIED` | No counterpart |
| ADR-075 Identity | `UNVERIFIED` | No counterpart |
| ADR-076 Device Federation | `UNVERIFIED` | No counterpart |
| ADR-082 No Hidden Global State | `UNVERIFIED` | No counterpart; M0 gate item carries the principle |
| ADR-088 Heartbeats | `UNVERIFIED` | No counterpart |
| ADR-089 Dead Worker Recovery | `UNVERIFIED` | No counterpart |

Sixteen of twenty-six have no counterpart. Those conflicts stand on their own restated premise.

**Links to `../../../ADR/…` resolve only after PR #1 merges to `main`** — that draft branch is
where `ADR/0001–0016` currently live. Written against the post-merge location deliberately.
