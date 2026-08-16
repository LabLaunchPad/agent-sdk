# NEXT

Queued work. Nothing here may start before its gate opens.

## Next gate

**P01 — Research Grounding.**
Entry condition: Phase 0 receipt reports `STATUS: PASS` with all exit criteria
met and CI green.

Phase 1 extracts architectural patterns from the current agent ecosystem into
`research/`. It produces no production implementation.

**Phase 1 has NOT started.**

## Known gaps carried forward

| Gap                                  | Owner phase | Rationale                                                                                                                                                                                                              |
| ------------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| workerd / Workers runtime smoke test | P17         | Adding wrangler in Phase 0 is scope creep. Substitute proof in place: the static `node:*` import ban plus dist execution touching no Node-only globals. Real proof requires a runtime adapter, which is Phase 17 work. |
| Store interfaces as TypeScript       | P04 / P07   | Captured as specs in `specs/persistence/` rather than code. Writing them as interfaces is SDK surface, which Phase 0 prohibits. See ADR-0006.                                                                          |
| Coverage threshold                   | P03         | Too little code exists for a threshold to be meaningful. Derive from a measured baseline once real contracts land.                                                                                                     |
| TypeScript 7 upgrade                 | gated       | Blocked on typescript-eslint support. See ADR-0003.                                                                                                                                                                    |

## Deferred decisions

- Package split beyond `contracts` — deferred until a real dependency cut
  exists, per the creation rule in `docs/architecture/PACKAGE-MAP.md`.
- Local persistence implementation (SQLite / filesystem) — constrained by
  ADR-0006, implemented in Phase 4.
