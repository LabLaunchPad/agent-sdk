---
type: Framework Research
title: Methodology Decisions
description: 'Comparison matrix: Methodology Decisions, imported from the "current wave" research corpus'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus ("current wave"), URLs not independently re-verified via WebFetch/WebSearch in this session - treat as DOCUMENTED_NOT_REPRODUCED
---

# Methodology Decisions

| Method                           | Problem solved                  | Cost        | LabLaunchPad                   |
| -------------------------------- | ------------------------------- | ----------- | ------------------------------ |
| Specification-driven development | contracts before implementation | medium      | ADOPT for protocols/contracts  |
| TDD                              | executable behavior             | medium      | ADOPT for kernels/side-effects |
| BDD                              | human-readable scenarios        | medium      | ADAPT for high-value workflows |
| Contract testing                 | boundary drift                  | low/medium  | ADOPT                          |
| Property-based testing           | invariant failures              | medium      | ADOPT for state/side-effects   |
| Golden fixtures                  | stable regression               | low         | ADOPT                          |
| Regression testing               | prevent re-breaks               | low/medium  | ADOPT                          |
| Adversarial testing              | security/robustness             | medium/high | ADOPT                          |
| Benchmark-driven development     | compare architecture choices    | high        | ADOPT for disputed decisions   |
| Evaluation-driven development    | agent quality                   | high        | ADOPT                          |
| Chaos/recovery                   | durable reliability             | high        | ADOPT for runtime              |
| Compatibility testing            | provider/protocol portability   | medium/high | ADOPT                          |
| Mutation testing                 | test-suite strength             | high        | ADAPT to critical policy code  |
| ADRs                             | decision traceability           | low         | ADOPT                          |
| Continuous verification          | drift control                   | medium      | ADOPT                          |
| Progressive disclosure           | context/token efficiency        | low         | ADOPT                          |
| Event sourcing                   | reconstructable events          | high        | DEFER as universal default     |
| CQRS                             | read/write scaling separation   | high        | DEFER as universal default     |
| Clean/Hexagonal/Ports & Adapters | dependency isolation            | medium      | ADAPT pragmatically            |
| Capability-based security        | least privilege                 | medium      | ADOPT                          |
