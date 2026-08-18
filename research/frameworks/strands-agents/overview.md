---
type: Framework Research
title: Strands Agents
description: 'Framework research for Strands Agents, imported from a prior "next wave" external research pass (batch 2)'
sources:
  - resource: https://github.com/strands-agents/sdk-python
    id: strands-agents-1
  - resource: https://strandsagents.com/docs/user-guide/concepts/agents/session-management/
    id: strands-agents-2
  - resource: https://strandsagents.com/docs/user-guide/evals-sdk/quickstart/
    id: strands-agents-3
  - resource: https://strandsagents.com/docs/api/python/strands.models.ollama/
    id: strands-agents-4
  - resource: https://github.com/strands-agents/sdk-python/blob/main/AGENTS.md
    id: strands-agents-5
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "strands-agents.okf" | title: "Strands Agents" | date: "2026-08-17" | source_type: "research" | evidence_standard: "E0-E5" | status: "RESEARCH_COMPLETE" | tags: |   - "evidence" |   - "clean-room"'
---

# Strands Agents

## Research scope

Primary-source desk research for LabLaunchPad Agent SDK. Retrieval date: 2026-08-17. This record is intentionally compact and evidence-oriented; it is not a narrative reimplementation guide.

## Version / license

- Version/date: v1.36.0 (latest surfaced release; 2026-04-17)
- License signal: Apache-2.0
- Code reuse policy for this corpus: **PATTERN-ONLY**.
- Legal status: NOT legal advice; re-check exact dependency/subdirectory license before redistribution.

## Evidence records

### STRANDS-AGENTS-1

- claim: Model-driven simple agent loop, broad provider support including Ollama, custom providers; repository and docs agree.
- source: https://github.com/strands-agents/sdk-python
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### STRANDS-AGENTS-2

- claim: Session persistence exists; persistence occurs on lifecycle events and session manager is not thread-safe. Security warning around symlink-following in trusted storage.
- source: https://strandsagents.com/docs/user-guide/concepts/agents/session-management/
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### STRANDS-AGENTS-3

- claim: Official evaluation SDK supports output, trajectory, tool-use, interaction, deterministic and LLM-judge evaluation, trace-based evaluation and experiment serialization.
- source: https://strandsagents.com/docs/user-guide/evals-sdk/quickstart/
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### STRANDS-AGENTS-4

- claim: Ollama provider supports local invocation, streaming and tool/function calling.
- source: https://strandsagents.com/docs/api/python/strands.models.ollama/
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### STRANDS-AGENTS-5

- claim: Repo documents mirrored unit/integration tests and explicit testing patterns.
- source: https://github.com/strands-agents/sdk-python/blob/main/AGENTS.md
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

## Architecture extraction

- Problem/job: see evidence records and master matrix.
- Core pattern: compact structured observations rather than copied internals.
- State: treat as separate from memory/context unless the framework explicitly proves otherwise.
- Runtime: classify local capability conservatively.
- Security: never infer trust from framework convenience features.
- Portability: map semantic concepts, not APIs.

## Unknowns

- Exact cross-version behavioral guarantees outside cited material.
- Full provider feature parity without reproduction.
- Complete licensing for every transitive integration/package.
- Production performance across different model families and hardware.

## LabLaunchPad decision

Use this source as pattern evidence only. Any implementation claim must be converted to a contract and independently benchmarked.
