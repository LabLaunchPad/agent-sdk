---
type: Architecture Decision
title: Protocol / Application / Agent State Distinction
description: MCP's own protocol state, server-minted application state, and LabLaunchPad's agent state are three distinct layers and must never collapse into one
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: stable
---

# ADR-0009 — Protocol / Application / Agent State Distinction

| Field      | Value                                           |
| ---------- | ----------------------------------------------- |
| Phase      | P18 (Protocols) — binding now, implemented then |
| Supersedes | —                                               |

## Context

MCP's 2026-07-28 revision removed protocol-level sessions from the core
entirely — no `initialize`/`notifications/initialized` handshake, no
`Mcp-Session-Id` header. State ownership moved to the application layer,
confirmed independently by every source that researched this revision
(`research/protocols/mcp-2026-07-28.md`; `SRC-WAVE1`, `SRC-BATCH3` in
`research/canonical/canonical-research.json`'s `CLM-MCP-001`, `VER-MCP-001`
— all three sources agree on the version and the finding, zero drift). MCP's
own spec also treats tool behavior descriptions as untrusted
(`CLM-MCP-004`).

LabLaunchPad has its own state model in development (`StateStore`,
`CheckpointStore`, per `specs/persistence/STORE-INTERFACES.md`). A2A adds
a third layer: opaque remote-agent state that must never be assumed
inspectable (`CLM-A2A-002`).

Three distinct kinds of "state" are at risk of being conflated by anyone
implementing the MCP or A2A adapter: the protocol's own minimal wire state,
whatever a server mints and hands back as an opaque task/session handle,
and LabLaunchPad's own agent/task state model. wave1's ADR-001 and this
session's own live research reach the same conclusion independently
(`CLM-MCP-001`, `wave1-adr-001-mcp-baseline`).

## Decision

Adapters (`MCPAdapter`, `A2AAdapter`) must treat **protocol state**
(the wire-level session/handshake concepts, if any, defined by the
protocol spec itself), **application state** (server-minted, opaque
identifiers such as an MCP task handle or an A2A `contextId`), and
**agent state** (LabLaunchPad's own `StateStore`/`CheckpointStore` model)
as three non-interchangeable layers. No adapter may store agent state
inside a protocol-level construct, and no adapter may treat a
protocol/application-layer identifier as if it were LabLaunchPad's own
state primitive. Protocol/application state passing through an adapter is
opaque payload to the kernel, never a substitute for it.

## Adversarial review

**Attack:** this is over-engineering for a distinction that collapses in
practice — most implementations conflate session ID with task ID with
almost no cost, and a strict three-layer separation adds indirection for a
theoretical purity argument.

**Failure modes:** if the boundary is enforced too rigidly, every adapter
call pays a translation cost even when the underlying identifiers really
are 1:1, and the abstraction could leak anyway if a future protocol
version reintroduces session state that genuinely needs to survive at the
agent layer (e.g. for resumability).

**Falsifying experiment:** implement `MCPAdapter` and `A2AAdapter` against
this rule during Phase 18, then attempt a real multi-turn task spanning
both protocols with LabLaunchPad's own checkpoint/resume. If the adapters
cannot express the interaction without smuggling agent state through a
protocol-layer construct, or if translation overhead is measurably
unacceptable, the distinction is too rigid and this ADR should be revised.

## Alternatives considered

| Alternative                                                      | Why rejected                                                                                                                                                                                                                              |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Let protocol/application state double as agent state directly    | Couples the kernel's state model to whatever a specific protocol version happens to expose; MCP's own history (removing session state entirely in 2026-07-28) shows protocol-level state is not stable ground to build agent semantics on |
| Defer the distinction until Phase 18 implementation, decide then | The distinction affects `StateStore`/`CheckpointStore`'s own contract (Phase 4), which is designed before Phase 18 — deciding this late would force a retrofit                                                                            |

## Consequences

Easier: adapters can be swapped or protocol versions upgraded without
touching agent-level state semantics; MCP's own stateless-core direction
becomes an asset rather than a breaking change to absorb. Harder: every
adapter needs an explicit translation layer between protocol/application
identifiers and agent state, adding a small amount of code that a naive
1:1 mapping would avoid. Forecloses: directly persisting a raw MCP task
handle or A2A `contextId` as LabLaunchPad's own `StateStore` key.

## Revisit trigger

If Phase 18's `MCPAdapter`/`A2AAdapter` implementation finds the
three-layer translation genuinely blocks a required interaction pattern
(not merely adds boilerplate), or if a future MCP/A2A revision
reintroduces protocol-level state explicitly designed to be treated as
durable agent state.

## Evidence

`research/protocols/mcp-2026-07-28.md`; `research/protocols/a2a-1.0.1.md`;
`research/canonical/canonical-research.json` claims `CLM-MCP-001`,
`CLM-MCP-004`, `CLM-A2A-002`, version record `VER-MCP-001`;
`.context/research/decisions.json` entries `protocol-application-agent-state-distinction`,
`current-wave-cw-002-mcp-stateless-adapter`, `wave1-adr-001-mcp-baseline`.
