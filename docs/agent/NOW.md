# NOW

The single current objective. If you are working on something not described
here, stop and reconcile before continuing.

## Phase

**P1A — OKF v0.2 Adoption + Gap Audit**, Workstream A (OKF adoption)

## Objective

Migrate agent-facing knowledge (`.context/`, `research/`, `specs/`, `ADR/`) to
[OKF v0.2](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
with a full no-regression gate, then hand off to Workstream B (the 90-dimension
gap audit). See [ADR-0007](../../ADR/0007-adopt-okf-v0-2.md) and
[ADR-0008](../../ADR/0008-cache-trust-tiers.md).

Phase 0 proved the engineering environment. Phase 1A adopts a vendor-neutral
knowledge format and audits the plan against the current ecosystem. Only
Phase 2+ implements Agent SDK behaviour.

## In scope (Workstream A)

Envelope migration for the four `.context/` cache records; OKF frontmatter on
`ADR/*.md` and `specs/persistence/STORE-INTERFACES.md`; the sixth validator
(`okf-conformance`, structural OKF conformance including required leniency);
the rewritten `context-staleness` validator (derived freshness + trust tier);
fixtures proving both validators reject their negative cases and do NOT
over-reject the spec's explicit leniency cases; governance-doc updates.

## Out of scope

Any Agent SDK product behaviour. Workstream B (the gap audit itself) — begins
only once Workstream A's no-regression gate passes. Any change to `docs/` or
directory `README.md`/`TEMPLATE*.md` files — deliberately excluded from OKF
scope (see `docs/agent/DECISIONS.md`).

## Definition of done (Workstream A no-regression gate)

1. All 5 original validators still `PASS`.
2. All original adversarial negative fixtures still reject — migrated, not
   deleted.
3. The 5 live negative probes from the Phase 0 receipt still fail-then-revert.
4. `pnpm verify` green on Node 24.19.0, CI green.
5. Every `.context` record's hash check still functions.
6. No knowledge fact exists in two formats simultaneously at phase end.

Not "the validators run" — see AGENTS.md's evidence principle.
