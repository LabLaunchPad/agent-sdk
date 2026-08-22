# CONFLICT-013 — "Storage: SQLite" contradicts browser-first-class

**Tags:** `NON-BLOCKING`
**Affected ADR:** [ADR-0006](../../../ADR/0006-persistence-interfaces-deferred.md) (Persistence Interfaces Deferred) — remapped from ADR-072 (Storage). `UNVERIFIED` for ADR-003 (WASM Strategy), which does not exist here; the browser-as-first-class requirement is instead evidenced by [ADR-0001](../../../ADR/0001-typescript-canonical-language.md). See the [provenance note](README.md#citation-provenance)

## Current Decision

ADR-0006 defers the store *implementations* but fixes their posture: *"Local-first defaults:
in-memory and SQLite/filesystem implementations first"*, with cloud and edge backends as adapters
that *"must not change SDK business semantics"*. ADR-0001 independently commits to a runtime
surface that includes *"local desktop, browser, Node, edge/worker runtimes"*.

## Observed Design

A store implementation has to actually exist on each target. On the browser target, "SQLite" and
"filesystem" are not the primitives they are on a native host — they are emulations layered over
OPFS, IndexedDB, or memory, each with its own constraints.

## Contradiction

The tension is not that SQLite is unavailable in the browser — it is, via WASM — but that the
browser build carries operational constraints the native build does not, and ADR-0006's
*"must not change SDK business semantics"* is exactly the clause those constraints strain:

- **A deployment requirement leaks into the SDK.** The OPFS VFS needs `SharedArrayBuffer`, which
  requires the embedding page to be served with COOP and COEP headers. An SDK whose storage layer
  dictates the host application's HTTP response headers has changed rather more than its
  implementation.
- **Durability is weaker, and not under our control.** OPFS data can be cleared by platform
  storage-cleanup irrespective of whether persistent permission was granted. ADR-0010 requires
  each `CheckpointStore` to publish its specific durability guarantee — the browser's honest
  answer is "best effort", which is a materially different contract from a native filesystem's.
- **Ordinary store operations are missing.** SQLite's WASM build does not expose OPFS traversal
  or database-file deletion through the SQLite API. Retention and archival policy is a *required*
  part of the `CheckpointStore` contract under ADR-0010 — and retention needs deletion.

So the conflict is real but narrower than "SQLite doesn't work in browsers": it is that ADR-0010's
required contract elements (published durability guarantee, retention/archival policy) cannot be
satisfied identically across the two targets, while ADR-0006 asks that semantics not vary.

## Security / Reliability / Compatibility Impact

**Security — low.** No enforcement boundary. Note only that OPFS is origin-scoped, so the
isolation properties differ from a filesystem path but are not weaker.

**Reliability — moderate.** A checkpoint believed durable but silently cleared by the platform is
precisely the failure ADR-0010's "publish your specific guarantee" clause exists to prevent.

**Compatibility — low.** This is an adapter-level concern. Nothing in the persisted *schema*
changes, which is why this is `NON-BLOCKING` where most of the register is not.

## Affected Schemas

None. The store contract changes, not the serialized shapes.

## Affected APIs / ABIs

- `CheckpointStore` / `StateStore` — the durability-guarantee declaration becomes a required,
  machine-readable field rather than prose
- Any retention or archival API, which must be able to report "unsupported on this backend"
  rather than silently no-op

## Affected Tests

- each backend declares a durability guarantee, and the declaration is asserted, not assumed
- retention on a backend without deletion reports unsupported rather than silently succeeding
- the conformance suite runs against the browser backend, not only the native one

## Downstream Dependencies

Every phase that persists anything. The browser target is also where
[CONFLICT-008](CONFLICT-008-environment-is-os-shaped.md)'s capability-negotiated `Environment`
pays off: "has durable storage" becomes a declared capability rather than an assumption.

## Evidence

- **FACT** — The OPFS VFS requires `SharedArrayBuffer`, which is only available when the server
  sends COOP and COEP response headers.
  <https://sqlite.org/wasm/doc/trunk/persistence.md>
- **FACT** — The SQLite API cannot traverse the list of files stored in OPFS, nor delete a
  database file; OPFS is an internal implementation detail not exposed to client code.
  <https://sqlite.org/wasm/doc/trunk/persistence.md>
- **FACT** — OPFS data has been observed removed by platform storage cleanup regardless of whether
  persistent permission was obtained.
  <https://sqlite.org/forum/info/542fba6a46cec787>
- **FACT** — Safari before version 17 is incompatible with the OPFS VFS owing to a browser bug in
  sub-worker storage handling.
  <https://sqlite.org/wasm/doc/trunk/persistence.md>
- **FACT** — ADR-0010 requires every `CheckpointStore` implementation to publish its specific
  durability guarantee rather than claim a uniform one, and makes retention/archival a
  first-class contract element.
  [`ADR/0010-durability-checkpoint-boundary.md`](../../../ADR/0010-durability-checkpoint-boundary.md)
- **INFERENCE** — Taken together these do not argue against SQLite-in-browser; they argue that
  ADR-0010's "publish your own guarantee" clause is the correct mechanism and simply needs to be
  machine-readable so a caller can branch on it.
- **UNKNOWN** — Whether the browser target needs *durable* checkpoints at all, or whether an
  ephemeral session store is acceptable there. This materially changes the work and has not been
  decided.

## Recommended Resolution

Treat durability as declared capability, not as a uniform promise. Proposed, not locked.

1. **Make the durability guarantee a structured, machine-readable field** on the store contract —
   at minimum: what survives process crash, what survives tab close, what survives platform
   storage pressure, and the retention window. ADR-0010 already requires the guarantee; this only
   makes it inspectable rather than prose.
2. **Let retention report `Unsupported`.** A backend that cannot delete must say so, rather than
   accepting a retention policy it will not honour.
3. **Do not put "SQLite" in any core interface name or type.** ADR-0006 already places concrete
   implementations behind adapters; the conflict arises only where the engine name leaks upward.
4. **Feed the browser's storage capability into `Environment`** per
   [CONFLICT-008](CONFLICT-008-environment-is-os-shaped.md), so the difference is represented as a
   different capability set rather than a degraded native host.
5. **Defer the browser backend implementation itself.** M0 is Linux-only and needs only the
   in-memory store; what M0 must not do is bake a uniform durability assumption into the contract.

## Alternatives Considered

- **Drop browser from the first-class target list.** Rejected: it contradicts ADR-0001's stated
  runtime-surface argument, which is load-bearing for that ADR's own rationale.
- **Require COOP/COEP of all embedders.** Rejected: an SDK that dictates its host page's response
  headers is not a library any more, and it would rule out embedding in pages the author does not
  control.
- **Use IndexedDB everywhere for uniformity.** Rejected: it degrades the native target to solve a
  browser problem, and the durability caveats do not actually go away.
- **Declare a single "exactly-once" durability guarantee across backends.** Rejected explicitly by
  ADR-0010, which forbids exactly this claim.

## Migration Required

**No.** No persisted schema changes. The store contract is not yet implemented, so shaping it now
costs nothing.

## Blocks Implementation

**No.** M0 uses an in-memory store. The one thing that must not happen before sign-off is
freezing a `CheckpointStore` contract that assumes uniform durability, since that assumption is
what would later need unpicking.
