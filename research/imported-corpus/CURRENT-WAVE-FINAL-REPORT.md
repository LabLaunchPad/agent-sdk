---
type: Framework Research
title: LabLaunchPad Agent SDK — Current Wave Final Report
description: 'Final report: LabLaunchPad Agent SDK — Current Wave Final Report, imported from the "current wave" research corpus'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus ("current wave"), URLs not independently re-verified via WebFetch/WebSearch in this session - treat as DOCUMENTED_NOT_REPRODUCED
---

# LabLaunchPad Agent SDK — Current Wave Final Report

Date: 2026-08-17

## STATUS

CURRENT-WAVE RESEARCH COMPLETED TO E4 / DOCUMENTED_NOT_REPRODUCED.

## RESEARCH COMPLETED

OpenAI Agents SDK, Microsoft Agent Framework, MCP current revision delta, A2A 1.0.1, sandbox/workspace approaches, durable execution patterns, browser/computer-use evidence, model/provider portability, agent instruction ecosystem, and 2026 agentic security.

## RESEARCH REUSED

The prior-wave conclusions explicitly supplied by the user. The prior corpus files themselves were not mounted in the accessible workspace, so no direct file-level diff was possible.

## NEW RESEARCH PERFORMED

See `research/comparison/*` and `.context/research/*`.

## KEY VERIFIED FINDINGS

1. OpenAI Agents SDK remains intentionally small in core primitives while adding sessions, tracing, guardrails, MCP, handoffs and sandbox execution around the agent loop.
2. Microsoft Agent Framework explicitly distinguishes agents, harnesses and graph workflows, with checkpointing and HITL as workflow semantics.
3. MCP's 2026-07-28 revision makes the protocol core stateless and adds MRTR, routing, cacheable list results, authorization hardening and extensions.
4. A2A 1.0.1 provides Agent Cards, Tasks, Messages, Artifacts, streaming and push notifications for opaque remote agents.
5. OpenAI's 2026 prompt-injection work emphasizes source-to-sink controls; OWASP's 2026 agentic taxonomy elevates memory/context poisoning and inter-agent communication risks.
6. Current execution stacks treat workspace/sandbox state as a distinct runtime layer.

## DOCUMENTED_NOT_REPRODUCED

All current SDK behavior claims in this web pass.

## E5 RESULTS

None. No E5 claim was made.

## UNKNOWNs

- full file-level comparison against the existing LabLaunchPad corpus
- exact all-surface pinned versions where documentation/release pages disagree
- end-to-end offline/local-first qualification
- cross-provider feature parity under identical tasks
- quantitative multi-agent economics
- sandbox escape resistance under a controlled adversarial harness
- real-world A2A interoperability coverage

## TOP ARCHITECTURE DECISIONS

ADOPT: small kernel, explicit capability security, side-effect contract, model capability matrix, source-to-sink controls, UNKNOWN_OUTCOME.
ADAPT: workflow/checkpoint engine, sandbox/workspace engine, MCP/A2A adapters, provider routing, harness.
REJECT: transcript-as-state, default multi-agent, universal swarm/scheduler/vector DB in kernel, blind model-agnostic claims.
DEFER: universal CQRS/event sourcing, self-modifying runtime.
INVESTIGATE: exact durability semantics, context compression, local-first proof, A2A trust, sandbox boundary.

## WHAT SHOULD BE DELETED

Any architecture rule equating localhost/local tool support with local-first.
Any design that stores policy in tool descriptions or treats tool output as authority.
Any default requirement for multi-agent decomposition.

## WHAT SHOULD NOT BE BUILT YET

A universal swarm engine, universal scheduler, built-in universal vector DB, autonomous self-modification.

## COST / RESOURCE FINDINGS

Keep budget policy outside model-specific adapters. Use caching, retrieval, compression and deterministic computation before escalating model strength or coordination.

## TOKEN-EFFICIENCY FINDINGS

Progressive disclosure, deferred tool loading, targeted context selection, browser DOM/markdown filtering, result caching and compression are architecture-level concerns.

## SECURITY FINDINGS

The highest-leverage control is capability/side-effect containment. Prompt-injection detection alone is insufficient.

## STATE / MEMORY / CONTEXT FINDINGS

Keep State, Memory, Context, Knowledge, Evidence and Transcript as distinct typed contracts.

## MULTI-AGENT FINDINGS

Treat multi-agent as an optimization hypothesis, not a foundational architecture assumption.

## WORKFLOW FINDINGS

Use explicit workflows when execution order, recovery and HITL semantics matter; use dynamic agent loops when task structure is genuinely open-ended.

## SANDBOX / WORKSPACE FINDINGS

Model workspace/sandbox as a contract with filesystem, process, network, secret, resource, artifact, snapshot and cleanup policies.

## MCP FINDINGS

Use MCP as a protocol adapter. Do not embed MCP session semantics in the kernel. Revalidate compatibility against the 2026-07-28 revision.

## A2A FINDINGS

Use A2A as an external-agent boundary. Validate Agent Cards and authentication; never share internal state implicitly.

## MODEL ROUTING FINDINGS

Routing must be capability-aware and degradation-aware. A provider adapter is not proof of semantic equivalence.

## EVALUATION FINDINGS

Evaluation should exist outside the agent kernel but observe the same canonical event/state contracts used in production.

## BENCHMARK RESULTS

Not yet executed. Benchmark plans are complete.

## SPEC DELTA

See `.context/research/spec-delta.json`.

## GAP DELTA

See `.context/research/gap-delta.json`.

## ADR CANDIDATES

See `research/decisions/ADR-CANDIDATE-001-to-007.md`.

## WHAT CHANGED OUR MIND

The current MCP revision strengthens the case for a stateless protocol adapter; current sandbox surfaces strengthen the case for an explicit Workspace/Sandbox boundary; current security guidance strengthens the case for source-to-sink controls beyond prompt filtering.

## WHAT WOULD CHANGE OUR MIND

A reproducible benchmark showing that a simpler architecture meets durability, security, portability and recovery requirements at materially lower cost would justify reducing the proposed runtime layers.

## NEXT RESEARCH WAVE

Execute E5-A through E5-H in pinned environments, then perform a true file-level delta against the mounted historical LabLaunchPad corpus and update ADR candidates only when benchmark evidence warrants it.
