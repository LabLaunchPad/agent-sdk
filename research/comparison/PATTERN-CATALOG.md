---
type: Comparison Matrix
title: Pattern Catalog
description: 'Pattern Catalog across the 5-framework supplementary corpus (OpenHands, Letta, Google ADK, Browser Use, CrewAI), imported from a prior external research pass'
sources:
  - resource: /research/frameworks/openhands/overview.md
    id: openhands
  - resource: /research/frameworks/letta/overview.md
    id: letta
  - resource: /research/frameworks/google-adk/overview.md
    id: google-adk
  - resource: /research/frameworks/browser-use/overview.md
    id: browser-use
  - resource: /research/frameworks/crewai/overview.md
    id: crewai
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus (user-supplied), not independently re-verified via WebFetch in this session
---

# Pattern Catalog

## PAT-RUNTIME-001 — Workspace/Sandbox as explicit contracts

- source: OpenHands, Browser Use, Letta
- problem: execution environment semantics otherwise leak into Agent abstraction
- observed_solution: explicit workspace/session/sandbox/runtime layers
- evidence: E3/E4 official docs
- LabLaunchPad_adaptation: RuntimeContract + WorkspaceContract + SandboxContract
- test: create/restore/cleanup/isolation contract suite
- benchmark: verified outcome per runtime cost
- status: CANDIDATE

## PAT-MEMORY-001 — Durable state separate from memory

- source: Letta, ADK, CrewAI
- problem: transcript/state/memory become conflated
- observed_solution: distinct state and memory abstractions
- evidence: E4 where state/memory APIs are documented
- LabLaunchPad_adaptation: typed State/Memory/Context/Knowledge/Evidence/Transcript
- test: restart, replay, memory-scope, stale-write tests
- benchmark: memory precision / context cost
- status: CANDIDATE

## PAT-CONTEXT-001 — Context broker / progressive disclosure

- source: ADK, Letta, OpenHands, Browser Use
- problem: token waste and distraction
- observed_solution: filtering/compression/hierarchy/selective skill loading
- evidence: E3/E4 + CodeGrep/SWE-Explore external research signal
- LabLaunchPad_adaptation: ContextBroker with token budget and provenance
- test: fixed-budget retrieval correctness
- benchmark: tokens, rounds, latency, success
- status: CANDIDATE

## PAT-EVAL-001 — Tool trajectory correctness

- source: Google ADK
- problem: final response can look good while tool behavior is wrong
- observed_solution: trajectory matching criterion
- LabLaunchPad_adaptation: action/event trajectory assertions
- test: golden tool path + allowed alternatives
- benchmark: trajectory correctness vs outcome
- status: CANDIDATE

## PAT-MINIMAL-001 — Thin environment-native loop

- source: Browser Use
- problem: abstraction overhead
- observed_solution: narrow Agent/Task primitive with powerful environment capability
- LabLaunchPad_adaptation: minimal default Run path
- test: one-file happy path from install to result
- benchmark: time-to-first-tool, tokens, concept count
- status: CANDIDATE

## PAT-SECURITY-001 — Deterministic action-boundary policy

- source: OpenHands
- problem: model-only security judgement is manipulable
- observed_solution: deterministic analyzers + confirmation + sandbox
- LabLaunchPad_adaptation: policy rail under Capability execution
- test: injection, shell abuse, bypass attempts
- benchmark: blocked unsafe actions / false positives
- status: CANDIDATE
