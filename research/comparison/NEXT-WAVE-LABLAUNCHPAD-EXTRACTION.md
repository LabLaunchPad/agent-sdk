---
type: Framework Research
title: LABLAUNCHPAD-EXTRACTION
description: 'Comparison matrix imported from a prior "next wave" external research pass (batch 2, 9 frameworks: Strands Agents, smolagents, AG2, LlamaIndex, Llama Agents, Haystack, DSPy, AutoGen, Semantic Kernel)'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "LABLAUNCHPAD-EXTRACTION" | title: "LabLaunchPad Extraction" | date: "2026-08-17" | source_type: "research" | evidence_standard: "E0-E5" | status: "RESEARCH_COMPLETE" | tags: |   - "lablaunchpad" |   - "adopt" |   - "adapt" |   - "reject" |   - "defer"'
---

# LABLAUNCHPAD-EXTRACTION

## ADOPT

**1. Small semantic kernel.** Keep the mandatory concepts narrow: Agent, Capability, ContextBundle, State, Event, Policy, Runtime, Result.

**2. Explicit side-effect contract.** Every side effect gets an operation ID and explicit commit status, including `UNKNOWN_OUTCOME`.

**3. Versioned execution state.** Required for long-running work; support checkpoint, resume, recovery and migration.

**4. Capability-based security.** Tools are capabilities, not arbitrary functions. Grants should be explicit and scoped.

**5. Evaluation as infrastructure.** Support output, trajectory, tool-use, state and trace evaluation. Strands and DSPy show complementary patterns.

**6. Provider adapters with honest degradation.** Never hide model-dependent behavior.

**7. Context budgets + provenance.** Select context deliberately and preserve evidence.

**8. Agent-maintainer repository contract.** AGENTS/CLAUDE-style instructions, source-of-truth map, contracts, tests, evals and ADRs.

## ADAPT

- Strands session persistence -> portable StateStore with explicit concurrency/version semantics.
- smolagents CodeAgent -> optional code-as-action capability behind sandbox policy.
- AG2 group chat/handoffs -> optional coordinator, activated by measurable task decomposition benefit.
- LlamaIndex storage/context -> KnowledgePort and RetrievalPort, separate from workflow state.
- Llama Agents event/step engine -> optional DurableWorkflowPort.
- Haystack components/pipelines -> reusable capability graph/dataflow adapter.
- DSPy optimization -> offline OptimizationPort.
- AutoGenBench -> benchmark harness pattern.
- Semantic Kernel filters/type-safety/telemetry -> policy middleware + typed contracts without a central Kernel object.

## REJECT

- "Everything is an agent" as a core architecture.
- Permanent conversation history as the only memory/state model.
- Default multi-agent orchestration.
- Hidden persistence semantics.
- Treating localhost as proof of LOCAL_FIRST.
- Treating tool output as authority.
- Baking prompt optimization into the runtime kernel.
- Drop-in compatibility promises with other SDKs.

## DEFER

- Full CQRS.
- General event sourcing for every object.
- Built-in vector database.
- Built-in task scheduler/control plane.
- Generic swarm framework.
- Autonomous self-modification.
- Cross-tenant memory sharing.

## INVESTIGATE

- E2 benchmark reproduction on identical tasks.
- Durable execution semantics under process kill/restart.
- Context compression quality vs omission rate.
- Multi-agent value vs single-agent workflow on real product tasks.
- Sandboxed code execution across Windows/macOS/Linux.
- MCP trust and capability discovery model.
