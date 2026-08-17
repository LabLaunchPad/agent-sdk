---
type: Framework Research
title: ADR Candidates — Current Wave
description: 'ADR candidates: ADR Candidates — Current Wave, imported from the "current wave" research corpus'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus ("current wave"), URLs not independently re-verified via WebFetch/WebSearch in this session - treat as DOCUMENTED_NOT_REPRODUCED
---

# ADR Candidates — Current Wave

## ADR-CANDIDATE-001 — First-class durable workflow subsystem

**Decision:** INVESTIGATE -> ADOPT candidate.
**Why:** Microsoft makes graph workflows + checkpointing a first-class semantic layer; OpenAI separates agent loop from sessions/sandboxes.
**Risk:** added runtime complexity.
**Benchmark:** E5-A + E5-H.
**Revisit:** if durable tasks remain low-value for target workloads.

## ADR-CANDIDATE-002 — MCP as stateless protocol adapter

**Decision:** ADOPT.
**Why:** current MCP revision is explicitly stateless at core and adds routing/caching/MRTR.
**Risk:** older MCP implementations may retain session assumptions.
**Benchmark:** protocol compatibility tests.

## ADR-CANDIDATE-003 — A2A remote-agent trust boundary

**Decision:** ADOPT adapter, reject shared-state coupling.
**Why:** A2A defines opaque remote agents with Agent Cards, Tasks and Artifacts.
**Benchmark:** task lifecycle + auth + malicious peer tests.

## ADR-CANDIDATE-004 — Explicit Workspace/Sandbox contracts

**Decision:** ADOPT.
**Why:** current SDKs expose real workspace state, shell, files and snapshots.
**Risk:** platform variance.
**Benchmark:** E5-G + E5-E.

## ADR-CANDIDATE-005 — Source-to-sink security policy

**Decision:** ADOPT.
**Why:** prompt injection increasingly behaves like social engineering; capability containment is required even when detection fails.
**Benchmark:** E5-D.

## ADR-CANDIDATE-006 — Model capability matrix as release artifact

**Decision:** ADOPT.
**Why:** provider adapters explicitly warn that features differ.
**Benchmark:** E5-F.

## ADR-CANDIDATE-007 — UNKNOWN_OUTCOME as first-class mutation state

**Decision:** ADOPT.
**Why:** durable workflow systems require idempotency/reconciliation discipline for side effects.
**Benchmark:** E5-A + E5-H.
