---
type: Topic Research
title: RUNTIME LOCAL FIRST
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

# Runtime / Local-First

A runtime exposing a local sandbox is not automatically local-first.

This wave establishes that OpenAI documents Unix-local and Docker sandbox clients and Cloudflare documents isolated container sandboxes, but no end-to-end offline test was executed.

LabLaunchPad classification remains **UNKNOWN** until:

- network can be disabled
- local model works
- local storage works
- local tools work
- local observability works
- local evaluation works
- secrets remain local
