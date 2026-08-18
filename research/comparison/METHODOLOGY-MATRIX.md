---
type: Comparison Matrix
title: Methodology Matrix
description: 'Methodology Matrix across the 5-framework supplementary corpus (OpenHands, Letta, Google ADK, Browser Use, CrewAI), imported from a prior external research pass'
sources:
  - resource: /research/frameworks/openhands/overview.md
    id: openhands
  - resource: /research/frameworks/letta/overview.md
    id: letta
  - resource: /research/frameworks/google-adk/overview.md
    id: google-adk
  - resource: /research/frameworks/browser-use/overview.md
    id: browser-use
  - resource: /research/frameworks/crewai/overview.md
    id: crewai
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus (user-supplied), not independently re-verified via WebFetch in this session
---

# Methodology Matrix

| Method                           | Problem solved                  | Cost        | Use in LabLaunchPad                                | Decision |
| -------------------------------- | ------------------------------- | ----------- | -------------------------------------------------- | -------- |
| Specification-Driven Development | ambiguous behavior              | low/medium  | define contracts before implementation             | ADOPT    |
| Behavior-Driven Development      | user-facing acceptance behavior | medium      | selected UX/operator scenarios                     | ADAPT    |
| Test-Driven Development          | implementation regressions      | medium      | core deterministic modules                         | ADOPT    |
| Contract Testing                 | subsystem interoperability      | medium      | Agent/Runtime/Capability/Policy interfaces         | ADOPT    |
| Property-Based Testing           | state/serialization invariants  | medium      | state/event/policy schemas                         | ADOPT    |
| Golden/Fixture Testing           | stable model-adjacent outputs   | low         | parser/context/compiler outputs, not raw LLM prose | ADOPT    |
| Adversarial Testing              | security/failure paths          | medium/high | mandatory for capabilities and memory              | ADOPT    |
| Benchmark-Driven Development     | efficiency/outcome tradeoffs    | high        | context/runtime/model routing                      | ADAPT    |
| Evaluation-Driven Development    | model behavior quality          | high        | task/eval suites                                   | ADOPT    |
| Mutation Testing                 | test-suite strength             | high        | deterministic policy/core modules only             | DEFER    |
| Chaos/Recovery Testing           | durable runtime failures        | high        | persistence/runtime only                           | ADAPT    |
| Compatibility/Conformance        | provider/framework migration    | medium      | adapters/protocols                                 | ADOPT    |
