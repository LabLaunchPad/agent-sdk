---
type: Architecture Decision
title: Workspace & Sandbox as Explicit Architecture Boundaries
description: Workspace (capability surface) and Sandbox (isolation mechanism) are named, explicit contracts under adapters/tools, not implicit or bundled into CapabilityEngine
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: stable
---

# ADR-0012 — Workspace & Sandbox as Explicit Architecture Boundaries

| Field      | Value                                            |
| ---------- | ------------------------------------------------ |
| Phase      | P08 (Capability Registry), P19 (SandboxProvider) |
| Supersedes | —                                                |

## Context

Four independent sources converge on "workspace/sandbox needs to be an
explicit, named contract, not implicit": `SRC-BATCH1` (OpenHands, Browser
Use, Letta all make workspace/runtime boundaries an explicit contract),
this session's own live research (Mastra's Workspace —
`CLM-MASTRA-002`, the strongest match found anywhere to LabLaunchPad's
planned adapters/tools boundary, with per-tool approval gating; Youtu-
Agent's Environment), and `SRC-BATCH3` (the sandbox-execution topic's
Docker seccomp/rootless vs. Firecracker microVM vs. Wasmtime/WASI
tradeoff analysis) — `CTR-WORKSPACE-CONVERGENCE`.

`research/reconciliation/CURRENT-STATE-RECONCILIATION.md` §9 corrects this
session's own earlier framing: `docs/architecture/DEPENDENCY-DIRECTION.md`
already names `adapters/tools (browser/sandbox)` as a layer-4 category.
Sandbox already has a declared home; it has never had an elaborated
contract. Workspace does not yet have any declared home — it could
plausibly sit as a layer-1 `capabilities` concern (a policy-gated,
first-class concept, matching Mastra's own design) or as a layer-4
`adapters/tools` concern (a swappable implementation detail). This ADR
resolves that specific open question, which is the actual gap — not
"whether sandboxing exists at all."

## Decision

**Workspace** and **Sandbox** are two distinct, explicit contracts, not
one merged boundary and not folded silently into `CapabilityEngine`:

- **Workspace** is a layer-1 `@lablaunchpad/capabilities` concern: the
  declared, policy-gated surface of what an agent can touch (filesystem,
  command execution, search, skills), following Mastra's per-capability,
  per-tool approval model (`requireApproval`, `requireReadBeforeWrite`).
  It is _what_ is accessible and under what authorization.
- **Sandbox** is a layer-4 `adapters/tools/sandbox` concern: the
  _mechanism_ that isolates execution (container, microVM, WASI runtime).
  It is swappable independently of the Workspace contract above it —
  the same Workspace capability declaration must work whether the
  underlying isolation is Docker, Firecracker, or Wasmtime.

Neither is a standalone top-level package with its own dependency cut
distinct from `capabilities` (Workspace) or the existing `adapters/tools`
category (Sandbox) — both fail the delete-test as _new_ packages, but both
now have an explicit, elaborated contract where before they had none.

## Adversarial review

**Attack:** splitting Workspace (capability layer) from Sandbox
(execution layer) adds an indirection that most of the researched
frameworks don't bother with — OpenHands and Mastra both present a single
unified concept to their own users, not two.

**Failure modes:** if the Workspace/Sandbox split doesn't map cleanly onto
a real adapter implementation (e.g. a capability that can only be
expressed in terms of a specific sandbox's primitives), the two-layer
model adds ceremony without adding portability.

**Falsifying experiment:** implement one Workspace capability (filesystem
read/write with approval gating) against two different sandbox mechanisms
(a local process with OS-level restrictions, and a container) during
Phase 19. If the same Workspace contract cannot be satisfied by both
without leaking sandbox-specific details into the capability declaration,
the split is wrong and should be reconsidered.

## Alternatives considered

| Alternative                                                                 | Why rejected                                                                                                                                                                                                                                           |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| One merged `WorkspaceEngine` covering both capability and isolation         | Conflates a policy question (what's allowed) with a mechanism question (how it's isolated) — the sandbox-execution topic's own 3-way tradeoff (Docker/Firecracker/Wasmtime) shows the isolation mechanism is a genuinely independent axis of variation |
| Leave Sandbox as an unelaborated category in `adapters/tools`, no contract  | This is the status quo the 4-way convergence argues against — a named category with no contract gives implementers nothing to build against                                                                                                            |
| Treat Workspace as purely a layer-4 adapter concern, not layer-1 capability | Loses the policy-gating half of Mastra's own pattern (`requireApproval`), which is the part with the strongest direct evidence and the clearest security value                                                                                         |

## Consequences

Easier: sandbox implementations can be swapped (Docker → Firecracker)
without touching capability declarations; Workspace capabilities can be
policy-gated the same way regardless of execution mechanism. Harder: two
contracts to design and keep in sync instead of one; Phase 8 and Phase 19
now have an explicit dependency on each other's contract shape that a
single merged boundary would have avoided. Forecloses: an
`adapters/tools/sandbox` implementation that bakes in specific capability
semantics rather than treating Workspace declarations as its input.

## Revisit trigger

If Phase 8/19 implementation shows the two contracts cannot be kept
independent in practice (a specific sandbox mechanism requires
capability-declaration details that leak across the boundary), or if no
second sandbox mechanism is ever actually implemented, making the
swappability this ADR argues for entirely theoretical.

## Evidence

`research/canonical/canonical-research.json` contradiction
`CTR-WORKSPACE-CONVERGENCE`, claim `CLM-MASTRA-002`;
`research/frameworks/mastra/overview.md`; `research/topics/sandbox-execution.md`;
`docs/architecture/DEPENDENCY-DIRECTION.md` (`adapters/tools (browser/sandbox)`);
`.context/research/decisions.json` entries
`adopt-workspace-composable-tool-boundary`,
`adopt-runtime-and-sandbox-as-explicit-contracts`,
`current-wave-cw-004-workspace-sandbox-contracts`.
