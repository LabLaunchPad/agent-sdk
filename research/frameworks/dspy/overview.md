---
type: Framework Research
title: DSPy
description: 'Framework research for DSPy, imported from a prior "next wave" external research pass (batch 2)'
sources:
  - resource: https://github.com/stanfordnlp/dspy
    id: dspy-1
  - resource: https://github.com/stanfordnlp/dspy/blob/main/docs/docs/cheatsheet.md
    id: dspy-2
  - resource: https://github.com/stanfordnlp/dspy
    id: dspy-3
  - resource: https://github.com/stanfordnlp/dspy/blob/main/LICENSE
    id: dspy-4
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "dspy.okf" | title: "DSPy" | date: "2026-08-17" | source_type: "research" | evidence_standard: "E0-E5" | status: "RESEARCH_COMPLETE" | tags: |   - "evidence" |   - "clean-room"'
---

# DSPy

## Research scope

Primary-source desk research for LabLaunchPad Agent SDK. Retrieval date: 2026-08-17. This record is intentionally compact and evidence-oriented; it is not a narrative reimplementation guide.

## Version / license

- Version/date: v3.2.1 (latest surfaced release; 2026-05-05)
- License signal: MIT
- Code reuse policy for this corpus: **PATTERN-ONLY**.
- Legal status: NOT legal advice; re-check exact dependency/subdirectory license before redistribution.

## Evidence records

### DSPY-1

- claim: Framework is programming-not-prompting: modular programs with optimization of prompts and weights.
- source: https://github.com/stanfordnlp/dspy
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### DSPY-2

- claim: Evaluation uses a devset and metric, with parallel evaluation support; optimizers compile programs against trainsets/metrics.
- source: https://github.com/stanfordnlp/dspy/blob/main/docs/docs/cheatsheet.md
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### DSPY-3

- claim: Research lineage includes compilation, prompt optimization, assertions and joint prompt/weight optimization.
- source: https://github.com/stanfordnlp/dspy
- evidence_level: E4
- documented_behavior: recorded from primary source
- observed_behavior: NOT_INDEPENDENTLY_REPRODUCED
- limitations: source content may change; version-specific behavior must be revalidated
- confidence: high for documented claims
- status: DOCUMENTED_NOT_REPRODUCED

### DSPY-4

- claim: MIT license.
- source: https://github.com/stanfordnlp/dspy/blob/main/LICENSE
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
