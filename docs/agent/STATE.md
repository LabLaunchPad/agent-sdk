# STATE

Durable working state across phases. Refreshed at every phase boundary.

Structured equivalent: [`.context/state/`](../../.context/state/).
When this file and the JSON disagree, the JSON is the machine-readable record
and this file is the human summary — reconcile both before proceeding.

## Repository

| Field                      | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository                 | `LabLaunchPad/agent-sdk`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| npm namespace              | `@lablaunchpad/*`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Current phase              | Phase 2 — Kernel Constitution + E5-02 (spec-prep complete; implementation LOCKED)                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Phase status               | Phase 2 spec-prep complete for its 7 scoped modules (`GATE_A_SPEC` PASS, `GATE_B_E5_02` PASS_SIMULATED, `GATE_C_HARNESS` PARTIAL, `GATE_D_GOVERNANCE` PASS); implementation LOCKED. Preceded by Phase 1B: 8 binding ADRs (0009-0016), all 27 boundaries dispositioned, all 12 ACTION_REQUIRED items resolved, first E5 executed, post-commit-ops DEFERRED, 7th validator added. Before that P1A (OKF v0.2 Adoption + Gap Audit; the original 17-source brief is now closed 17/17) + 5 imported corpora + canonical consolidation |
| Canonical language         | TypeScript                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Canonical wire format      | JSON Schema                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Canonical knowledge format | OKF v0.2 (`.context/`, `research/`, `specs/`, `ADR/`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

## Toolchain baseline

| Component         | Pin                          |
| ----------------- | ---------------------------- |
| Node              | 24.19.0 (LTS Krypton)        |
| pnpm              | 10.33.0                      |
| TypeScript        | 6.0.3 (exact — see ADR-0003) |
| Vitest            | 4.1.10                       |
| ESLint            | 10.8.1                       |
| typescript-eslint | 8.67.0                       |
| Prettier          | 3.9.6                        |
| Zod               | 4.4.3                        |
| Ajv               | 8.20.0                       |
| Changesets        | 3.0.0                        |

## Materialized packages

| Package                    | Purpose                                               |
| -------------------------- | ----------------------------------------------------- |
| `@lablaunchpad/contracts`  | Placeholder. Schema harness only, no agent contracts. |
| `@lablaunchpad/repo-tools` | Private. The seven repository validators.             |

## Open commitments

- Phase 0 exit criteria all passed (CI green) — see [`RECEIPT-P00.md`](RECEIPT-P00.md).
- Workstream A's no-regression gate passed — see [`RECEIPT-P1A-WORKSTREAM-A.md`](RECEIPT-P1A-WORKSTREAM-A.md).
- Workstream B (gap audit): the original 17-source brief is now closed 17/17
  (Volcengine AgentKit and Baidu AppBuilder SDK researched 2026-08-18, both
  `CLOUD_ONLY`). 5
  supplementary research/governance corpora imported beyond the brief (14
  more frameworks + 5 topics + 1 governance bundle) — **now reconciled**:
  Phase 1B converted the accumulated ADR-CANDIDATEs into 8 binding ADRs
  (`ADR-0009`–`ADR-0016`). See [`NOW.md`](NOW.md) / [`NEXT.md`](NEXT.md)
  and `.context/research/gaps.json`.
- `research/canonical/` — a supplementary cross-corpus consolidation graph
  exists (status `PARTIAL`); does not supersede `.context/research/*.json`
  or the OKF markdown tree. `GAP-ARCHITECTURE-RECONCILIATION` is **resolved**
  (Phase 1B). `GAP-E5-ZERO` is **partially addressed** (2 of 14+ named
  benchmarks executed) — see `.context/research/reconciliation/phase-gate.json`.
- `TYPESCRIPT_7_REVISIT` gate is open — see ADR-0003.
- OKF v0.3 revisit gate is open — see ADR-0007.
- `.context/` verification backlog (all entries currently `unverified`) — see
  ADR-0008 and [`NEXT.md`](NEXT.md).
- workerd portability proof deferred to Phase 17 — see [`NEXT.md`](NEXT.md).
