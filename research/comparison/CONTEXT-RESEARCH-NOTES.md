---
type: Comparison Matrix
title: Context Research Notes
description: 'Context Research Notes across the 5-framework supplementary corpus (OpenHands, Letta, Google ADK, Browser Use, CrewAI), imported from a prior external research pass'
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

# Context Research Notes

## CodeGrep

CodeGrep (arXiv:2608.05886, published 2026-08-06) reports that coding agents can spend much of their token budget on finding files before patching. In its setup, a 30B OpenHands agent averaged 23 rounds and 631K tokens per resolved SWE-Bench Verified issue; adding a dedicated retrieval agent reduced rounds by 15% and tokens by 19% on resolved instances while preserving or improving resolve rate. These are **paper-reported results in a specific benchmark/setup**, not LabLaunchPad facts.

Source: https://arxiv.org/abs/2608.05886

## SWE-Explore

SWE-Explore (arXiv:2606.07297, published 2026-06-05) isolates repository exploration as a ranked line-level context selection task with 848 issues across 203 repositories and 10 languages. It reports that coverage, ranking quality and context efficiency correlate with downstream repair behavior.

Source: https://arxiv.org/abs/2606.07297

## LabLaunchPad benchmark derivation

Measure for a fixed repository/task/model/runtime:

- `exploration_rounds`
- `exploration_tokens`
- `unique_files_read`
- `unique_lines_read`
- `candidate_file_precision@K`
- `candidate_line_coverage@budget`
- `context_reuse_ratio`
- `solver_tokens_after_context`
- `time_to_first_relevant_file`
- `verified_outcome`
- `total_cost`

Primary score:

`verified_outcome / (solver_tokens + exploration_tokens + compute_cost + human_minutes)`

Research rule: do not hard-code CodeGrep's exact percentages into LabLaunchPad requirements. Use them to justify the benchmark category.
