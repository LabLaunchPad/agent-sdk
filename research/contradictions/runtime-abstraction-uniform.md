---
type: Contradiction
title: A Durable Runtime Abstraction Is Semantically Uniform Across Backends
description: Counterexample to the claim that a runtime-adapter interface guarantees identical behaviour regardless of the concrete backend
sources:
  - resource: /research/frameworks/pydantic-ai/overview.md
    id: pai-overview
generated:
  by: process:claude-code-session
  at: 2026-08-16T00:00:00Z
status: draft
---

# Contradiction: "A runtime-adapter interface makes backends interchangeable"

## Claim under test

LabLaunchPad's Phase 17 (Runtime Portability) plan assumes a `RuntimeAdapter`
interface lets a task run identically regardless of the concrete runtime
backing it — "same task, same contract, same acceptance criteria, different
runtime." An unstated assumption behind this is that once behaviour is
behind one interface, every implementation of that interface behaves
identically for the caller.

## Counterexample

PydanticAI's durable-execution capability model puts Temporal, DBOS and
Prefect behind what looks like one attachable capability — but the three
backends do not behave identically for a caller trying to swap which
backend durs a given agent run: "Temporal rejects it, while DBOS and Prefect
register durable units at first use and are looser." Swapping the backend
mid-flight is supported by two of the three and rejected by the third. This
is documented, current, first-party behaviour, not a bug report — the
maintainers' own open issue (#5477) treats a genuinely uniform abstraction
as future work, not something already achieved.

## Result

The claim as stated is **FALSE** as a general guarantee. A shared interface
constrains the _shape_ of interaction (same method calls, same contract
types) but does not by itself guarantee identical _behaviour_ under every
operation, especially operations at the edge of what the interface was
designed for (here: runtime-swap mid-execution, which is arguably outside
the core "run a durable step" contract).

## Change required

Phase 17's `RuntimeAdapter` conformance suite must explicitly test
behaviour at the edges of the interface, not just the steady-state case.
At minimum: what happens when a task is resumed under a different concrete
runtime than the one that created its checkpoint (a realistic scenario if
LabLaunchPad ever needs to migrate a long-running task across environments).
"The same interface" is not evidence of "the same behaviour" — that must be
demonstrated by a portability test (per this repository's own rule: "Do not
claim portability without portability tests"), not assumed from the
interface's existence.

## Test required

`*.portability.test.ts` for `RuntimeAdapter` (Phase 17) must include a
test that attempts a mid-execution backend swap and asserts the documented,
chosen LabLaunchPad behaviour (reject cleanly, or support it — either is
acceptable, but it must be a decision, not an accident discovered in
production).
