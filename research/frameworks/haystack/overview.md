---
type: Framework Research
title: Haystack
description: 'Framework research for Haystack, imported from a prior "next wave" external research pass (batch 2)'
sources:
  - resource: https://docs.haystack.deepset.ai/docs/agent
    id: haystack-1
  - resource: https://docs.haystack.deepset.ai/docs/pipelines
    id: haystack-2
  - resource: https://docs.haystack.deepset.ai/docs/serialization
    id: haystack-3
  - resource: https://docs.haystack.deepset.ai/docs/toolset
    id: haystack-4
  - resource: https://docs.haystack.deepset.ai/docs/mcptoolset
    id: haystack-5
  - resource: https://docs.haystack.deepset.ai/docs/choosing-the-right-generator
    id: haystack-6
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "haystack.okf" | title: "Haystack" | date: "2026-08-17" | source_type: "research" | evidence_standard: "E0-E5" | status: "RESEARCH_COMPLETE" | tags: |   - "evidence" |   - "clean-room"'
---

# Haystack

## Research scope

Primary-source desk research for LabLaunchPad Agent SDK. Retrieval date: 2026-08-17. This record is intentionally compact and evidence-oriented; it is not a narrative reimplementation guide.

## Version / license

- Version/date: v2.29.0 (latest surfaced release; 2026-05-12)
- License signal: Apache-2.0; repository notes an unknown license-header file that should be reviewed
- Code reuse policy for this corpus: **PATTERN-ONLY**.
- Legal status: NOT legal advice; re-check exact dependency/subdirectory license before redistribution.

## Evidence records

### HAYSTACK-1

- claim: Agent is an iterative loop component with dynamic tool selection, runtime state schema and configurable exit conditions.
- source: https://docs.haystack.deepset.ai/docs/agent
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### HAYSTACK-2

- claim: Pipelines support explicit loops and AsyncPipeline parallel execution.
- source: https://docs.haystack.deepset.ai/docs/pipelines
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### HAYSTACK-3

- claim: Pipeline serialization is explicit via YAML dump/load.
- source: https://docs.haystack.deepset.ai/docs/serialization
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### HAYSTACK-4

- claim: Toolset supports grouping/filtering/serialization and dynamic loading from MCP servers.
- source: https://docs.haystack.deepset.ai/docs/toolset
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### HAYSTACK-5

- claim: MCPToolset supports streamable HTTP, deprecated SSE, and local stdio subprocess execution.
- source: https://docs.haystack.deepset.ai/docs/mcptoolset
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### HAYSTACK-6

- claim: Local model path is strong: Hugging Face local, llama.cpp, Ollama; some evaluators can use local models.
- source: https://docs.haystack.deepset.ai/docs/choosing-the-right-generator
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
