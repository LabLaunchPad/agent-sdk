---
type: Architecture Decision
title: Persistence Interfaces Deferred
description: Persistence interfaces are specified now in specs/, implemented in Phases 4 and 7.
generated:
  by: process:claude-code-session
  at: 2026-08-16T00:00:00Z
status: stable
---

# ADR-0006 — Persistence interfaces are specified in Phase 0, implemented in Phases 4 and 7

| Field | Value |
| ----- | ----- |
| Phase | P00   |

## Context

The SDK needs `StateStore`, `SessionStore`, `CheckpointStore`, `MemoryStore`,
`EvidenceStore` and `EventStore`. Their shape constrains contract design in
Phase 3, so it must be decided early.

But Phase 0 prohibits Agent SDK product behaviour, and `Memory` is explicitly on
the do-not-implement list. Writing these as TypeScript interfaces would create
SDK surface during a phase whose entire purpose is to prove the substrate
without building the product — and interfaces designed before their first
implementation tend to encode assumptions that the implementation then has to
work around.

## Decision

Capture the store interfaces as **specification stubs in `specs/persistence/`**,
not as TypeScript.

The following constraints bind Phases 4 and 7 and are recorded now:

1. **No cloud database dependency in the SDK core.** Not Postgres, Redis, a
   vector database, or a graph database.
2. Local-first defaults: in-memory and SQLite/filesystem implementations first.
3. Cloud and edge backends (D1, Durable Objects, Postgres, DynamoDB) are
   adapters and must not change SDK business semantics.
4. Store interfaces live in a runtime-neutral layer; every concrete
   implementation lives behind an adapter.
5. Persisted state must be readable by the version that wrote it and by the next
   major. Long-running tasks outlive deploys, so this is correctness, not
   convenience.

## Adversarial review

**Attack:** deferring the interfaces risks Phase 3 contracts that cannot be
persisted efficiently, forcing a redesign exactly when it is most expensive.

**Failure modes:** the specs are written and then ignored; a Phase 3 contract
turns out to be unpersistable; a cloud dependency creeps in through an adapter
that leaks into core.

**Falsifying experiment:** during Phase 3, attempt to express each contract as a
checkpointable record against the Phase 0 specs. Failure to do so falsifies the
deferral and pulls interface design forward.

## Alternatives considered

| Alternative                                | Why rejected                                                                                                     |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Write the TypeScript interfaces in Phase 0 | Creates SDK surface in a phase that prohibits it, and designs an interface with no implementation to validate it |
| Defer entirely, specs included             | Leaves Phase 3 contract design unconstrained, which is how an unpersistable contract gets built                  |

## Consequences

Easier: Phase 3 designs contracts against known persistence constraints without
Phase 0 growing product surface.

Harder: the constraints are prose until Phase 4, so nothing mechanical enforces
them yet. Mitigated by `boundaries.json`, which already forbids cloud and vendor
dependencies below the adapters layer.

## Revisit trigger

Phase 3 discovering a contract that cannot be expressed against these
constraints.
