---
type: Contradiction
title: Durable Checkpointing Solves State Persistence
description: Counterexample to the assumption that a checkpointer abstraction, once local-capable, has solved the state-persistence problem
sources:
  - resource: /research/frameworks/langgraph/overview.md
    id: langgraph-overview
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
---

# Contradiction: "A checkpointer abstraction solves state persistence"

## Claim under test

This installment's own corrected finding is that LangGraph's checkpointer
is a genuinely local-capable, backend-agnostic interface (in-memory/SQLite
first-class, Postgres/Mongo optional) — a positive finding worth adopting.
The unstated assumption behind treating a `CheckpointStore`-style interface
as "done" once it is pluggable and local-capable is that persistence is
solved once storage is: pick a backend, save state after each step, done.

## Counterexample

LangGraph's own checkpointer — architecturally sound and genuinely
local-capable — has two real, currently-open problems independent of
which backend is chosen:

- **No built-in state-schema versioning or migration**
  (`langgraphjs` #536): an old checkpoint can become incompatible with a
  newer graph definition, with no framework-provided detection or upgrade
  path — this is a data-shape problem, not a storage-backend problem.
- **No built-in checkpoint retention/archival policy**
  (`langgraphjs` #1138): the checkpoint table grows unbounded unless the
  application itself implements a background process to identify
  terminated threads and purge or archive them — this is a lifecycle
  problem, not a storage-backend problem.

Both problems exist identically whether the backend is in-memory, SQLite,
or Postgres — they are not solved, or even touched, by picking a "good"
local-capable backend.

## Result

The claim as stated is **FALSE** as a general assumption. A pluggable,
local-capable checkpointer interface solves _where_ state is stored; it
does not by itself solve _how long_ state should live, _whether it can
still be read_ after the schema that produced it has evolved, or _what
happens_ when a checkpoint outlives its usefulness. These are lifecycle
concerns layered on top of a storage interface, not implied by it.

## Change required

LabLaunchPad's own `CheckpointStore` spec (deferred to Phase 4/7 per
ADR-0006) should treat retention/archival and schema-versioning/migration
as **first-class parts of the contract**, not implementation details left
to whoever picks a concrete backend later. Concretely: the spec should
define (a) an explicit retention policy hook or field (e.g. TTL, or an
explicit archival call) as part of the interface, not bolted on per-backend,
and (b) a schema-version field on every persisted checkpoint plus a
documented upgrade-path expectation, so "read an old checkpoint under a
newer state shape" has a defined behaviour instead of an undefined one.

## Test required

`*.contract.test.ts` for `CheckpointStore` (Phase 4/7) must include: (1) a
test that writes a checkpoint, advances the schema version, and asserts
the documented behaviour on read (migrate, reject cleanly, or version-gate
— any of these is acceptable, but it must be a decision, not a crash); (2)
a test that exercises whatever retention/archival mechanism the spec
defines, not just "write succeeds." Per this repository's own rule ("do
not claim a capability without a test for it"), the pluggable-backend
property is not sufficient evidence that persistence itself is handled.
