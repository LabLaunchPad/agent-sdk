# NEXT

Queued work. Nothing here may start before its gate opens.

## Current phase

**P1A — OKF v0.2 Adoption + Gap Audit**, Workstream A (OKF adoption) in
progress. Workstream B (90-dimension gap audit) begins only once Workstream
A's no-regression gate passes — see the Phase 1A sub-receipts.

## Next gate

**P02 — System Specification.**
Entry condition: the Phase 1A receipt (both sub-receipts) reports `STATUS:
PASS`, CI green, and Workstream B's spec/benchmark deltas are reconciled into
this repository's governing documents.

**Phase 2 has NOT started.**

## Operational tracking (from ADR-0008)

Every `.context/` record is currently `unverified` — a truthful starting
state immediately after the OKF migration, not yet a problem. Track the
`unverified` fraction reported by `context-staleness-validator`
(`pnpm validate` stats) at each phase boundary. If it has not decreased after
several phases, that is itself a finding: the `verified` mechanism exists but
nobody is using it, and ADR-0008's revisit trigger applies — reconsider
whether verification should become a phase-receipt requirement.

## Known gaps carried forward

| Gap                                  | Owner phase | Rationale                                                                                                                                                                                                              |
| ------------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| workerd / Workers runtime smoke test | P17         | Adding wrangler in Phase 0 is scope creep. Substitute proof in place: the static `node:*` import ban plus dist execution touching no Node-only globals. Real proof requires a runtime adapter, which is Phase 17 work. |
| Store interfaces as TypeScript       | P04 / P07   | Captured as specs in `specs/persistence/` rather than code. Writing them as interfaces is SDK surface, which Phase 0 prohibits. See ADR-0006.                                                                          |
| Coverage threshold                   | P03         | Too little code exists for a threshold to be meaningful. Derive from a measured baseline once real contracts land.                                                                                                     |
| TypeScript 7 upgrade                 | gated       | Blocked on typescript-eslint support. See ADR-0003.                                                                                                                                                                    |
| OKF v0.3 field changes               | gated       | Re-query SPEC.md at each phase boundary alongside the TypeScript gate. See ADR-0007.                                                                                                                                   |
| `.context/` verification backlog     | ongoing     | See "Operational tracking" above. See ADR-0008.                                                                                                                                                                        |

## Deferred decisions

- Package split beyond `contracts` — deferred until a real dependency cut
  exists, per the creation rule in `docs/architecture/PACKAGE-MAP.md`.
- Local persistence implementation (SQLite / filesystem) — constrained by
  ADR-0006, implemented in Phase 4.
- `packages/compatibility/` — declared in the roadmap for Workstream B's
  portability work, not created; same creation rule as above.
