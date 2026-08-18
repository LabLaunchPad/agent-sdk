---
type: Research Consolidation Report
title: Architecture Freeze Candidate
description: What is frozen, flexible, experimental, deferred, or rejected after Phase 1B's ADR consolidation — a bounded baseline, not a permanent lock
sources:
  - resource: /research/reconciliation/BOUNDARY-RECONCILIATION.md
    id: boundaries
  - resource: /research/reconciliation/DECISION-CONSOLIDATION.md
    id: decisions
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
---

# Architecture Freeze Candidate

A freeze is a bounded decision baseline, not a permanent lock — every item
below has a named revisit trigger in `RESEARCH-REOPEN-GATES.md` or its own
ADR.

## Frozen (ADR rank, `status: stable`)

- ADR-0009 — Protocol/Application/Agent state distinction
- ADR-0010 — Durability & Checkpoint boundary (amends `specs/persistence/STORE-INTERFACES.md`)
- ADR-0011 — `UNKNOWN_OUTCOME` as a first-class side-effect state
- ADR-0012 — Workspace & Sandbox as explicit boundaries
- ADR-0013 — Security enforcement at the Policy/Capability boundary
- ADR-0014 — Model Gateway capability & semantic-portability contract
- ADR-0015 — Human-in-the-loop as a workflow contract
- ADR-0016 — Runtime-assumption corrections

Plus the 14 `KEEP` boundaries already frozen at Phase 0/`PACKAGE-MAP.md`
rank, unchanged by this phase: AgentKernel, CapabilityEngine, PolicyEngine,
ContextEngine, Runtime, StateEngine, MemoryEngine, WorkflowEngine,
ProtocolAdapters, MCPAdapter, A2AAdapter, ModelRegistry, EvaluationEngine,
ObservabilityEngine.

## Still flexible (bound in principle, not in implementation detail)

Every ADR above binds a _contract requirement_, not an implementation.
Phase 2 spec work and the phases named in each ADR's header table still
choose the concrete shape: exact `CheckpointStore` retention-policy API
(ADR-0010), exact Workspace capability-declaration schema (ADR-0012),
exact capability-matrix format (ADR-0014). The boundary is frozen; the
interface inside it is not.

## Experimental (evidence-backed, zero E5 confirmation)

Everything in this phase and every prior research corpus. Every ADR's
Evidence section cites E3/E4 documentation, not E5 reproduction — this
phase's own `E5-DURABLE-RESTART` (see `research/benchmarks/E5-RESULT.md`)
is the first execution against any of it. Treat every ADR as
experimentally-grounded, not empirically proven, until its own revisit
trigger's falsifying experiment actually runs.

## Deferred (named, with a trigger — not silently dropped)

`KnowledgeEngine`, `EventModel`, `ReplayEngine`, `InstructionSkillEngine`
boundaries; `defer-default-multiagent-hierarchy` decision. See
`RESEARCH-REOPEN-GATES.md` for each one's specific trigger.

## Explicitly rejected

Nothing in this phase's scope was rejected outright — every boundary that
reached this reconciliation with real cross-corpus evidence found a home
(`KEEP`, `ADAPT`, `EXTERNALIZE`, or bound `ADD_CANDIDATE`). The nearest
thing to a rejection is `post-commit-ops`'s `DEFER` outcome (not adopted
now, not rejected as an idea — see `POST-COMMIT-OPS-DECISION.md`) and the
deliberate non-research of Volcengine/Baidu this phase (not rejected,
simply not yet decision-relevant — see `RESEARCH-REOPEN-GATES.md`).

## What E5 may still invalidate

`E5-DURABLE-RESTART` tests the SQLite-checkpoint-survives-kill premise
underneath ADR-0010. A negative result would not invalidate the ADR's
_boundary_ decision (durability still belongs on `CheckpointStore`, not a
separate package) but would invalidate its _evidence basis_ for treating
SQLite as a safe first-class local backend — see ADR-0010's own Revisit
trigger. Every other ADR's falsifying experiment (named in each
Adversarial review section) remains unrun and could, in principle,
invalidate that ADR's specific claim without touching the others — the
ADRs are independent enough that one failing does not cascade.
