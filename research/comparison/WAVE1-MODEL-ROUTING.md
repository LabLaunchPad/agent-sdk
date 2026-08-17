---
type: Topic Research
title: MODEL ROUTING
description: Comparison matrix imported from the wave1 research corpus
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus ("wave1", research run llp-rsch-2026-08-17-wave1), URLs not independently re-verified via WebFetch/WebSearch in this session unless otherwise noted - treat as DOCUMENTED_NOT_REPRODUCED
---

# Model Routing

OpenRouter currently documents:

- ordered provider selection
- provider fallbacks
- parameter-aware filtering
- data-collection controls
- ZDR selection
- price / throughput / latency sorting
- multi-model fallback

Architecture implication: LabLaunchPad routing should be capability-aware and policy-aware, not only price-based.

The existence of routing features is not evidence of semantic portability.
