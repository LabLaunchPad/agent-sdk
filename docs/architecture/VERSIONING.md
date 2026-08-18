# Versioning and compatibility

Releases are managed with Changesets. Every change that touches a package
surface carries a changeset; CI rejects surface changes without one from
Phase 3 onward.

## Package versions

Semantic versioning. During `0.x`, a minor bump may break — but a break is
still announced in the changeset, never discovered by a consumer.

Phase 0 packages are all `private: true` at `0.0.0`. Nothing is published until
the surface exists and is specified.

## Schema versions

Schemas version independently of the packages that carry them. A schema's
version is part of its identity, not of its build.

- Every contract embeds a `schemaVersion`.
- **Additive** changes (new optional field, widened union) bump minor.
- **Breaking** changes (removed or narrowed field, changed semantics of an
  existing field, new required field) bump major and require a migration note.
- A major schema bump never reuses the previous major's wire identity.

Because JSON Schema is the canonical wire format and TypeScript is one
implementation of it, a schema change is a cross-language event. It must be
expressible without reference to TypeScript.

## Compatibility policy

| Surface                           | Guarantee                                                                                                                                                       |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wire format (JSON Schema)         | Strongest. Breaking changes need an ADR and a migration path.                                                                                                   |
| Public package exports            | Semver. Removal requires a deprecation cycle.                                                                                                                   |
| Persisted state and checkpoints   | Must be readable by the version that wrote it and by the next major. Long-running tasks outlive deploys — this is a correctness requirement, not a convenience. |
| Internal modules not in `exports` | No guarantee. Consumers reaching past `exports` are unsupported.                                                                                                |

## Deprecation

Mark with `@deprecated` including the replacement and the version that will
remove it. Deprecated surface survives at least one minor release before
removal. Silent removal is prohibited.

## The persisted-state constraint

A checkpoint written before an upgrade must resume after it. This means state
schemas may not make breaking changes without a migration, and a migration must
be tested against real checkpoints written by the prior version — not against
freshly constructed fixtures that happen to match the old shape.

This constraint binds from Phase 4, when durable state lands. It is recorded
here so that contract design in Phase 3 accounts for it rather than discovering
it later.
