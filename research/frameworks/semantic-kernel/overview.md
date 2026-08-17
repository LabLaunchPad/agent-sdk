---
type: Framework Research
title: Microsoft Semantic Kernel
description: 'Framework research for Microsoft Semantic Kernel, imported from a prior "next wave" external research pass (batch 2)'
sources:
  - resource: https://github.com/microsoft/semantic-kernel
    id: semantic-kernel-1
  - resource: https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-semantic-kernel/
    id: semantic-kernel-2
  - resource: https://learn.microsoft.com/en-us/agent-framework/overview/
    id: semantic-kernel-3
  - resource: https://github.com/microsoft/semantic-kernel
    id: semantic-kernel-4
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "semantic-kernel.okf" | title: "Microsoft Semantic Kernel" | date: "2026-08-17" | source_type: "research" | evidence_standard: "E0-E5" | status: "RESEARCH_COMPLETE" | tags: |   - "evidence" |   - "clean-room"'
---

# Microsoft Semantic Kernel

## Research scope

Primary-source desk research for LabLaunchPad Agent SDK. Retrieval date: 2026-08-17. This record is intentionally compact and evidence-oriented; it is not a narrative reimplementation guide.

## Version / license

- Version/date: migration-era / successor is Microsoft Agent Framework 1.0
- License signal: MIT
- Code reuse policy for this corpus: **PATTERN-ONLY**.
- Legal status: NOT legal advice; re-check exact dependency/subdirectory license before redistribution.

## Evidence records

### SEMANTIC-KERNEL-1

- claim: Microsoft's current repository states Semantic Kernel is now Microsoft Agent Framework and that Agent Framework is the enterprise-ready successor.
- source: https://github.com/microsoft/semantic-kernel
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### SEMANTIC-KERNEL-2

- claim: Migration guide identifies simplified agent creation, unified agent type model, session/thread mapping, and package decomposition changes.
- source: https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-semantic-kernel/
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### SEMANTIC-KERNEL-3

- claim: Agent Framework overview explicitly says it combines Semantic Kernel enterprise state/type-safety/filter/telemetry features with AutoGen patterns and adds explicit workflows/state management.
- source: https://learn.microsoft.com/en-us/agent-framework/overview/
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### SEMANTIC-KERNEL-4

- claim: Semantic Kernel repository is MIT licensed.
- source: https://github.com/microsoft/semantic-kernel
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
