---
type: Research Consolidation Report
title: E5 Ladder
description: The full E5 reproduction roadmap (E5-01 through E5-14), each rung's trigger and the ADR it feeds — a registry, not a queue to execute in one pass
sources:
  - resource: /research/benchmarks/E5-RESULT.md
    id: e5-01
  - resource: /.context/research/reconciliation/phase-gate.json
    id: phase-gate
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
---

# E5 Ladder

Every rung below is real, named, and has a real trigger — not "do it
later." A rung only executes when its trigger fires, matching the same
research-budget discipline applied to the M01–M20 module registry.

| Rung  | Name                                           | Status                                     | Feeds                                                   | Trigger                                                                        |
| ----- | ---------------------------------------------- | ------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------ |
| E5-01 | Durable Restart                                | `PASS, scope-limited` — see `E5-RESULT.md` | ADR-0010                                                | Already fired (Phase 1B)                                                       |
| E5-02 | `UNKNOWN_OUTCOME` / side-effect reconciliation | `IN_PROGRESS` — this phase                 | ADR-0011                                                | Already fired (this phase)                                                     |
| E5-03 | Replay Determinism                             | `NOT_RUN`                                  | Kernel state-machine algebra (`KERNEL-CONSTITUTION.md`) | A real state-machine implementation exists to replay against                   |
| E5-04 | Duplicate Operation                            | `NOT_RUN`                                  | ADR-0011                                                | Partially exercised by E5-02's simulator; full version needs a real capability |
| E5-05 | Concurrent Runs                                | `NOT_RUN`                                  | `@lablaunchpad/state` concurrency model                 | `StateStore` implementation exists (Phase 4)                                   |
| E5-06 | Checkpoint Corruption                          | `NOT_RUN`                                  | ADR-0010                                                | A real `CheckpointStore` implementation exists to corrupt (Phase 4)            |
| E5-07 | Schema Migration                               | `NOT_RUN`                                  | ADR-0010, `specs/persistence/STORE-INTERFACES.md`       | A second schema version of a real persisted record exists (Phase 4)            |
| E5-08 | Policy/Capability Bypass                       | `NOT_RUN`                                  | ADR-0013                                                | A real `PolicyEngine`/`CapabilityEngine` implementation exists (Phase 8/9)     |
| E5-09 | Sandbox Boundary                               | `NOT_RUN`                                  | ADR-0012                                                | A real `SandboxProvider` implementation exists (Phase 19)                      |
| E5-10 | Tool Output Injection                          | `NOT_RUN`                                  | ADR-0013 (named explicitly in its own Revisit trigger)  | A real capability/policy implementation exists to inject against               |
| E5-11 | MCP Failure                                    | `NOT_RUN`                                  | ADR-0009                                                | A real `MCPAdapter` implementation exists (Phase 18)                           |
| E5-12 | A2A Failure                                    | `NOT_RUN`                                  | ADR-0009                                                | A real `A2AAdapter` implementation exists (Phase 18)                           |
| E5-13 | Model Provider Failure                         | `NOT_RUN`                                  | ADR-0014                                                | A real Model Gateway implementation exists (Phase 16)                          |
| E5-14 | Cross-runtime Recovery                         | `NOT_RUN`                                  | ADR-0016                                                | A second `RuntimeAdapter` implementation exists (Phase 17)                     |

## Reading this table correctly

This is a **registry**, not a backlog to work through top to bottom. Each
`NOT_RUN` rung stays `NOT_RUN` until its named trigger fires — almost all
of them require a real implementation surface that doesn't exist yet.
Running one out of sequence, before its trigger, would produce the same
kind of uninformative result E5-01's own first (uncorrected) run did
before its harness was fixed: a test that technically executes but
doesn't test what it claims to.
