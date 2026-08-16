# Store Interfaces — Constraint Specification

| Field          | Value                                                         |
| -------------- | ------------------------------------------------------------- |
| Spec ID        | `SPEC-PERSIST-001`                                            |
| Version        | `0.1.0`                                                       |
| Status         | Draft                                                         |
| Governing ADRs | [ADR-0006](../../ADR/0006-persistence-interfaces-deferred.md) |
| Earliest phase | P04 (state), P07 (memory)                                     |

> **This is a constraint specification, not an implementation.** Phase 0
> prohibits SDK surface, so these interfaces are described rather than declared
> in TypeScript. See ADR-0006 for why.

## 1. Purpose

Constrain how the SDK persists state, sessions, checkpoints, memory, evidence
and events, so that Phase 3 contract design accounts for persistence rather than
discovering its constraints afterwards.

## 2. Scope

The six store abstractions below, and the rules binding every implementation.

## 3. Non-goals

Choosing a database. Defining query languages. Specifying indexing or retention
policy. Those are Phase 4 and Phase 7 decisions.

## 10. Prohibited behaviour

1. **No cloud database dependency in the SDK core** — not Postgres, Redis, a
   vector database, or a graph database.
2. No store implementation may live below the adapters layer.
3. No store may make persisted state unreadable by the version that wrote it.

## 4–9. The stores

| Store             | Holds                                                          | Notes                                                                                               |
| ----------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `StateStore`      | Canonical task/agent state                                     | Must support optimistic concurrency; a lost update is a correctness failure, not a race to tolerate |
| `SessionStore`    | Session identity and continuity                                | Sessions outlive processes                                                                          |
| `CheckpointStore` | Durable execution checkpoints                                  | Must support resume without repeating completed side effects                                        |
| `MemoryStore`     | Working, episodic, semantic, procedural, organizational memory | One interface, semantic classes as scopes — not six databases                                       |
| `EvidenceStore`   | Evidence artifacts                                             | Proof records reference evidence; large artifacts never live inside the proof                       |
| `EventStore`      | Append-only event log                                          | Append-only; ordering must be total per stream                                                      |

## 8. Invariants

1. Every store is defined in a runtime-neutral layer; every implementation sits
   behind an adapter.
2. Local-first: in-memory and SQLite/filesystem implementations exist before any
   networked backend.
3. Substituting an implementation must not change SDK business semantics — only
   durability, latency and capacity.
4. A checkpoint written before an upgrade must resume after it.

## 12. Recovery

Resume must be idempotent. A resumed task must not repeat a completed side
effect, which means side-effect completion is itself persisted state, not
inferred from progress.

## 17. Versioning and compatibility

Persisted state is readable by the writing version and the next major. Migrations
are tested against real checkpoints written by the prior version — never against
freshly constructed fixtures that happen to match the old shape.

## 19. Open questions

- Does `EventStore` need cross-stream ordering, or is per-stream total order
  sufficient? UNKNOWN until Phase 12 workflow semantics are settled.
- Is optimistic concurrency sufficient for `StateStore` under multi-agent
  writes, or is a lease required? UNKNOWN until Phase 4 measures contention.
