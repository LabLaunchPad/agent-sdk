---
type: Topic Research
title: PROTOCOL MCP
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

# MCP Protocol

## Current baseline

**2026-07-28** is the current official MCP specification baseline found in this wave.

Material deltas from older session-based assumptions:

- protocol core is stateless
- `initialize` / `initialized` and `Mcp-Session-Id` are retired
- requests can be self-describing
- `server/discover` is optional
- `Mcp-Method` and `Mcp-Name` enable header-based routing
- list results include cache hints
- Tasks and the extensions framework are first-class
- authorization is hardened

## LabLaunchPad policy

Use a **version-aware adapter**. Do not make protocol-session state a kernel invariant.

## Evidence

Official MCP release announcement: https://blog.modelcontextprotocol.io/posts/2026-07-28/

E5 interoperability: **NOT RUN**.
