---
type: Framework Research
title: METHODOLOGY
description: 'Comparison matrix imported from a prior "next wave" external research pass (batch 2, 9 frameworks: Strands Agents, smolagents, AG2, LlamaIndex, Llama Agents, Haystack, DSPy, AutoGen, Semantic Kernel)'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "METHODOLOGY" | title: "Methodology" | date: "2026-08-17" | source_type: "research" | evidence_standard: "E0-E5" | status: "RESEARCH_COMPLETE" | tags: |   - "methodology"'
---

# METHODOLOGY

| Method                           | Benefit                               | Cost                        | LabLaunchPad decision                            |
| -------------------------------- | ------------------------------------- | --------------------------- | ------------------------------------------------ |
| Specification-Driven Development | makes behavior explicit               | upfront design              | ADOPT for contracts                              |
| TDD                              | catches deterministic regressions     | weak for open-ended quality | ADOPT for kernel primitives                      |
| BDD                              | aligns user behavior language         | can become prose-heavy      | ADAPT for outcome scenarios                      |
| Contract Testing                 | provider/runtime portability          | maintenance                 | ADOPT strongly                                   |
| Property-Based Testing           | catches state/edge-case bugs          | generator design cost       | ADOPT for parsers/state machines                 |
| Golden Fixture Testing           | catches prompt/serialization drift    | fixture maintenance         | ADOPT selectively                                |
| Regression Testing               | protects known behavior               | suite growth                | ADOPT                                            |
| Adversarial Testing              | security/reliability                  | costly                      | ADOPT for tools/workspaces/memory                |
| Benchmark-Driven Development     | detects efficiency changes            | benchmark noise             | ADOPT with fixed harness                         |
| Evaluation-Driven Development    | measures agent quality                | model/eval cost             | ADOPT as first-class                             |
| Chaos/Recovery Testing           | tests restart/timeout/unknown outcome | infra complexity            | ADOPT for durable workflows                      |
| Compatibility Testing            | prevents provider drift               | matrix explosion            | ADOPT via capability matrix                      |
| Mutation Testing                 | tests test-suite strength             | compute heavy               | DEFER to critical modules                        |
| ADRs                             | preserves irreversible decisions      | documentation overhead      | ADOPT only for architecture-impacting choices    |
| Continuous Verification          | evidence on every merge/release       | CI cost                     | ADOPT                                            |
| Progressive Disclosure           | reduces context/UI load               | UX design effort            | ADOPT                                            |
| Context Engineering              | controls token economics              | tuning complexity           | ADOPT                                            |
| Event Sourcing                   | replay/audit                          | storage/complexity          | ADAPT: event log for key lifecycle, not all data |
| CQRS                             | separates write/read workloads        | architecture complexity     | DEFER until demonstrated                         |
| Clean/Hexagonal/Ports & Adapters | isolates providers                    | abstractions can overgrow   | ADAPT at provider/capability boundaries          |
| Capability-Based Security        | least privilege                       | permission modeling         | ADOPT                                            |

## Engineering loop

`SPEC -> CONTRACT -> TEST -> IMPLEMENT -> VERIFY -> BENCHMARK -> RELEASE`

For agent behavior:
`OUTCOME -> ACCEPTANCE -> TRAJECTORY/EVAL -> IMPLEMENT -> ADVERSARIAL -> REGRESSION`.
