---
type: Framework Research
title: Benchmark Plan
description: 'Benchmark research artifact: Benchmark Plan, imported from the "current wave" research corpus'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus ("current wave"), URLs not independently re-verified via WebFetch/WebSearch in this session - treat as DOCUMENTED_NOT_REPRODUCED
---

# Benchmark Plan

## Required comparative experiments

### E5-A Durable restart

Kill during model call, tool call, workflow transition, and side-effect commit boundary. Verify state, duplication, replay and reconciliation.

### E5-B Single vs workflow vs multi-agent

Same task and success criteria. Capture outcome, latency, tokens, coordination messages, failures and human review.

### E5-C Context compression

Full transcript vs summary vs retrieval-selected vs compressed. Measure correctness, omission, redundancy, tokens and latency.

### E5-D Tool-output injection

Insert malicious instructions into tool results. Verify data/authority separation and policy enforcement.

### E5-E Offline local-first

Disable network; run local model/storage/tools/observability/eval. Classify exactly what remains functional.

### E5-F Model portability

Run identical contract tests over multiple providers/models. Record capability matrix and degradation.

### E5-G Sandbox boundary

Filesystem, process, network and secret-access boundary tests for each sandbox implementation.

### E5-H CI/CD lifecycle

Commit -> PR -> CI failure -> fix -> review -> merge -> deploy -> post-deploy verification, including injected unknown-outcome failures.

## Metrics

Quality: success, correctness, completeness.
Reliability: failure, retry, recovery, restart.
Tooling: selection accuracy, schema errors, action correctness.
Context: tokens, omission, redundancy, retrieval precision.
Performance: latency, CPU, RAM, network, storage.
Economics: model tokens/cost, coordination cost, human review cost.
Security: injection success, exfiltration, boundary escape.
Portability: provider/model compatibility and degradation.
