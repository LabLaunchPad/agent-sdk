# NEXT

Queued work. Nothing here may start before its gate opens.

## Current phase

**Phase 2 — Kernel Constitution + E5-02 (UNKNOWN_OUTCOME), spec-prep
complete.** See `docs/agent/NOW.md`'s Phase 2 section and
`.context/research/reconciliation/phase-gate.json`'s `phase_2_gates` for
the full result (`GATE_A_SPEC` PASS, `GATE_B_E5_02` PASS_SIMULATED,
`GATE_C_HARNESS` PARTIAL, `GATE_D_GOVERNANCE` PASS). Structured receipt:
`.context/evidence/phase-2-kernel-receipt.json`. Before it: **Phase 1B —
Architecture Reconciliation & ADR Freeze**, complete (`ADR_GATE`/
`BOUNDARY_GATE`/`ACTION_GATE`/`CONTEXT_GATE` PASS; `E5_GATE`/`SPEC_GATE`
PARTIAL — see `docs/agent/NOW.md`'s Phase 1B section). Before that: **P1A
— OKF v0.2 Adoption + Gap Audit**, Workstream B (research). Workstream A
passed its no-regression gate (CI green, run #4, commit fb615ed) — see
`docs/agent/RECEIPT-P1A-WORKSTREAM-A.md`.

## Next gate

**Phase 2 implementation stays LOCKED.** Per `phase-gate.json`'s
`phase_2_gates.lock_state_after_this_phase`: `PHASE_2_SPEC_PREP:
COMPLETE_FOR_THE_7_SCOPED_MODULES`, `PHASE_2_IMPLEMENTATION: LOCKED`,
`BROAD_RESEARCH: LOCKED`, `NEW_ADR_CREATION: TRIGGER_ONLY`. Spec-prep for
the 7 `ACTIVE_THIS_PHASE` modules (M01 State, M02 Durability, M03 Side
Effects, M04 Capability, M05 Policy, M15 Observability, M16 Contracts) is
done to the depth `docs/architecture/KERNEL-CONSTITUTION.md`, E5-02, and
now E5-08 required — the other 13 modules stay `GOVERNED`, not queued.
Writing real `@lablaunchpad/*` kernel code is **not** unblocked by this
phase; no runtime package was created.

**Resolved, no longer queued** (2026-08-18): `E5-08` (Policy/Capability
Bypass) ran SIMULATED — `kernel-core.json`'s `ADV-12`/`ADV-13`/`ADV-14`
are `EXECUTED`, 11/15 total (was 8/15). See `docs/agent/NOW.md`'s "Phase
8/9 prep" section and `research/benchmarks/E5-08-RESULT.md`. This does
**not** fully satisfy `E5-08`'s own named trigger ("Phase 8/9
PolicyEngine/CapabilityEngine exists") — recorded `PASS_SIMULATED`, not
closed. The concrete next E5-worthy gate is `E5-04` (Duplicate Operation)
or re-running `E5-08` against a **real** (not SIMULATED) Phase 8/9
`PolicyEngine`/`CapabilityEngine` once one exists — not triggered yet.
`kernel-core.json`'s remaining gaps: `ADV-09`/`ADV-10`/`ADV-11` (illegal-
transition/duplicate-event/reordered-event — need a real state-machine
Guard/Event-log model, section 1, Phase 4+), `ADV-15` (schema-version-
mismatch — needs Phase 4's second real schema version). Sections 5
(Evidence/Verdict) and 6 (Agent/workflow boundary) still have no
dedicated adversarial case at all — unchanged, still a real logged gap.

The 40-dimension checklist is now built as a tool
(`research/methodology/FRAMEWORK-RESEARCH-DEPTH-CHECKLIST.md`) — its full
application across the existing framework set remains explicitly
deferred as a `BROAD_RESEARCH`-locked item, not silently implied done.

**Resolved, no longer queued** (2026-08-18): Volcengine AgentKit and Baidu
AppBuilder SDK are now researched (`CLOUD_ONLY`, local-first/licensing/
model-coupling depth) — the original 17-source brief is 17/17. PydanticAI/
Kimi Agent SDK deepening passes and the token/context-efficiency and UX/DX
audit files are also done. See `docs/agent/NOW.md`'s "Volcengine AgentKit
/ Baidu AppBuilder SDK closed" section and
`research/imported-corpus/SOURCE-RECEIPT-5.md`.

Still queued, lower priority: comparative network-disabled testing.

**Resolved in Phase 1B, no longer queued**: `GAP-ARCHITECTURE-RECONCILIATION`
(P0) — the formal ADR-writing pass over the accumulated ADR-CANDIDATEs is
done (`ADR-0009`–`ADR-0016`; see `research/reconciliation/DECISION-
CONSOLIDATION.md`). The delete-test's own first-pass count of "25 candidate
boundaries" (`research/canonical/ARCHITECTURE-DECISIONS.md`) was itself
corrected to the actual **27** during Phase 1B — see
`research/reconciliation/BOUNDARY-RECONCILIATION.md`'s frontmatter
correction note. `GAP-E5-ZERO` (P0) is **partially** addressed, not closed
— `E5-DURABLE-RESTART` and `E5-02-UNKNOWN-OUTCOME` both executed clean
(the latter SIMULATED), 8 more named benchmarks remain `NOT_RUN`; still
requires further runnable implementation surfaces, not desk research, to
close further.

**Still lower priority, unchanged**: independent re-verification (live
WebFetch/WebSearch) of the imported supplementary corpora (batch 1, batch
2, batch 3, wave1 — 14 frameworks + 5 topics total, all currently
`DOCUMENTED_NOT_REPRODUCED`).

**Phase 2 spec-preparation is done for its 7 scoped modules. Phase 2/3
implementation has NOT started.** `GAP-E5-ZERO` is now 2/14+ (was 1/14+
entering this phase) — `E5-DURABLE-RESTART` (scope-corrected) and
`E5-02-UNKNOWN-OUTCOME` (new, SIMULATED) are both real, executed results;
8 more named benchmarks remain `NOT_RUN`, each gated on a real
implementation surface.

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
