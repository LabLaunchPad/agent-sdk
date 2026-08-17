---
type: Topic Research
title: Wave1 Source Receipt
description: Provenance receipt for the wave1 research corpus
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus ("wave1", research run llp-rsch-2026-08-17-wave1), URLs not independently re-verified via WebFetch/WebSearch in this session unless otherwise noted - treat as DOCUMENTED_NOT_REPRODUCED
---

# LabLaunchPad Agent SDK Research Corpus

Research run: `llp-rsch-2026-08-17-wave1`

Status: **PARTIAL**

This bundle is a current-wave, evidence-first research artifact generated on 2026-08-17. It is intentionally conservative:

- official web evidence is recorded with provenance
- current MCP and A2A baselines are updated
- no E5 result is invented
- prior LabLaunchPad corpus audit is explicitly BLOCKED because the repository/corpus was not supplied
- machine-readable ledgers and OKF-compatible concept files are included
- validation/self-test artifacts are included

Primary current sources:

- OKF v0.2 specification: https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md
- MCP 2026-07-28: https://blog.modelcontextprotocol.io/posts/2026-07-28/
- A2A 0.3.0: https://a2a-protocol.org/v0.3.0/specification/
- OpenAI Agents SDK: https://openai.github.io/openai-agents-python/
- Microsoft Agent Framework: https://learn.microsoft.com/en-us/agent-framework/overview/

To close the remaining P0 gaps, run this corpus against a mounted LabLaunchPad repository and reproducible benchmark environment.
