---
type: Research Consolidation Report
title: First E5 Selection
description: Why durable-restart was chosen as this phase's first real E5 reproduction, over the other named candidates
sources:
  - resource: /research/canonical/canonical-research.json
    id: canonical
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
---

# First E5 Selection

Selected using the operating prompt's own formula: `information_gain ×
architectural_impact × uncertainty / execution_cost`. Not run automatically
against every named candidate — one is chosen and justified.

## Candidates considered

| Candidate                                    | Information gain                                                                                 | Architectural impact                                                         | Execution cost                                                                                                                                   | Why not selected                                                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **Durable restart** (`BEN-DURABLE-RESTART`)  | High — most-referenced unexecuted benchmark in the graph (`E5-A` wave1, `BM-DURABLE-001` batch3) | High — directly feeds ADR-0010                                               | **Low** — no SDK implementation needed, tests an environmental claim with generic Node.js + SQLite                                               | **Selected**                                                                                               |
| Side-effect `UNKNOWN_OUTCOME` reconciliation | High (feeds ADR-0011)                                                                            | High                                                                         | High — requires a real network-facing capability with a genuine timeout/reconciliation path; no such capability exists yet (Phase 8/9 unstarted) | Deferred — needs Phase 8/9 implementation to run honestly                                                  |
| Tool-output injection (`BEN-TOOL-INJECTION`) | High (feeds ADR-0013)                                                                            | High                                                                         | High — requires a real capability/policy implementation to inject against; testing against nothing would produce a meaningless result            | Deferred — named explicitly in ADR-0013's own Revisit trigger as the right test once implementation exists |
| Sandbox boundary (`BEN-SANDBOX-BOUNDARY`)    | Medium (feeds ADR-0012)                                                                          | Medium                                                                       | High — requires an actual sandbox mechanism (Docker/Firecracker/Wasmtime) to test against; none implemented                                      | Deferred                                                                                                   |
| Model portability (`BEN-MODEL-PORTABILITY`)  | Medium (feeds ADR-0014)                                                                          | Medium                                                                       | Medium-High — requires live model/provider API calls across multiple providers, real cost and external dependency                                | Deferred — no urgency this phase, no model gateway implementation exists to compare against                |
| Context compression                          | Low-Medium                                                                                       | Low (no ADR currently depends on it)                                         | Medium                                                                                                                                           | Deferred — no blocking decision                                                                            |
| Single-vs-workflow-vs-multi-agent            | Low                                                                                              | Low (`defer-default-multiagent-hierarchy` already deferred on other grounds) | High                                                                                                                                             | Deferred                                                                                                   |

## Why durable-restart wins on execution cost specifically

Every other candidate requires _some_ Phase 2+ implementation surface to
test against — a capability, a sandbox, a model gateway. Durable-restart
does not: "does a SQLite-backed checkpoint survive a hard kill mid-write"
is a claim about SQLite and the operating system, not about LabLaunchPad's
own code. It can be tested with a throwaway script outside any
`@lablaunchpad/*` package, honoring Phase 0's still-binding "zero product
logic before Phase 2" rule while still producing a real, reproducible
result that feeds ADR-0010's evidence base.

## Selected: durable restart

See `E5-DURABLE-RESTART.md` for the harness design and `E5-RESULT.md` for
the actual, executed result.
