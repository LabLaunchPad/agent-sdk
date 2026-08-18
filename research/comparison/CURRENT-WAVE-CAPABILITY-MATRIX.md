---
type: Framework Research
title: Capability Matrix
description: 'Comparison matrix: Capability Matrix, imported from the "current wave" research corpus'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus ("current wave"), URLs not independently re-verified via WebFetch/WebSearch in this session - treat as DOCUMENTED_NOT_REPRODUCED
---

# Capability Matrix

Legend: NATIVE = first-class; SUPPORTED = supported through documented extension/adapter; DEGRADED = feature differences exist; UNKNOWN = not verified by this pass.

| Capability         | OpenAI Agents                           | Microsoft AF            | MCP                              | A2A                         | LabLaunchPad target          |
| ------------------ | --------------------------------------- | ----------------------- | -------------------------------- | --------------------------- | ---------------------------- |
| Tools              | NATIVE                                  | NATIVE                  | NATIVE                           | via remote agent capability | Capability contract          |
| Structured output  | NATIVE                                  | SUPPORTED               | schema-based protocol            | DataParts / artifacts       | Typed Result contract        |
| Streaming          | NATIVE                                  | NATIVE                  | protocol notifications/tasks     | NATIVE                      | Event stream                 |
| Handoffs           | NATIVE                                  | workflow/agent patterns | N/A                              | remote delegation           | Explicit delegation adapter  |
| Durable workflow   | SANDBOX/session-dependent               | NATIVE                  | task-level                       | task-level                  | Runtime durability layer     |
| Checkpoint/restart | documented for sandbox/session surfaces | NATIVE                  | task state, not execution replay | task lifecycle              | E5 required                  |
| MCP                | NATIVE integration                      | NATIVE integration      | PROTOCOL                         | can be bridged              | adapter                      |
| A2A                | integration surface                     | integration surface     | N/A                              | NATIVE                      | adapter                      |
| HITL               | NATIVE                                  | NATIVE                  | consent-oriented                 | long-running tasks          | Approval subsystem           |
| Tracing            | NATIVE                                  | telemetry/DevUI         | protocol metadata                | protocol/task state         | canonical events + exporters |
| Local execution    | SUPPORTED                               | SUPPORTED               | NATIVE for stdio                 | HTTP model                  | Local runtime                |
| Provider routing   | adapters                                | providers               | N/A                              | external                    | Router above ModelCapability |
| Sandbox            | NATIVE/beta surfaces                    | local/Docker tooling    | N/A                              | remote opaque               | pluggable SandboxContract    |
| Memory             | sessions/context providers              | context providers       | not a memory system              | contextId/history           | separate Memory Engine       |
