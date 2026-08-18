---
type: Framework Research
title: LabLaunchPad Agent SDK — Current Wave Research Corpus
description: 'Source receipt: LabLaunchPad Agent SDK — Current Wave Research Corpus, imported from the "current wave" research corpus'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus ("current wave"), URLs not independently re-verified via WebFetch/WebSearch in this session - treat as DOCUMENTED_NOT_REPRODUCED
---

# LabLaunchPad Agent SDK — Current Wave Research Corpus

Research snapshot: **2026-08-17**

This package is a current-wave, evidence-first delta corpus. It does **not** claim the previous research corpus was re-read because no LabLaunchPad repository/corpus was mounted in the execution environment. The prior-wave content in the user's request was treated as the reuse baseline.

## Evidence policy

E0 model knowledge
E1 community signal
E2 repository/source evidence
E3 official documentation
E4 official documentation + source/tests/examples
E5 independently reproduced LabLaunchPad result

This package contains E4/documented findings and explicitly marks the absence of E5 reproduction.

## Key current-wave conclusions

- Small agent kernels remain a durable design pattern.
- Durable workflow/checkpoint semantics deserve a separate runtime layer.
- MCP should be an adapter/protocol boundary, especially after the 2026-07-28 stateless-core revision.
- A2A is a remote-agent interoperability boundary; treat peers as opaque and untrusted until authenticated/authorized.
- Workspace and sandbox are now architecture-level concerns, not incidental tool implementations.
- State, memory and context must remain distinct.
- Security must constrain source-to-sink impact, not rely solely on prompt filtering.
- Model/provider portability requires capability matrices and contract tests.
- `UNKNOWN_OUTCOME` must be first-class for external side effects.

## Important limitation

The existing LabLaunchPad research corpus was not present in `/mnt/data` during this pass. Direct file-by-file duplication/version-drift analysis against that corpus therefore remains an explicit gap.
