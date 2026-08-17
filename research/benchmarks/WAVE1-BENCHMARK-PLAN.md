---
type: Topic Research
title: BENCHMARK PLAN
description: Benchmark research artifact imported from the wave1 research corpus
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus ("wave1", research run llp-rsch-2026-08-17-wave1), URLs not independently re-verified via WebFetch/WebSearch in this session unless otherwise noted - treat as DOCUMENTED_NOT_REPRODUCED
---

# Benchmark Plan

The benchmark suite remains executable-plan status until a runnable LabLaunchPad repository/runtime is provided.

E5-A Durable Restart: kill/restart at each checkpoint boundary; verify recovery unit and duplicate effects.
E5-B Multi-Agent Economics: compare rule baseline, single agent, explicit workflow, multi-agent using TOTAL_COST_PER_SUCCESSFUL_TASK.
E5-C Context Compression: compare full, summarized, retrieved, compressed and progressive-disclosure contexts.
E5-D Tool Output Injection: malicious tool-result fixtures with expected policy preservation.
E5-E Offline Local-First: network-disabled end-to-end execution.
E5-F Model Portability: identical tasks across model/provider pairs.
E5-G Sandbox Boundary: filesystem/process/network/secret/symlink/package adversarial tests.
E5-H CI/CD Lifecycle: injected failures through implementation-to-deploy lifecycle.
E5-I A2A Interop: independent implementation.
E5-J MCP Compatibility: version-aware protocol tests.
E5-K Browser Injection: dynamic pages, auth, downloads, redirects and injection.
E5-L Agent Maintainability: structured vs unstructured repository first-change success.
E5-M Model Routing: capability, failure, latency, cost and privacy routing.
E5-N Side-Effect Reconciliation: commit-then-response-loss unknown-outcome fixture.

No result is fabricated.
