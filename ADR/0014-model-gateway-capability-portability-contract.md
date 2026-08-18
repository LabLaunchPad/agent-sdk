---
type: Architecture Decision
title: Model Gateway Capability & Semantic-Portability Contract
description: Model/provider capability is a published, versioned matrix, and semantic portability is claimed only per tested task class — never inferred from API compatibility alone
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: stable
---

# ADR-0014 — Model Gateway Capability & Semantic-Portability Contract

| Field      | Value               |
| ---------- | ------------------- |
| Phase      | P16 (Model Gateway) |
| Supersedes | —                   |

## Context

Three related findings converge on how `adapters/models` (`ModelRegistry`)
should describe what's actually available, rather than a single boundary
question: the existing `adopt-local-model-gateway-pattern` decision
(document at least one concrete local deployment target, not only an
abstract interface — Qwen-Agent's vLLM/Ollama first-party local paths are
the strongest local-model-execution evidence found across every researched
ecosystem, `CLM-QWEN-001`); current-wave's own finding that a model/provider
capability matrix should be a release artifact, not just an abstract
interface (`current-wave-cw-006-model-capability-matrix`); and wave1's
ADR-002, which states plainly that adapter/API compatibility must never be
equated with semantic portability — publish `TESTED_SEMANTIC_PORTABILITY`
only per actually-tested task class, never assumed globally
(`wave1-adr-002-semantic-portability`). No E5 reproduction exists yet to
test any portability claim against.

`ModelCapabilityRegistry` and `RoutingEngine` both fail the delete-test as
standalone packages — both are refinements of `ModelRegistry`'s own
contract, not independent boundaries (wave1's capability-aware-routing
topic is a real requirement, but it fits inside the gateway, not beside
it).

## Decision

`@lablaunchpad/adapters/models` publishes a **capability matrix** as a
release artifact (per model/provider: parameter support, streaming
support, tool-calling support, context window, local-vs-hosted, privacy
posture) — not merely an abstract `ModelProvider` interface with no
description of what any given implementation actually supports.
Portability claims are scoped: a model/provider swap is described as
`API_COMPATIBLE` (same interface shape) independently from
`TESTED_SEMANTIC_PORTABILITY` (same behaviour, confirmed for a specific,
named task class by an actual test) — the gateway must never present
`API_COMPATIBLE` as if it implies the latter. Routing between models
(`RoutingEngine`'s concern) is a policy layered on top of the capability
matrix, not a separate package — it consumes the matrix to make
capability-aware, privacy-aware, fallback-aware routing decisions.

## Adversarial review

**Attack:** maintaining a real capability matrix across every supported
model/provider is a significant, ongoing maintenance burden that will
inevitably drift out of date faster than providers change their own
capabilities — an interface-only approach is lower-maintenance and was
rejected here in favor of something that will rot.

**Failure modes:** if the matrix isn't kept current, it becomes actively
misleading — worse than no matrix, because consumers will trust a stale
`TESTED_SEMANTIC_PORTABILITY` claim for a task class that no longer holds
after a provider's silent model update.

**Falsifying experiment:** `BEN-MODEL-PORTABILITY` (`research/canonical/
canonical-research.json`, currently `NOT_RUN`) — run identical tasks
across model/provider pairs and compare against what the capability
matrix claims. A mismatch between the published matrix and observed
behaviour directly falsifies the matrix's freshness/accuracy, not the
decision to have one.

## Alternatives considered

| Alternative                                                               | Why rejected                                                                                                                                                                      |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Abstract `ModelProvider` interface with no capability description         | This is the status quo the current-wave and wave1 findings both argue against; an interface alone tells a consumer nothing about what a specific implementation actually supports |
| Treat API compatibility as sufficient evidence of behavioural portability | Directly contradicted by wave1's own ADR-002 — this is precisely the conflation it warns against                                                                                  |
| Standalone `ModelCapabilityRegistry`/`RoutingEngine` packages             | Both fail the delete-test as independent boundaries; both are refinements of the gateway's own contract                                                                           |

## Consequences

Easier: consumers can make informed model/provider choices (including
local-first ones, following Qwen-Agent's precedent) without re-discovering
capability gaps at runtime; routing policy has a real data source to
consume instead of guessing. Harder: the capability matrix must be
actively maintained and re-verified as providers change; `TESTED_
SEMANTIC_PORTABILITY` claims require actual E5-level tests per task class,
which is real ongoing work, not a one-time interface design. Forecloses:
shipping a model/provider adapter with a portability claim not backed by
an actual test of the specific task class being claimed.

## Revisit trigger

When `BEN-MODEL-PORTABILITY` is actually run and either confirms the
capability-matrix approach or reveals it drifts out of sync faster than
it can be maintained; or when Phase 16 implementation finds the
`API_COMPATIBLE`/`TESTED_SEMANTIC_PORTABILITY` distinction adds friction
disproportionate to the confusion it prevents.

## Evidence

`research/frameworks/qwen-agent/overview.md` (`CLM-QWEN-001`);
`research/decisions/WAVE1-ADR-002-SEMANTIC-PORTABILITY.md`;
`research/canonical/canonical-research.json` benchmark
`BEN-MODEL-PORTABILITY`; `.context/research/decisions.json` entries
`adopt-local-model-gateway-pattern`, `current-wave-cw-006-model-capability-matrix`,
`wave1-adr-002-semantic-portability`, `adr-candidate-004-offline-local-first-contract`
(informing evidence — see `DECISION-CONSOLIDATION.md` Group F).
