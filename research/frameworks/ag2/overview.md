---
type: Framework Research
title: AG2 (formerly AutoGen)
description: 'Framework research for AG2 (formerly AutoGen), imported from a prior "next wave" external research pass (batch 2)'
sources:
  - resource: https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/orchestration/orchestrations/
    id: ag2-1
  - resource: https://docs.ag2.ai/latest/docs/user-guide/models/ollama/
    id: ag2-2
  - resource: https://docs.ag2.ai/latest/docs/blog/2024/01/25/AutoGenBench/
    id: ag2-3
  - resource: https://github.com/ag2ai/ag2/releases
    id: ag2-4
  - resource: https://github.com/ag2ai/ag2
    id: ag2-5
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "ag2.okf" | title: "AG2 (formerly AutoGen)" | date: "2026-08-17" | source_type: "research" | evidence_standard: "E0-E5" | status: "RESEARCH_COMPLETE" | tags: |   - "evidence" |   - "clean-room"'
---

# AG2 (formerly AutoGen)

## Research scope

Primary-source desk research for LabLaunchPad Agent SDK. Retrieval date: 2026-08-17. This record is intentionally compact and evidence-oriented; it is not a narrative reimplementation guide.

## Version / license

- Version/date: v0.13.2 (latest surfaced release; 2026-05-29)
- License signal: Apache-2.0 for fork modifications; original AutoGen code under MIT
- Code reuse policy for this corpus: **PATTERN-ONLY**.
- Legal status: NOT legal advice; re-check exact dependency/subdirectory license before redistribution.

## Evidence records

### AG2-1

- claim: Core strength is multi-agent orchestration: two-agent, sequential, group chat, nested patterns; Swarm functionality was merged into group chat.
- source: https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/orchestration/orchestrations/
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### AG2-2

- claim: Ollama is directly supported and tool calling is supported without LiteLLM.
- source: https://docs.ag2.ai/latest/docs/user-guide/models/ollama/
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### AG2-3

- claim: AutoGenBench lineage provides CLI benchmark execution with Docker isolation, logs/telemetry and multiple-run support.
- source: https://docs.ag2.ai/latest/docs/blog/2024/01/25/AutoGenBench/
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### AG2-4

- claim: Release feed shows beta agent evaluation support and security work.
- source: https://github.com/ag2ai/ag2/releases
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### AG2-5

- claim: License boundary is explicitly mixed: original AutoGen MIT code plus Apache-2.0 fork changes.
- source: https://github.com/ag2ai/ag2
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
