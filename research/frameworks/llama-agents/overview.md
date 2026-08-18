---
type: Framework Research
title: Llama Agents + Workflows
description: 'Framework research for Llama Agents + Workflows, imported from a prior "next wave" external research pass (batch 2)'
sources:
  - resource: https://github.com/run-llama/llama-agents
    id: llama-agents-1
  - resource: https://github.com/run-llama/llama-agents
    id: llama-agents-2
  - resource: https://github.com/run-llama/llama-agents/releases
    id: llama-agents-3
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "llama-agents.okf" | title: "Llama Agents + Workflows" | date: "2026-08-17" | source_type: "research" | evidence_standard: "E0-E5" | status: "RESEARCH_COMPLETE" | tags: |   - "evidence" |   - "clean-room"'
---

# Llama Agents + Workflows

## Research scope

Primary-source desk research for LabLaunchPad Agent SDK. Retrieval date: 2026-08-17. This record is intentionally compact and evidence-oriented; it is not a narrative reimplementation guide.

## Version / license

- Version/date: llama-agents v0.12.5 surfaced; workflows v2.22.2 surfaced
- License signal: MIT
- Code reuse policy for this corpus: **PATTERN-ONLY**.
- Legal status: NOT legal advice; re-check exact dependency/subdirectory license before redistribution.

## Evidence records

### LLAMA-AGENTS-1

- claim: Execution model is event-driven, async-first and step-based.
- source: https://github.com/run-llama/llama-agents
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### LLAMA-AGENTS-2

- claim: llamactl supports local development, deployment, headless workflow services, MCP servers and full-stack apps.
- source: https://github.com/run-llama/llama-agents
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### LLAMA-AGENTS-3

- claim: Release feed exposes separate server, client, control-plane and workflow packages, indicating deployment/control-plane modularization.
- source: https://github.com/run-llama/llama-agents/releases
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
