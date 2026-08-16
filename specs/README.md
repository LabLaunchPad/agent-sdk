# specs/

Behaviour specifications for every SDK concept.

**Source-of-truth status: CANONICAL.**

A spec defines desired behaviour, prohibited behaviour, state, invariants,
transitions, failure modes, recovery and evidence _before_ implementation.
When implementation and spec disagree, the spec wins until an ADR says
otherwise — silently reinterpreting a spec is drift.

Use [`TEMPLATE-BEHAVIOUR-SPEC.md`](TEMPLATE-BEHAVIOUR-SPEC.md) for new specs.

## Phase 0 contents

`persistence/` holds store-interface stubs. They are **specifications, not
TypeScript interfaces** — writing them as code would be SDK surface, which
Phase 0 prohibits. See [`ADR/0006`](../ADR/0006-persistence-interfaces-deferred.md).
