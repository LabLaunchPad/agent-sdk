---
type: Architecture Decision
title: Canonical Encoding
description: Deterministic CBOR plus blake3 is the digest preimage; floats and hash-ordered maps are banned from signed payloads.
generated:
  by: process:claude-code-session
  at: 2026-08-22T00:00:00Z
status: draft
---

# AMD-005 — Canonical encoding is deterministic CBOR; floats are banned from signed payloads

Resolves [CONFLICT-005](../../architecture/conflicts/CONFLICT-005-canonical-encoding-unspecified.md).
Amends [ADR-0010](../../../ADR/0010-durability-checkpoint-boundary.md).

| Field      | Value |
| ---------- | ----- |
| Phase      | P00   |
| Supersedes | —     |

## Context

Checkpointing, event sourcing and identity jointly require that a payload have **one** byte
representation, because digests and signatures are taken over bytes. No encoding was specified,
and the obvious default is not canonical:

- **Field order** follows struct declaration order, so an ordinarily harmless source refactor
  silently changes every digest.
- **Float formatting** is not uniquely determined; `NaN` has no JSON representation and `-0.0`
  round-trips inconsistently.
- **Map iteration order** is nondeterministic for hash-based maps.
- **String escaping** admits multiple valid encodings of the same string.

The failure is invisible until signature verification is attempted, which under the current
phasing is long after the schema is frozen. ADR-0010 makes schema-versioning and migration a
required contract element tested against **real checkpoints written by the prior version** — that
test is exactly what a non-canonical encoding breaks, and breaks silently.

## Decision

1. **Digest** = `blake3(canonical_CBOR(payload))`, using RFC 8949 §4.2 deterministic encoding.
2. **Signature preimage** = the canonical encoding of the envelope with the `signature` field
   **absent**. Reserve `signature: Option<Signature>` in the envelope now; leave it unpopulated.
   Signing itself is deferred; the *preimage rule* is not.
3. **No floats.** No `f32` or `f64` in any event payload or state field. Costs are integer
   micro-units; token counts are unsigned integers. **Enforced by a schema lint**, not by
   convention — the failure is invisible until it breaks verification, so a human rule is not
   sufficient.
4. **Ordered maps only.** No hash-ordered collection in any serialized type.
5. **JSON remains a debugging projection.** It is simply not the digest preimage.

Deliberately left open: the *internal* snapshot format. A high-performance binary representation
for checkpoints may differ from the canonical interchange encoding, provided the digest is always
taken over the canonical form. Fixing one format everywhere is not required and should not be
assumed.

## Adversarial review

**Attack:** banning floats is a large, permanent constraint imposed to serve a signing feature
that is deferred and may never ship. Integer micro-units push rounding decisions into every
call site.

**Failure modes:** signing never ships, and the repository carries an awkward numeric model for
nothing. Or a float arrives through a dependency's type — a model provider returning a
`temperature` or a confidence score — and the lint catches it late or not at all.

**Falsifying experiment:** the lint either does or does not reject an `f64` field added to an
event payload; that is directly checkable today. For the second, add a payload embedding a
provider response containing a float and confirm the lint sees through the nesting. If it does
not, the enforcement is theatre.

## Alternatives considered

| Alternative | Why rejected |
| ----------- | ------------ |
| JSON Canonicalization Scheme (JCS, RFC 8785) | Solves ordering and escaping but not floats — JCS specifies a float serialization, which means floats become *permitted*, and the numeric-drift problem returns |
| `serde_json` with sorted keys | Fixes only map ordering; leaves float formatting and escaping ambiguity untouched |
| Defer the whole question to signing | The register's central point: the encoding is schema- and ABI-affecting, so deferring it costs a migration over every persisted event |
| Allow floats, exclude them from the preimage | Creates two payload shapes — signed and unsigned — that can silently diverge; the exclusion list is itself unversioned state |

## Consequences

**Easier:** digests are stable across refactors. Checkpoint migration tests against prior-version
bytes become meaningful. Content-derived idempotency keys (AMD-006) and the environment
fingerprint (AMD-008) both become possible — neither works without this.

**Harder:** every numeric field needs an explicit unit decision. Any dependency type reaching a
payload must be checked for floats.

**Foreclosed:** `serde_json` as the digest preimage. Hash-ordered maps in serialized types.

## Revisit trigger

Reopen if a payload genuinely requires real numbers that cannot be expressed as scaled integers —
the plausible candidate is an embedding vector. Note that embeddings are large enough that they
probably belong behind a content reference rather than inline, which would sidestep this
entirely; that is the design to try before reopening.

## Evidence

- **FACT** — RFC 8949 §4.2 specifies deterministic CBOR encoding, including definite-length
  encoding and canonical map key ordering. <https://www.rfc-editor.org/rfc/rfc8949#section-4.2>
- **FACT** — ADR-0010 requires schema-versioning and migration for persisted checkpoints, tested
  against real checkpoints written by the prior version rather than synthetic fixtures.
  [`ADR/0010`](../../../ADR/0010-durability-checkpoint-boundary.md)
- **INFERENCE** — That test is the one a non-canonical encoding defeats: prior-version bytes are
  exactly what re-encoding must reproduce, and declaration-order field emission means a refactor
  between versions changes them.
- **UNKNOWN** — Whether the internal snapshot format should differ from the interchange encoding.
  Left open deliberately; it is a performance question with no evidence yet.
