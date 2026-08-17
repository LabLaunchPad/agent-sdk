---
type: Architecture Decision
title: Durability & Checkpoint Boundary
description: Durability is a replaceable per-backend boundary inside CheckpointStore, not a universal exactly-once abstraction or a separate DurabilityEngine package
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: stable
---

# ADR-0010 — Durability & Checkpoint Boundary

| Field      | Value                                                                |
| ---------- | -------------------------------------------------------------------- |
| Phase      | P04 (state), P07 (memory)                                            |
| Supersedes | Amends `specs/persistence/STORE-INTERFACES.md` (does not replace it) |

## Context

LangGraph's `Checkpointer` is a real, evidenced example of a
backend-agnostic durable-execution interface with in-memory and SQLite as
first-class local options (`CLM-LANGGRAPH-001` — corrected this session
from an earlier mischaracterization requiring PostgreSQL/Redis,
`CTR-LANGGRAPH-LOCAL-FIRST`, `correct-langgraph-local-first-classification`).
But the same interface has two disclosed, currently-unsolved gaps in a
mature, genuinely local-capable implementation: no retention/archival
policy for checkpoint growth (`langgraphjs` #1138) and no schema-migration
mechanism (#536) — `CLM-LANGGRAPH-002`,
`reject-checkpointer-solves-persistence`. The interface being pluggable
does not by itself make persistence solved.

wave1's own ADR-003 independently reaches the same conclusion this
repository's ADR-0006 already implied: do not build a universal
exactly-once abstraction without scoped semantics; keep durability
replaceable with explicit per-backend guarantees
(`wave1-adr-003-durability-boundary`). Mastra's LibSQL path is cited as a
concrete zero-infra local example worth documenting alongside SQLite
(`adopt-libsql-local-storage-precedent`).

`specs/persistence/STORE-INTERFACES.md` already exists (`SPEC-PERSIST-001`,
governed by ADR-0006) and already states "resume must be idempotent... a
resumed task must not repeat a completed side effect, which means
side-effect completion is itself persisted state, not inferred from
progress" — this ADR's job is to close the two gaps LangGraph's own
issues expose, not to re-derive the spec.

## Decision

`DurabilityEngine` is **not** a standalone package. Durability guarantees
are a contract requirement on `@lablaunchpad/state`'s `CheckpointStore`,
with two additions to `specs/persistence/STORE-INTERFACES.md` this ADR
directly authorizes: (1) retention/archival policy is a required,
first-class part of the `CheckpointStore` contract, not an
implementation-defined detail left to whichever backend is chosen; (2)
schema-versioning/migration for persisted checkpoints is a required
contract element, tested against real checkpoints written by the prior
version, never synthetic fixtures. Every `CheckpointStore` implementation
publishes its specific durability guarantee (what survives a crash,
what's lost, what's the retention window) rather than claiming a uniform
"exactly-once" guarantee across backends.

## Adversarial review

**Attack:** requiring every backend to define and publish its own
durability guarantee, rather than one uniform contract, pushes complexity
onto every implementer and makes cross-backend comparison harder for
consumers — exactly the "capability matrix instead of one label" pattern
this repository is otherwise wary of over-applying.

**Failure modes:** if per-backend guarantees end up so different that no
meaningful common `CheckpointStore` interface survives, this becomes a
distinction without a difference — every consumer has to read the specific
backend's guarantee anyway, and the shared interface adds indirection
without adding safety.

**Falsifying experiment:** the first E5 run this phase (`E5-DURABLE-RESTART`)
tests exactly this: whether a SQLite-backed checkpoint survives a hard
kill mid-write without silent corruption. If it does not survive cleanly,
that is direct evidence the "local-first, SQLite as a first-class backend"
premise underneath this ADR needs revision, not just documentation.
**Result** (`research/benchmarks/E5-RESULT.md`): 6/6 genuine mid-transaction
kills rolled back cleanly, 4/4 post-commit controls committed cleanly,
zero corruption across 11 trials — supports this ADR's premise, on a
single run with real, stated limitations (no WAL-mode test, no
repetition, no concurrent-reader test). Does not close `GAP-E5-ZERO`.

## Alternatives considered

| Alternative                                                                 | Why rejected                                                                                                                                                                                           |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Build a universal exactly-once durability abstraction                       | Explicitly rejected by wave1's own ADR-003 and this repository's ADR-0006; LangGraph's own unsolved retention/migration gaps show the naive version of this doesn't hold up in a mature implementation |
| Leave retention/migration as backend-specific, undocumented in the contract | Exactly the gap LangGraph's own open issues demonstrate is a real, user-facing failure mode, not a hypothetical one                                                                                    |
| A standalone `DurabilityEngine` package                                     | Fails the delete-test — there is no proven dependency cut or independent version cadence distinct from `CheckpointStore` itself                                                                        |

## Consequences

Easier: `CheckpointStore` implementations can differ meaningfully by
backend without the contract lying about a guarantee it can't deliver.
Harder: consumers must read a specific backend's published guarantee
rather than trust one blanket claim; retention/migration testing becomes a
required part of every `CheckpointStore` implementation's own test suite,
not optional. Forecloses: shipping a `CheckpointStore` backend without a
documented retention policy or a migration test against real prior-version
checkpoints.

## Revisit trigger

When `E5-DURABLE-RESTART` (this phase) or any later E5 against a real
`CheckpointStore` implementation contradicts the "SQLite/in-memory as
first-class local backends" premise, or when Phase 4 implementation
reveals the retention/migration contract requirement is unworkable for a
specific backend.

## Evidence

`research/frameworks/langgraph/overview.md`;
`research/decisions/WAVE1-ADR-003-DURABILITY-BOUNDARY.md`;
`research/canonical/canonical-research.json` claims `CLM-LANGGRAPH-001`,
`CLM-LANGGRAPH-002`; `specs/persistence/STORE-INTERFACES.md`; ADR-0006;
`.context/research/decisions.json` entries
`reject-checkpointer-solves-persistence`, `adopt-checkpointer-pluggable-backend`,
`adopt-libsql-local-storage-precedent`, `wave1-adr-003-durability-boundary`;
`research/benchmarks/E5-DURABLE-RESTART.md` (this phase).
