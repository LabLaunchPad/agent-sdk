---
type: Framework Research
title: LlamaIndex
description: 'Framework research for LlamaIndex, imported from a prior "next wave" external research pass (batch 2)'
sources:
  - resource: https://github.com/run-llama/llama_index
    id: llama-index-1
  - resource: https://github.com/run-llama/llama_index
    id: llama-index-2
  - resource: https://github.com/run-llama/llama-agents
    id: llama-index-3
  - resource: https://github.com/run-llama/llama_index/releases
    id: llama-index-4
  - resource: https://github.com/run-llama/llama_index/blob/main/LICENSE
    id: llama-index-5
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "llama-index.okf" | title: "LlamaIndex" | date: "2026-08-17" | source_type: "research" | evidence_standard: "E0-E5" | status: "RESEARCH_COMPLETE" | tags: |   - "evidence" |   - "clean-room"'
---

# LlamaIndex

## Research scope

Primary-source desk research for LabLaunchPad Agent SDK. Retrieval date: 2026-08-17. This record is intentionally compact and evidence-oriented; it is not a narrative reimplementation guide.

## Version / license

- Version/date: v0.14.22 (latest surfaced release; 2026-05-14)
- License signal: MIT for core repository (individual integrations may vary)
- Code reuse policy for this corpus: **PATTERN-ONLY**.
- Legal status: NOT legal advice; re-check exact dependency/subdirectory license before redistribution.

## Evidence records

### LLAMA-INDEX-1

- claim: By default index data is in-memory; storage context can persist to disk and reload.
- source: https://github.com/run-llama/llama_index
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### LLAMA-INDEX-2

- claim: Project is broad document/data/agent framework with RAG, agents, multi-agent and storage integrations.
- source: https://github.com/run-llama/llama_index
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### LLAMA-INDEX-3

- claim: Separate Llama Agents project is event-driven, async-first and step-based for execution control; includes deployable agent services and MCP server paths.
- source: https://github.com/run-llama/llama-agents
- evidence_level: E3
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### LLAMA-INDEX-4

- claim: Release train is fast and modular; latest surfaced core release is v0.14.22.
- source: https://github.com/run-llama/llama_index/releases
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### LLAMA-INDEX-5

- claim: Core repo license is MIT; integration licenses can differ and must be audited per dependency.
- source: https://github.com/run-llama/llama_index/blob/main/LICENSE
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
