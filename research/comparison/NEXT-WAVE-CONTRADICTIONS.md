---
type: Framework Research
title: CONTRADICTIONS
description: 'Comparison matrix imported from a prior "next wave" external research pass (batch 2, 9 frameworks: Strands Agents, smolagents, AG2, LlamaIndex, Llama Agents, Haystack, DSPy, AutoGen, Semantic Kernel)'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "CONTRADICTIONS" | title: "Contradictions" | date: "2026-08-17" | source_type: "research" | evidence_standard: "E0-E5" | status: "RESEARCH_COMPLETE" | tags: |   - "contradictions"'
---

# CONTRADICTIONS

At least seven real contradictions are supported by the evidence. These are not "one is right" disputes; they define where LabLaunchPad must expose tradeoffs.

1. **Minimal core vs explicit orchestration.** smolagents/Strands intentionally keep agent logic small/model-driven; Haystack, AG2 and Llama Agents expose more explicit execution control. Adopt both at different layers.
2. **Model-driven control vs deterministic workflow.** Model loops are flexible; workflows provide resumability, branching and policy enforcement. Do not turn every task into a graph.
3. **Local-first vs managed observability.** Local models/tool execution can remove network dependency, but remote telemetry/evals can improve operations. Make observability sinks pluggable and default-local.
4. **Persistent memory vs memory pollution.** Durable state improves continuity but retains stale/poisoned information. Separate state/memory/context and add TTL, provenance and invalidation.
5. **Multi-agent parallelism vs coordination cost.** AG2 demonstrates rich coordination primitives, while the cost model implies duplication of context and latency. Require evidence that delegation changes the outcome.
6. **Rich context vs context efficiency.** LlamaIndex/Haystack favor explicit retrieval/context pipelines; indiscriminate richness can inflate tokens and omission risk. Require token budgets and provenance.
7. **Automation vs human control.** Long-running systems need HITL/checkpoints; fully autonomous loops optimize speed. Make human gates capability/policy-driven, not hard-coded into every agent.
8. **Declarative optimization vs runtime simplicity.** DSPy benefits from compile/evaluate optimization; embedding optimization inside the execution kernel would increase coupling. Keep an optimization adapter.
9. **Knowledge-centric vs agent-centric architecture.** LlamaIndex/Haystack center data/context; Strands/smolagents center agent loop. LabLaunchPad should have separate knowledge and agent ports.
10. **Typed enterprise abstraction vs API simplicity.** Semantic Kernel's historical kernel-centric model provided typed extensibility, but Microsoft's migration notes also document simplification/consolidation in Agent Framework. Use small stable semantic interfaces and keep provider details behind adapters.
