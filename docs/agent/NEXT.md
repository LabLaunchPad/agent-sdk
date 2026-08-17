# NEXT

Queued work. Nothing here may start before its gate opens.

## Current phase

**Phase 1B — Architecture Reconciliation & ADR Freeze, complete.** See
`docs/agent/NOW.md`'s Phase 1B section and
`.context/research/reconciliation/phase-gate.json` for the full gate
result (`ADR_GATE`/`BOUNDARY_GATE`/`ACTION_GATE`/`CONTEXT_GATE` PASS;
`E5_GATE`/`SPEC_GATE` PARTIAL). Before it: **P1A — OKF v0.2 Adoption + Gap
Audit**, Workstream B (research), installment 3 complete. Workstream A
passed its no-regression gate (CI green, run #4, commit fb615ed) — see
`docs/agent/RECEIPT-P1A-WORKSTREAM-A.md`.

## Next gate

**Phase 2 spec-preparation may begin**, per `SPEC_GATE: PARTIAL` — the ADR/
boundary/action prerequisites are all clear, so spec/contract/invariant
work referencing `ADR-0009` through `ADR-0016` directly is unblocked. Full
architectural confidence stays gated on further E5 execution
(`E5_GATE: PARTIAL` — 1 of 10+ named benchmarks run) as Phase 8/9/12/16/
17/19 implementation surfaces come online; `BEN-TOOL-INJECTION` and
`BEN-SANDBOX-BOUNDARY` were explicitly deferred this phase for exactly
that reason, not forgotten.

Deferred, lower priority, still queued: Volcengine AgentKit and Baidu
AppBuilder SDK (`.context/research/gaps.json` — deliberately not
researched in Phase 1B since no pending ADR needs them; see
`research/reconciliation/RESEARCH-REOPEN-GATES.md` for the actual reopen
conditions). Also queued: PydanticAI/Kimi Agent SDK deepening passes, the
full 40-dimension checklist, comparative network-disabled testing, and the
token/context-efficiency and UX/DX audit files — all explicitly deferred
from installment 3, not dropped.

**Resolved in Phase 1B, no longer queued**: `GAP-ARCHITECTURE-RECONCILIATION`
(P0) — the formal ADR-writing pass over the accumulated ADR-CANDIDATEs is
done (`ADR-0009`–`ADR-0016`; see `research/reconciliation/DECISION-
CONSOLIDATION.md`). The delete-test's own first-pass count of "25 candidate
boundaries" (`research/canonical/ARCHITECTURE-DECISIONS.md`) was itself
corrected to the actual **27** during Phase 1B — see
`research/reconciliation/BOUNDARY-RECONCILIATION.md`'s frontmatter
correction note. `GAP-E5-ZERO` (P0) is **partially** addressed, not closed
— `E5-DURABLE-RESTART` executed clean, 9 more named benchmarks remain
`NOT_RUN`; still requires further runnable implementation surfaces, not
desk research, to close further.

**Still lower priority, unchanged**: independent re-verification (live
WebFetch/WebSearch) of the imported supplementary corpora (batch 1, batch
2, batch 3, wave1 — 14 frameworks + 5 topics total, all currently
`DOCUMENTED_NOT_REPRODUCED`).

**P02 — System Specification.**
Entry condition met for spec-preparation work: Phase 1B's ADR set exists
and is reconciled against `docs/architecture/PACKAGE-MAP.md`. See
`docs/agent/NOW.md`'s Phase 1B section and `SPEC_GATE: PARTIAL` in
`.context/research/reconciliation/phase-gate.json` for the precise scope
of what's unblocked (spec/contract preparation) versus what remains gated
(full confidence pending further E5 execution).

**Phase 2 spec-preparation may begin. Phase 2 implementation has NOT started.**

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
