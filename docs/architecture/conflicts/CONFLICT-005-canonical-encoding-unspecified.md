# CONFLICT-005 — Canonical encoding unspecified but signing assumed

**Tags:** `SCHEMA-AFFECTING` `ABI-AFFECTING` `BLOCKING`
**Affected ADR:** [ADR-0010](../../../ADR/0010-durability-checkpoint-boundary.md) (Durability / Checkpoint Boundary) — remapped from ADR-009 (Checkpointing); its schema-versioning-and-migration clause is what a non-canonical encoding silently breaks. `UNVERIFIED` for ADR-075 (Identity) and ADR-008 (Event Sourcing), which do not exist here. See the [provenance note](README.md#citation-provenance)

## Current Decision

ADR-075 requires cryptographically stable identity for Organization, Team, Employee, Worker,
Device, Plugin and Capability. ADR-009 requires content-addressed artifacts. ADR-008 requires an
append-only event log as the source of truth.

No ADR specifies the byte encoding over which digests are computed or signatures are taken.

## Observed Design

Content addressing and signing both require a **canonical** encoding: the same logical value must
produce the same bytes, on every machine, in every version, forever. Without one:

- a content-addressed artifact can be stored twice under two digests
- a signature verifies on the machine that produced it and fails elsewhere
- a digest recorded in a checkpoint cannot be re-derived during a fold

## Contradiction

The obvious default, `serde_json`, is **not canonical**:

- **Field order** follows struct declaration order. Reordering fields in Rust source — an
  ordinarily harmless refactor — silently changes every digest.
- **Float formatting** is not uniquely determined; `NaN` has no JSON representation and `-0.0`
  round-trips inconsistently.
- **Map iteration order** is nondeterministic for hash-based maps.
- **String escaping** has multiple valid encodings for the same string.

So the ADRs jointly require a property that the default implementation choice silently fails to
provide, and the failure is invisible until signature verification is attempted — which, under
the current phasing, is Phase 3 or later, long after the schema is frozen.

There is a second, easily-missed consequence: **floats cannot appear in any signed or
content-addressed payload at all**. This is a schema-linting rule, not merely an encoder setting,
and it must be established before payload types are written.

## Security / Reliability / Compatibility Impact

**Security — high (latent).** An event log whose signatures cannot be verified provides no
tamper-evidence. The defect is silent: everything works until someone tries to verify on a
different build.

**Reliability — high.** Non-reproducible digests break content addressing and checkpoint
validation.

**Compatibility — maximal.** This is the single most expensive item in the register to defer.
Every persisted event, every checkpoint, every artifact reference is encoded this way. Changing
the encoding after any run exists invalidates every stored digest and signature.

## Affected Schemas

- Every event payload (via the digest preimage)
- Every checkpoint
- Every content-addressed artifact reference
- The event envelope (digest and signature fields)

## Affected APIs / ABIs

- The digest function's public contract
- Plugin manifests, if manifests are content-addressed for provenance (ADR-044)

## Affected Tests

- `digest_is_stable_across_field_reordering`
- `digest_is_stable_across_processes`
- `no_floats_in_event_payloads` (a schema lint, not a unit test)
- Any signature verification test

## Downstream Dependencies

ADR-044 (Plugin Lifecycle) requires signature/provenance verification. ADR-074 (Sync) merges
event logs across devices and needs stable identity for deduplication. Both inherit this.

## Evidence

- **FACT** — RFC 8949 §4.2 defines deterministic CBOR encoding, including deterministic map key
  ordering and shortest-form integer encoding. <https://www.rfc-editor.org/rfc/rfc8949>
- **FACT** — `serde_json` serializes struct fields in declaration order; there is no canonical
  ordering guarantee across versions or refactors.
- **INFERENCE** — No reviewed agent project signs its event log, so there is no precedent to
  copy. OpenHands stores one JSON file per event with an integer index and relies on file naming
  rather than content addressing for identity
  (`openhands-sdk/openhands/sdk/conversation/event_store.py`). This is adequate for a local
  single-writer store but does not survive the multi-device sync ADR-074 anticipates.
- **UNKNOWN** — Whether signing is required in any phase before Phase 3. The recommendation below
  deliberately does not depend on the answer.

## Recommended Resolution

Fix the encoding now; defer the signing implementation. Proposed, not locked — see
[`../../adr/amendments/AMD-005-canonical-encoding.md`](../../adr/amendments/AMD-005-canonical-encoding.md).

- **Digest** = `blake3(canonical_CBOR(payload))`, RFC 8949 §4.2 deterministic encoding rules.
- **Signature preimage** = the canonical encoding of the envelope with the `signature` field set
  to absent. Reserve `signature: Option<Signature>` in the envelope now; leave it unpopulated.
- **Schema rule: no floats.** No `f32` or `f64` in any event payload or state field. Costs are
  integer micro-units; token counts are unsigned integers. Enforced by a schema lint, because it
  is invisible until it breaks verification.
- **Map rule: ordered maps only.** No hash-ordered collections in any serialized type.

Note that JSON may still be used as a *debugging* projection. It simply is not the digest
preimage.

## Alternatives Considered

- **Canonical JSON** (sorted keys, no floats, fixed escaping). Rejected: achievable but requires
  a custom serializer to enforce, and the float and escaping rules are easy to violate
  accidentally. CBOR's determinism rules are specified rather than self-imposed.
- **A bespoke domain byte encoding.** Rejected: a third grammar to maintain and test, with no
  compensating benefit.
- **Defer signing and encoding together.** Rejected: the encoding is what cannot be retrofitted.
  Signing genuinely can be, provided the field is reserved and the preimage rule is fixed.

## Migration Required

**Yes, and expensively, if deferred.** Every stored digest and signature is invalidated by an
encoding change. This is the strongest argument in the register for resolving before any code.

## Blocks Implementation

**Yes.** It constrains the payload types themselves (the no-floats rule), not merely the
serializer, so it must precede the event crate.
