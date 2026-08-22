---
type: Architecture Decision
title: Replay Modes
description: Strict fold and re-execution are named separately in the type system; only strict fold is gated, and the fold entry point cannot re-execute by construction.
generated:
  by: process:claude-code-session
  at: 2026-08-22T00:00:00Z
status: draft
---

# AMD-004 — `Strict` and `Reexecute` are distinct operations, and only `Strict` is gated

Resolves [CONFLICT-004](../../architecture/conflicts/CONFLICT-004-replay-is-two-operations.md).

| Field      | Value |
| ---------- | ----- |
| Phase      | P00   |
| Supersedes | —     |

## Context

"Replay" names two incompatible operations: reconstructing state by folding recorded events, and
re-running the agent against a live environment. They have opposite properties — one is bit-exact
and performs no outbound calls, the other is divergence-tolerant by nature.

The Go/No-Go gate asserts "run can be replayed" without saying which. The gate item is therefore
**unfalsifiable**: an implementer satisfies it with either, and a reviewer cannot tell whether a
green check means "state reconstructs deterministically" or "re-running usually gets something
similar".

There is a second-order consequence for the event schema. If observations are re-derivable, an
observation event may store a reference. If they are not, the observation's *content* is
authoritative and must be stored. That payload decision cannot be made until the ambiguity is
resolved.

## Decision

Name both operations in the type system so the distinction cannot be lost.

```
ReplayMode = Strict | Reexecute
```

- **`Strict`** — a pure fold over recorded events. Bit-exact. Performs zero outbound calls;
  requires no model, no network, no capability host. **This is the only mode the Go/No-Go gate
  tests.**
- **`Reexecute`** — re-invokes model and capabilities. Explicitly divergence-tolerant. Out of M0
  scope; named now so the schema reserves room for it.

Every effect-bearing event carries a **replayability marker** distinguishing a value that can be
re-derived by folding from one that is a *recorded outcome* of an external interaction. Strict
fold uses recorded outcomes and never re-dispatches.

**Enforce the distinction structurally.** The fold entry point must not accept an executor or
capability-host argument, so re-execution from that path is impossible by construction rather
than by discipline. A comment saying "do not dispatch here" is not enforcement; an absent
parameter is.

## Adversarial review

**Attack:** two modes is two implementations of what users think is one feature, and `Reexecute`
is specified here without being built. Naming an unbuilt mode invites the schema to carry
affordances for something that never ships.

**Failure modes:** the replayability marker is applied inconsistently — an event whose value was
actually a recorded outcome gets marked re-derivable, and strict fold silently produces a
different state than the original run. That is a *correctness* failure that presents as a
determinism bug and is very hard to attribute.

**Falsifying experiment:** fold the same fixture corpus twice and compare byte-for-byte — that is
the gate item, and it is now falsifiable. For the marker, the sharper test is
`fold_with_network_denied_completes`: if any event's value were genuinely re-derived rather than
read from the log, denying the network would fail the fold. That is a stronger check than
inspecting markers, because it tests the property rather than the annotation.

## Alternatives considered

| Alternative | Why rejected |
| ----------- | ------------ |
| One "replay" operation with a flag | A flag is ignorable; a type is not. The whole defect is that one word covered two things |
| Only implement strict fold, don't name the other | The observation-payload decision depends on knowing both exist; and the word "replay" would keep drifting back to meaning both |
| Make observations always re-derivable | False for any external interaction, which is most of them |
| Enforce by convention and code review | This is exactly the failure `CLAUDE_SDK_CAN_USE_TOOL_SHADOWED` documents in another system: a gate that can be skipped will be |

## Consequences

**Easier:** the gate item becomes falsifiable. The zero-network proof and the replay proof become
the same test, which is a simplification rather than a coincidence — a strict fold that needs the
network is not a strict fold.

**Harder:** every effect-bearing event needs a correct replayability marker, and getting one
wrong is a silent correctness bug.

**Foreclosed:** a fold entry point that can dispatch. "Replay" as an unqualified term in any spec
or test name.

## Revisit trigger

Reopen when `Reexecute` is actually implemented — its divergence semantics (what counts as an
acceptable difference, and who decides) are not specified here and will need their own decision.

## Evidence

- **FACT** — Event sourcing defines current state as the fold of an append-only event log.
  <https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing>
- **FACT** — OpenAI's agent tooling exposes an explicit `approve_unsafe_replay` retry decision,
  evidence that re-execution against a live environment is treated as a distinct and separately
  authorized operation in a production system rather than as a variant of state reconstruction.
- **INFERENCE** — If two operations require different authorization, they are different
  operations, and modelling them as one value with a flag will eventually let one be mistaken
  for the other.
- **UNKNOWN** — `Reexecute`'s divergence-tolerance semantics. Deliberately unspecified; naming
  the variant reserves schema room without pretending the behaviour is decided.
