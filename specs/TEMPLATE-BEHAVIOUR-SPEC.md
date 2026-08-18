---
type: Behaviour Specification
title: <Concept, as a short noun phrase>
description: <One sentence — what this spec governs>
sources:
  - resource: /ADR/<governing-adr>.md
    id: <adr-id>
generated:
  by: process:claude-code-session
  at: <ISO 8601 datetime>
status: draft
---

# <Concept> — Behaviour Specification

> Copy this file. Fill every section. `UNKNOWN` is a valid answer; a blank
> section is not. A spec is written **before** implementation — writing it
> afterwards documents what happened rather than what was required.

OKF `status` maps: `Draft` → `draft`, `Accepted` → `stable`,
`Superseded` → `deprecated`. Omit the `sources` entry above if this spec has
no governing ADR yet.

| Field          | Value               |
| -------------- | ------------------- |
| Spec ID        | `SPEC-<AREA>-<NNN>` |
| Version        | `0.1.0`             |
| Governing ADRs |                     |
| Earliest phase |                     |

## 1. Purpose

What this concept is for, in two or three sentences. If it needs more, it is
probably two concepts.

## 2. Scope

What this specification governs.

## 3. Non-goals

What it deliberately does not govern. This section prevents scope creep more
reliably than any other.

## 4. Terminology

Terms with a precise meaning here, especially any that differ from common usage.

## 5. Inputs

| Input | Type | Required | Notes |
| ----- | ---- | -------- | ----- |

## 6. Outputs

| Output | Type | Notes |
| ------ | ---- | ----- |

## 7. State

The state this concept owns. What is persisted, what is derived, what is
ephemeral.

## 8. Invariants

Properties that must hold at all times. Each must be checkable — an invariant
that cannot be tested is a wish.

## 9. Transitions

| From | Event | To  | Guard | Side effects |
| ---- | ----- | --- | ----- | ------------ |

State transitions not listed here are prohibited and must be rejected.

## 10. Prohibited behaviour

What this must never do, stated explicitly. Prohibitions are as much a part of
the contract as capabilities.

## 11. Failure modes

| Failure | Detection | Consequence | Severity |
| ------- | --------- | ----------- | -------- |

## 12. Recovery

How each failure is recovered from. For anything long-running: what resumes,
what must not repeat, and how duplicate side effects are prevented.

## 13. Security

Trust boundaries, authority, what may be influenced by untrusted input, and what
must never be. Note explicitly where model output must not be trusted for
control-flow decisions.

## 14. Performance

Budget and the measurement that establishes it. **No number appears here until
it has been measured** — see `docs/architecture/BENCHMARK-TAXONOMY.md`.

| Metric | Baseline | Target | Regression threshold |
| ------ | -------- | ------ | -------------------- |

## 15. Evidence

What must be produced to demonstrate this behaves as specified, and where it is
recorded.

## 16. Validation

How conformance is checked: deterministic validation preferred, model-based
validation only where deterministic checking is impossible.

## 17. Versioning and compatibility

Schema version, what counts as a breaking change, and the migration obligation
for persisted state.

## 18. Examples

Minimal worked examples, including at least one that must be **rejected**.

## 19. Open questions

Known unknowns, and what it would take to resolve each. Carrying an honest
unknown is better than inventing a requirement.
