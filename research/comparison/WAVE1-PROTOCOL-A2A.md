---
type: Topic Research
title: PROTOCOL A2A
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

# A2A Protocol

## Current baseline

The official specification identifies **0.3.0** as latest in this run.

The 0.3.0 specification requires HTTP(S) transport and JSON-RPC 2.0 payloads; SSE is used for streaming methods.

## Required LabLaunchPad tests

Discovery, authentication, task submission, streaming, artifact reception, long-running task, resume, failure, timeout, duplicate request, unknown outcome and malicious peer.

Interop status: **NOT RUN**.
