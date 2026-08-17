---
type: Framework Research
title: NEXT-WAVE-MASTER-MATRIX
description: 'Comparison matrix imported from a prior "next wave" external research pass (batch 2, 9 frameworks: Strands Agents, smolagents, AG2, LlamaIndex, Llama Agents, Haystack, DSPy, AutoGen, Semantic Kernel)'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "NEXT-WAVE-MASTER-MATRIX" | title: "Next Wave Master Matrix" | date: "2026-08-17" | source_type: "research" | evidence_standard: "E0-E5" | status: "RESEARCH_COMPLETE" | tags: |   - "comparison" |   - "architecture" |   - "decisions"'
---

# NEXT-WAVE-MASTER-MATRIX

Research date: 2026-08-17.

Evidence convention: E3 means official documentation; E4 means official documentation plus repository/source/test evidence. No E5 independent reproduction was claimed in this pass.

| Ecosystem       | Primary job                                   | Core architecture                                            | State                                                                  | Local/model portability                                                                                      | LabLaunchPad stance                                         |
| --------------- | --------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| Strands Agents  | agent-first/model-driven SDK                  | Agent + simple loop + tools/plugins + session/eval           | Model-driven with explicit customizability                             | Session persistence available; lifecycle-triggered; manager not thread-safe                                  | Provider-agnostic incl. Ollama                              | LOCAL_CAPABLE / HYBRID       | ADOPT core loop; ADAPT persistence contract; REJECT hidden storage assumptions                  |
| smolagents      | minimal agent SDK                             | MultiStepAgent + CodeAgent/ToolCallingAgent + memory         | Small core + model intelligence; code-as-action is central             | In-memory step memory/replay; durable task semantics not the core value                                      | Broad providers via model adapters                          | LOCAL_CAPABLE                | ADOPT minimal core principle; ADAPT sandbox contract; REJECT implicit security-by-smallness     |
| AG2             | multi-agent orchestration                     | Agents + chats + group chat + nested/sequential workflows    | Explicit coordination and conversation patterns                        | Strong conversational state; persistence semantics vary by pattern                                           | Provider adapters incl. Ollama                              | LOCAL_CAPABLE                | ADOPT delegation patterns selectively; REJECT default multi-agent                               |
| LlamaIndex      | data/knowledge/RAG + agents                   | documents/indexes/query engines/agents/workflows             | Knowledge/data primitives + agent orchestration                        | In-memory by default; explicit storage persistence                                                           | Very broad integrations/local options                       | LOCAL_CAPABLE / HYBRID       | ADOPT data/context ports; ADAPT durable state semantics                                         |
| Llama Agents    | execution-control layer for Llama workloads   | event-driven async-first step workflows + deployment control | Explicit event/step orchestration                                      | Workflow/event state is first-class in execution model                                                       | Deployment/provider ecosystem varies                        | HYBRID                       | ADOPT explicit long-running workflow kernel as optional layer                                   |
| Haystack        | production LLM/RAG orchestration              | Components + pipelines + Agent + Toolset                     | Explicit graph/pipeline/dataflow and agent loop                        | Runtime state schema; pipeline serialization; durable task state is not equivalent to workflow checkpointing | Strong local model options incl Ollama/llama.cpp            | LOCAL_NATIVE / LOCAL_CAPABLE | ADOPT component ports, explicit loops, state schema, serialization; ADAPT side-effect semantics |
| DSPy            | program optimization/evaluation               | Signatures + modules + metrics + optimizers/compile          | Declarative program + evaluation-guided compilation                    | Program state is not an agent session store                                                                  | Model adapters; optimization independent of runtime         | RUNTIME-AGNOSTIC             | ADOPT optimization layer; KEEP OUT of kernel                                                    |
| AutoGen         | historical multi-agent runtime patterns       | agents/messages/group patterns/event runtime                 | Dynamic multi-agent conversation and event runtime                     | Conversation/runtime state; migration now points to Agent Framework                                          | Broad model clients historically                            | LEGACY/MIGRATION             | ADOPT migration lessons and benchmarks; REJECT as new default                                   |
| Semantic Kernel | enterprise AI orchestration/agent SDK history | Kernel/plugins/functions/agent framework                     | Typed enterprise abstractions, dependency injection, filters/telemetry | Session/thread concepts; now successorized                                                                   | Broad provider ecosystem incl local historical integrations | LEGACY/MIGRATION             | ADOPT type-safety/filter/telemetry lessons; REJECT kernel-centered coupling                     |

## Founder conclusion

No single framework provides the correct LabLaunchPad kernel. The highest-confidence extraction is a **small capability kernel plus optional explicit execution layers**:

`AgentKernel -> Capability -> Context -> Policy -> Runtime -> State -> EventLog -> Evaluation`

Then compose optional:

- `WorkflowEngine` for durable/branching/long-running work.
- `KnowledgeEngine` for retrieval/indexing/document context.
- `OptimizationEngine` for DSPy-like evaluation-guided prompt/program optimization.
- `MultiAgentCoordinator` only when task decomposition demonstrably improves outcome.
- `Sandbox/Workspace` as an explicit security boundary rather than a side effect of code execution.

The key design rejection is the false binary of "minimal" versus "feature rich". Minimalism belongs in the kernel; richness belongs in replaceable adapters and execution layers.
