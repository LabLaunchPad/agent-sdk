---
type: Architecture Decision
title: Runtime-Assumption Corrections
description: Runtime backends are not interchangeable mid-execution without explicit testing, and local execution is not assumed cheaper than hosted without measurement
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: stable
---

# ADR-0016 — Runtime-Assumption Corrections

| Field      | Value                                |
| ---------- | ------------------------------------ |
| Phase      | P17 (Runtime), P19 (SandboxProvider) |
| Supersedes | —                                    |

## Context

Two assumptions this repository's own early research implicitly carried
turned out not to hold under direct evidence, each recorded as its own
contradiction: **runtime-abstraction-uniform** — PydanticAI's own
durable-execution capability is an attachable layer over
Temporal/DBOS/Prefect, but the three backends do not behave identically
for a mid-execution backend swap; Temporal's maintainers reject it
outright in their own open issue #5477, while DBOS/Prefect are looser
(`CLM-PAI-001`, `reject-uniform-runtime-swap-assumption`). **local-
execution-cheaper** — no evidence in this corpus actually measures
local-vs-hosted cost; the assumption that local execution is cheaper by
default is untested, and the sandbox-execution topic's own Docker/
Firecracker/Wasmtime tradeoff analysis shows isolation mechanism choice
carries its own real cost profile independent of local-vs-hosted
(`reject-local-always-cheaper`).

Both are corrections to an assumption, not evidence for a new positive
architecture — grouped into one ADR because both are guardrails against
the same kind of error: treating an unverified convenience assumption as
if it were a tested architectural property.

## Decision

`@lablaunchpad/runtime-core`'s `RuntimeAdapter` conformance suite (Phase 17) must explicitly test mid-execution backend swap as its own test case,
not assume it works because each backend individually implements the same
interface — a backend that behaves like PydanticAI's own Temporal
integration (rejecting a mid-execution swap outright) is a valid, passing
implementation as long as it declares that constraint, not a broken one.
`adapters/tools/sandbox`'s `SandboxProvider` spec (Phase 19) must define
its isolation guarantee independently of any local-vs-hosted cost claim —
"runs locally" and "is cheaper" are not the same property and must not be
conflated in the spec or in any documentation LabLaunchPad publishes about
its own local-first posture.

## Adversarial review

**Attack:** this ADR mostly formalizes two negative findings ("don't
assume X") without proposing a positive replacement design — it's process
guidance dressed as architecture, and could have been a `DECISIONS.md`
smaller-call entry instead of a full ADR.

**Failure modes:** if "test mid-execution swap explicitly" and "don't
conflate local with cheap" don't actually change anyone's design decisions
in practice, this ADR is ceremony with no teeth.

**Falsifying experiment:** Phase 17's actual `RuntimeAdapter` conformance
suite either does or doesn't include a mid-execution-swap test case; Phase
19's `SandboxProvider` spec either does or doesn't separate isolation
guarantee from cost claims. Both are directly checkable when those specs
are written — if either omits the explicit test/separation this ADR
requires, that is the ADR failing to bind, not the ADR being vindicated by
absence of counter-evidence.

## Alternatives considered

| Alternative                                                                                                | Why rejected                                                                                                                                                                                                                              |
| ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Record as a `DECISIONS.md` smaller-call instead of an ADR                                                  | Both corrections directly constrain the conformance-testing requirements of two specific future specs (Phase 17, Phase 19) — binding enough to warrant ADR rank per `SOURCE-OF-TRUTH.md`'s own precedence rule, not merely a process note |
| Leave the runtime-swap and local-cost assumptions uncorrected, let Phase 17/19 discover them independently | Exactly what this repository's evidence discipline exists to prevent — a known, evidenced gap left undocumented for a future phase to rediscover from scratch                                                                             |

## Consequences

Easier: Phase 17/19 spec authors have an explicit, evidenced requirement
to test against, rather than having to independently rediscover
PydanticAI's own backend-swap issue or measure local-vs-hosted cost from
zero. Harder: the `RuntimeAdapter` conformance suite is more expensive to
build correctly (an explicit swap test case, not just per-backend
interface conformance); any future local-first marketing claim needs
actual cost measurement behind it, not assumption. Forecloses: a
`RuntimeAdapter` implementation or conformance suite that implicitly
assumes uniform backend swap; any published local-first cost claim
without measurement.

## Revisit trigger

When Phase 17's conformance suite is actually written and either confirms
or reveals a gap in the mid-execution-swap test requirement; when any
future local-vs-hosted cost measurement is actually performed (currently
none exists in this corpus).

## Evidence

`research/frameworks/pydantic-ai/overview.md` (`CLM-PAI-001`,
`https://github.com/pydantic/pydantic-ai/issues/5477`);
`research/contradictions/runtime-abstraction-uniform.md`;
`research/contradictions/local-execution-cheaper.md`;
`research/topics/sandbox-execution.md`; `.context/research/decisions.json`
entries `reject-uniform-runtime-swap-assumption`, `reject-local-always-cheaper`.
