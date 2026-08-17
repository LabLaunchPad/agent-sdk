---
type: Architecture Decision
title: Human-in-the-Loop as a Workflow Contract
description: HITL is workflow semantics — checkpointing plus an explicit pause/resume contract on @lablaunchpad/workflow — not a separate HumanControlLayer package
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: stable
---

# ADR-0015 — Human-in-the-Loop as a Workflow Contract

| Field      | Value          |
| ---------- | -------------- |
| Phase      | P12 (Workflow) |
| Supersedes | —              |

## Context

Microsoft Agent Framework documents its three-layer split (Agent / Harness
/ Workflow, `CLM-MAF-001`) with checkpointing and human-in-the-loop
presented together as Workflow-layer semantics, not as a separate
subsystem (`research/canonical/canonical-research.json`'s `architecture[]`
entry for `HumanControlLayer`, disposition `ADAPT`). No independent
research source in this corpus proposes HITL as a standalone boundary —
every source that discusses it treats it as an extension of durable,
checkpointable workflow execution: a workflow pauses at a defined point,
persists its state (the same `CheckpointStore` contract ADR-0010
establishes), and resumes on external input.

## Decision

`HumanControlLayer` is not a standalone package. Human-in-the-loop is a
required contract element of `@lablaunchpad/workflow`: any workflow step
may declare a pause point, at which the workflow's state is checkpointed
(via the same `CheckpointStore` contract as any other durable resume),
execution suspends pending external input, and resume is treated exactly
like any other checkpoint-resume — not a special-cased control-flow
mechanism. This ties HITL directly to ADR-0010's durability contract
rather than inventing a parallel pause/resume mechanism specific to human
input.

## Adversarial review

**Attack:** human-in-the-loop has properties ordinary checkpoint/resume
doesn't need to worry about — timeout/expiry of a pending human decision,
notification/escalation if no one responds, and potentially multiple
candidate approvers — treating it as "just another checkpoint" may
under-specify these.

**Failure modes:** if HITL-specific concerns (timeout, escalation,
multi-approver) can't be expressed cleanly as workflow-level checkpoint
metadata, this ADR's minimalism becomes a real gap during Phase 12
implementation, not just an aesthetic simplification.

**Falsifying experiment:** during Phase 12, implement one workflow with an
approval step that includes a timeout and an escalation path. If
expressing that requires bypassing the standard checkpoint/resume contract
rather than extending it with metadata, this decision should be revisited
in favor of a dedicated pause-point contract distinct from durability
checkpointing.

## Alternatives considered

| Alternative                                                            | Why rejected                                                                                                                                                                          |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A standalone `HumanControlLayer` package                               | No research source proposes this as an independent boundary; fails the delete-test — nothing distinguishes it from workflow-level pause/resume except who provides the resuming input |
| A HITL-specific pause/resume mechanism separate from `CheckpointStore` | Duplicates the durability contract ADR-0010 already establishes for exactly the same underlying need (suspend, persist, resume)                                                       |

## Consequences

Easier: workflow authors get one pause/resume mechanism for both
system-driven and human-driven suspension, rather than two to learn.
Harder: HITL-specific needs (timeout, escalation, multi-approver) must be
expressed as extensions to the general checkpoint/resume contract rather
than getting a purpose-built mechanism, which may prove awkward in
practice (see Adversarial review). Forecloses: a Phase 12 design that
treats human approval as architecturally distinct from any other durable
pause point.

## Revisit trigger

When Phase 12 implementation finds HITL-specific requirements (timeout,
escalation, multi-approver selection) genuinely don't fit as checkpoint
metadata and need dedicated workflow-engine mechanics.

## Evidence

`research/frameworks/microsoft-agent-framework/overview.md`
(`CLM-MAF-001`, `CLM-MAF-004`); `research/canonical/canonical-research.json`
`architecture[]` entry for `HumanControlLayer`; ADR-0010 (this phase).
