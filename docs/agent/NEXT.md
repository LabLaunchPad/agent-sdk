# NEXT

Queued work. Nothing here may start before its gate opens.

## Current phase

**P1A — OKF v0.2 Adoption + Gap Audit**, Workstream B (research), installment 3
complete. Workstream A passed its no-regression gate (CI green, run #4,
commit fb615ed) — see `docs/agent/RECEIPT-P1A-WORKSTREAM-A.md`. Workstream
B's concrete scope is recorded in `docs/agent/NOW.md`'s scope-reconciliation
note, superseding the earlier abstract 90-dimension sketch.

## Next gate

**Workstream B, installment 4** — research the remaining **3** primary/protocol
sources (`.context/research/gaps.json`): Volcengine AgentKit and Baidu
AppBuilder SDK (completing the primary local-first-relevant set), then
Agent Skills (the last remaining protocol — MCP and A2A are now both
done, A2A closed via live research prompted by a user-supplied lead).
Also queued: PydanticAI/Kimi Agent SDK deepening passes, the full
40-dimension checklist, comparative network-disabled testing, and the
token/context-efficiency and UX/DX audit files — all explicitly deferred
from installment 3, not dropped.

**Also queued, lower priority**: independent re-verification (live
WebFetch/WebSearch) of three imported supplementary corpora — batch 1
(OpenHands, Letta, Google ADK, Browser Use, CrewAI), batch 2 (Strands
Agents, smolagents, AG2, LlamaIndex, Llama Agents, Haystack, DSPy,
AutoGen, Semantic Kernel), and batch 3 / "current wave" (2 new topics —
sandbox-execution, security-2026 — plus 3 refresh-check appendices), 14
frameworks + 2 topics total — and reconciliation of their combined 19
ADR-CANDIDATEs (6 in `.context/research/decisions.json` from batch 1, 6
in `research/decisions/ADR-CANDIDATE-*.md` from batch 2, 7 more from
batch 3) plus each batch's own `spec-delta.json`/`gap-delta.json` against
the existing locked architecture — and now also against the separately-
imported post-commit-ops governance bundle. All three research corpora
expand scope beyond the original 17-source brief and were not requested
by the operating prompt — queued because supplied, not because completing
them blocks the original brief's remaining 3 sources (Volcengine, Baidu,
Agent Skills). A2A is the one exception: it was pulled forward and
resolved live this session specifically because it closed a real brief
gap, not deferred with the rest.

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
