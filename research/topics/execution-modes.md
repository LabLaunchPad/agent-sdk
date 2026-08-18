---
type: Topic Research
title: Execution Modes and Replay Envelope
description: Chat/Agent/Workflow/Engineering-agent execution-mode taxonomy, a replay-envelope/fixture technique, and a native-code escalation heuristic — extracted from a user-supplied Knowledge OS package as non-binding reference material
sources:
  - resource: knowledge-os/06-agent-sdk/execution-modes.md
    id: package-execution-modes
  - resource: knowledge-os/06-agent-sdk/determinism-model.md
    id: package-determinism-model
  - resource: knowledge-os/06-agent-sdk/engineering-agent-model.md
    id: package-engineering-agent-model
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_evidence_level: E2 — a third-party synthesis, not independently verified against external primary sources; treat as a candidate technique, not a decision
x_provenance: extracted from a user-supplied "Decision Operating System / Knowledge OS" package (87e35b47-decision_operating_system_knowledge_os_complete.zip), evaluated in research/reconciliation/KNOWLEDGE-OS-RECONCILIATION.md
---

# Execution Modes and Replay Envelope

**Status: reference material for Phase 4+ implementation. Not binding,
not part of `docs/architecture/KERNEL-CONSTITUTION.md`, and not a
decision.** The kernel constitution's 10 primitives
(Identity/Task/Run/State/Operation/Capability/Policy/Checkpoint/Evidence/
Verdict) remain the canonical kernel spec. Nothing here introduces a
competing primitive set — see the Disposition table in
`research/reconciliation/KNOWLEDGE-OS-RECONCILIATION.md` for what was
explicitly rejected from the same source package (an 8-primitive "core
semantics" that collides with kernel `Capability`/`Evidence` naming).

## Execution-mode taxonomy [E2, imported]

A product-surface categorization, not a kernel concept: the same
underlying `AgentLoop`/`Run` machinery can be exposed through different
interaction shapes.

- **Chat** — conversational, turn-by-turn, human-in-the-loop by default.
- **Agent** — autonomous `AgentLoop` execution over a bounded task, per
  `KERNEL-CONSTITUTION.md` section 6's `MODEL PROPOSES → KERNEL VALIDATES
→ POLICY AUTHORIZES → RUNTIME EXECUTES` flow.
- **Workflow** — multi-step orchestration with explicit control flow,
  matching `KERNEL-CONSTITUTION.md` section 6's `Workflow/Graph` layer,
  which "may host an `AgentLoop` as one of its steps."
  - **Engineering-agent** — a workflow specialization for software-
    engineering tasks specifically (read → plan → implement → verify →
    PR), closer in shape to this repository's own `AGENTS.md` phase loop
    than to a generic workflow.

Worth considering, when a runtime/adapter layer is actually built
(Phase 12+ per `docs/architecture/PACKAGE-MAP.md`'s roadmap), as a
taxonomy for documenting which execution surfaces a given adapter
supports — not as a new architectural boundary.

## Replay envelope concept [E2, imported]

A concrete technique for the determinism invariant already stated in
`KERNEL-CONSTITUTION.md` section 1 ("same state + same event + same
deterministic input ⇒ same transition result"): bundle everything a
`Replay` needs into one envelope, rather than assuming ambient
reproducibility.

Proposed envelope contents: `State` + the `Event` history since the last
`Checkpoint` + a model-response fixture (the exact model output(s) that
drove the original run) + tool-call fixtures (exact tool inputs/outputs)

- the `Policy` version in effect + a workspace snapshot + a controlled
  clock/random source.

This is a real, testable idea for how a future `Replay` implementation
(Phase 4+) could actually satisfy the determinism invariant against
non-deterministic inputs (model calls, tool calls, wall-clock time) —
worth evaluating as an implementation technique when that phase starts,
not adopted as a spec change now. `.context/scenarios/kernel-core.json`'s
`ADV-07` (`replay-determinism`) already tests a narrower version of this
idea (byte-identical reconciliation from two independent DB snapshots) —
a full envelope including model/tool fixtures would be a meaningfully
larger E5 case, not yet named in `research/benchmarks/E5-LADDER.md`.

## Native-code escalation heuristic [E2, imported]

"Rust only after a measured bottleneck, not by default." An engineering
heuristic, orthogonal to the kernel spec: escalate to a systems-language
implementation of a hot path only once a real benchmark demonstrates the
TypeScript/Node implementation is the actual bottleneck, not
speculatively. Consistent with this repository's existing minimalism
rules (`docs/architecture/PACKAGE-MAP.md`'s package-creation rule: only
create a package for a proven dependency cut) but stated here as a
distinct rule about language choice, not package boundaries. Worth
keeping in mind for `WASM only after benchmark evidence` (an item already
named in the user's own earlier Socratic-planning-coverage input,
`docs/agent/DECISIONS.md`'s corresponding entry) — same principle,
applied to a different escalation axis.
