---
type: Framework Research
title: CAPABILITY-MATRIX
description: 'Comparison matrix imported from a prior "next wave" external research pass (batch 2, 9 frameworks: Strands Agents, smolagents, AG2, LlamaIndex, Llama Agents, Haystack, DSPy, AutoGen, Semantic Kernel)'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "CAPABILITY-MATRIX" | title: "Capability Matrix" | date: "2026-08-17" | source_type: "research" | evidence_standard: "E0-E5" | status: "RESEARCH_COMPLETE" | tags: |   - "capabilities"'
---

# CAPABILITY-MATRIX

| Capability            | Strands                     | smolagents                                  | AG2                              | LlamaIndex                                       | Llama Agents                   | Haystack                                                        | DSPy                  | AutoGen                     | Semantic Kernel                          |
| --------------------- | --------------------------- | ------------------------------------------- | -------------------------------- | ------------------------------------------------ | ------------------------------ | --------------------------------------------------------------- | --------------------- | --------------------------- | ---------------------------------------- |
| Core loop             | explicit/simple             | explicit/simple                             | chat/runtime                     | agent/workflow                                   | step/event                     | explicit agent loop                                             | program execution     | runtime/conversation        | kernel/agent                             |
| Explicit workflow     | optional                    | limited                                     | strong                           | strong                                           | core                           | strong                                                          | program composition   | strong                      | strong                                   |
| Multi-agent           | supported                   | managed agents                              | core strength                    | supported                                        | supported via workflows        | supported via composition                                       | not core              | core strength               | supported                                |
| Durable session/state | session persistence         | not core                                    | pattern-dependent                | storage is explicit, not same as task checkpoint | workflow execution model       | state schema + serialization, not full task checkpoint contract | not core              | historical/runtime state    | session/thread                           |
| Local model           | Ollama                      | local/HF/provider adapters                  | Ollama                           | broad local integrations                         | deployment/provider dependent  | strong local stack                                              | adapter-driven        | historical provider clients | migration-era; successor supports Ollama |
| Evaluation            | dedicated SDK               | monitoring/logging; external eval ecosystem | beta eval + AutoGenBench lineage | evaluation subsystem                             | workflow testing possible      | component/pipeline eval                                         | evaluation is central | AutoGenBench                | telemetry/eval patterns                  |
| MCP                   | ecosystem support           | tools/integrations                          | supported                        | ecosystem support                                | supports MCP server deployment | dynamic MCPToolset                                              |
| Sandboxing            | runtime/deployment-specific | sandboxing is explicit option               | Docker commonly used in bench    | deployment-dependent                             | deployment-dependent           | external runtime/deployment                                     | not core              | Docker bench pattern        | deployment dependent                     |

## Interpretation

Explicitness pays when the system must explain, resume, test or constrain execution. Model-driven minimalism pays when the task is short-lived and tool choice can remain inside the model loop. LabLaunchPad should therefore make explicit control **available without making it mandatory**.
