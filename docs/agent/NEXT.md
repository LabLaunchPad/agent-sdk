# NEXT

Queued work. Nothing here may start before its gate opens.

## Current phase

**P1A — OKF v0.2 Adoption + Gap Audit**, Workstream B (research), installment 1
complete. Workstream A passed its no-regression gate (CI green, run #4,
commit fb615ed) — see `docs/agent/RECEIPT-P1A-WORKSTREAM-A.md`. Workstream
B's concrete scope is recorded in `docs/agent/NOW.md`'s scope-reconciliation
note, superseding the earlier abstract 90-dimension sketch.

## Next gate

**Workstream B, installment 3** — research the remaining 11 sources
(`.context/research/gaps.json`), prioritized Volcengine AgentKit and Baidu
AppBuilder SDK next (completing the primary local-first-relevant set), then
LangGraph/Mastra, then the protocol layer (MCP/A2A/Agent Skills).

**P02 — System Specification.**
Entry condition: Workstream B's research is judged sufficient to derive the
LabLaunchPad target architecture and spec/benchmark deltas the operating
prompt calls for, and those deltas are reconciled into this repository's
governing documents.

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
