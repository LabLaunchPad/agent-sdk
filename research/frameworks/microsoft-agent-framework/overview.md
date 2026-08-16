---
type: Framework Research
title: Microsoft Agent Framework
description: Agent/Harness/Workflow layering, checkpointing and licensing for Microsoft Agent Framework
sources:
  - resource: https://commandline.microsoft.com/agent-framework-layered-sdk-loops-workflows-harnesses/
    id: maf-layers
  - resource: https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints
    id: maf-checkpoints
  - resource: https://github.com/microsoft/agent-framework
    id: maf-repo
generated:
  by: process:claude-code-session
  at: 2026-08-16T00:00:00Z
status: draft
x_evidence_level: E3
x_coverage: partial
---

# Microsoft Agent Framework

> **Coverage note.** This installment covers the Agent/Harness/Workflow
> layering and checkpointing. Local-first posture, full capability
> inventory, and licensing text were not directly confirmed from the primary
> LICENSE file in this pass (see Open questions) — do not treat the license
> classification below as verified.

## Layering [E3, maf-layers]

Three distinct layers, each with a stated, non-overlapping responsibility:

- **Agent loop** (foundation): the core reasoning cycle — receive input,
  reason over context, decide, optionally call tools, observe, repeat until
  done.
- **Harness** (runtime environment): wraps an agent with "tools, context,
  memory, planning, middleware, permissions, and other runtime services,"
  turning "an agent from a model-driven conversation into a capable
  long-running application component."
- **Workflow** (orchestration): structured multi-step patterns —
  "sequential flows, handoffs, author/critic loops" — for scenarios needing
  "predictable steps, explicit control flow, or repeatable business logic."

The stated reasoning for keeping these separate: developer teams need
**flexibility, structure, openness and control**, and the layering lets a
team "choose the right architecture for the job" across "simple assistants,
complex multi-agent systems, and structured enterprise processes within one
coherent model."

**This is the strongest external confirmation available for the
LabLaunchPad Agent/Harness/Workflow split already recorded in
`docs/architecture/PACKAGE-MAP.md`** — an independent production framework
reached the same three-way division for materially the same reason (let a
minimal agent stay minimal; let complexity be opt-in).

## Checkpointing [E3, maf-checkpoints]

Checkpoints are created at the end of each **superstep** — after all
executors in that superstep complete. A checkpoint captures the entire
workflow state: every executor's current state, all pending messages for
the next superstep, pending requests/responses, and shared state. Stated use
cases: crash recovery for long-running workflows, pause/resume across time,
periodic saves for audit/compliance, and migration across environments.
Storage is pluggable — `CosmosCheckpointStorage` (Azure Cosmos DB) is one
documented backend, implying others exist behind the same interface.

**This is E3-level confirmation of the superstep-boundary checkpoint
pattern** relevant to this repository's own State Gate requirements
(persistence + migration + recovery + concurrency).

## LabLaunchPad extraction

| Pattern                                              | Adopt / Adapt / Reject                               | Rationale                                                                                                                                                  |
| ---------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agent / Harness / Workflow as three separable layers | **ADOPT** (pattern only, re-specified independently) | Two independent production systems (this and LabLaunchPad's own prior design) converge on the same boundary — strong signal, not proof, but strong         |
| Checkpoint at superstep boundary, pluggable storage  | **ADOPT** (pattern only)                             | Directly informs `specs/persistence/STORE-INTERFACES.md`'s `CheckpointStore` — matches the "state must survive restart" requirement already recorded there |

## Open questions

- **License**: search results point to MIT for `microsoft/agent-framework`
  and confirm it for the _Samples_ repository specifically, but the primary
  repository's own LICENSE file was not directly fetched and verified in
  this pass. Marked `LICENSE_UNKNOWN` pending direct verification — do not
  cite as fact.
- Whether Agent can run with zero Harness (minimal mode) is asserted by
  framing but not explicitly confirmed by direct quote — INFERENCE, not
  FACT.
- Local-first execution posture (local model support, offline capability) —
  not yet researched.
- Full built-in capability inventory (tools, MCP, memory) — not yet
  researched.
