---
type: Framework Research
title: Microsoft AutoGen
description: 'Framework research for Microsoft AutoGen, imported from a prior "next wave" external research pass (batch 2)'
sources:
  - resource: https://learn.microsoft.com/en-us/agent-framework/overview/
    id: autogen-1
  - resource: https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-autogen/
    id: autogen-2
  - resource: https://github.com/microsoft/autogen/blob/main/README.md
    id: autogen-3
  - resource: https://docs.ag2.ai/latest/docs/blog/2024/01/25/AutoGenBench/
    id: autogen-4
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "autogen.okf" | title: "Microsoft AutoGen" | date: "2026-08-17" | source_type: "research" | evidence_standard: "E0-E5" | status: "RESEARCH_COMPLETE" | tags: |   - "evidence" |   - "clean-room"'
---

# Microsoft AutoGen

## Research scope

Primary-source desk research for LabLaunchPad Agent SDK. Retrieval date: 2026-08-17. This record is intentionally compact and evidence-oriented; it is not a narrative reimplementation guide.

## Version / license

- Version/date: Python v0.7.5 surfaced (2025-09-30); migration-era research
- License signal: MIT for code; CC-BY-4.0 for repository documentation
- Code reuse policy for this corpus: **PATTERN-ONLY**.
- Legal status: NOT legal advice; re-check exact dependency/subdirectory license before redistribution.

## Evidence records

### AUTOGEN-1

- claim: Microsoft states Agent Framework is AutoGen's direct successor and combines AutoGen patterns with Semantic Kernel features, plus workflows and state for long-running/HITL scenarios.
- source: https://learn.microsoft.com/en-us/agent-framework/overview/
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### AUTOGEN-2

- claim: AutoGen migration guide documents mapping from AutoGen to Agent Framework, including session state, MCP, agent-as-tool and workflow patterns.
- source: https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-autogen/
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### AUTOGEN-3

- claim: AutoGen's code is MIT while documentation is CC-BY-4.0; trademark rights are not granted.
- source: https://github.com/microsoft/autogen/blob/main/README.md
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### AUTOGEN-4

- claim: AutoGenBench shows a benchmark-centered operational pattern with isolated Docker runs and telemetry outputs.
- source: https://docs.ag2.ai/latest/docs/blog/2024/01/25/AutoGenBench/
- evidence_level: E3
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
