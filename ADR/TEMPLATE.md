---
type: Architecture Decision
title: <Decision, as a short noun phrase>
description: <One sentence — what was decided>
generated:
  by: process:claude-code-session
  at: <ISO 8601 datetime>
status: draft
---

# ADR-NNNN — <Decision>

OKF `status` maps: `Proposed` → `draft`, `Accepted` → `stable`,
`Superseded` → `deprecated` (add a `Superseded by` line below when so).
`generated.by` uses `human:<id>` if a person authored this ADR directly
rather than an AI coding agent.

| Field      | Value |
| ---------- | ----- |
| Phase      | P<NN> |
| Supersedes | —     |

## Context

The forces at play. What made a decision necessary, and what constraints bound
it. State facts with their evidence; state assumptions as assumptions.

## Decision

The decision, stated in the imperative. One decision per ADR.

## Adversarial review

Required. A decision recorded without an attack on it is a preference.

**Attack:** the strongest argument against this decision.

**Failure modes:** how this decision could turn out to be wrong.

**Falsifying experiment:** what observation would prove it wrong, and how it
would be run.

## Alternatives considered

| Alternative | Why rejected |
| ----------- | ------------ |

## Consequences

What becomes easier, what becomes harder, what is now foreclosed.

## Revisit trigger

The specific, observable condition under which this decision is reopened. "When
it feels wrong" is not a trigger. If nothing could reopen it, say so explicitly.

## Evidence

Where the supporting facts came from, dated. Registry queries, benchmark runs,
specification text.
