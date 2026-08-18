---
type: Framework Research
title: RUNTIME-LOCAL-FIRST
description: 'Comparison matrix imported from a prior "next wave" external research pass (batch 2, 9 frameworks: Strands Agents, smolagents, AG2, LlamaIndex, Llama Agents, Haystack, DSPy, AutoGen, Semantic Kernel)'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "RUNTIME-LOCAL-FIRST" | title: "Runtime Local First" | date: "2026-08-17" | source_type: "research" | evidence_standard: "E0-E5" | status: "RESEARCH_COMPLETE" | tags: |   - "runtime" |   - "local-first"'
---

# RUNTIME-LOCAL-FIRST

## Local classification

| Ecosystem       | No cloud account                       | Internet-off                          | Local model                          | Local storage                           | Local tools            | Classification         |
| --------------- | -------------------------------------- | ------------------------------------- | ------------------------------------ | --------------------------------------- | ---------------------- | ---------------------- |
| Strands         | feasible with local provider           | plausible, provider/tool dependent    | Ollama documented                    | session persistence local-capable       | Python/tool runtime    | LOCAL_CAPABLE          |
| smolagents      | feasible with local model/provider     | feasible for fully local tools/models | local/HF/provider support            | agent memory local by default           | local Python execution | LOCAL_CAPABLE          |
| AG2             | Ollama documented                      | feasible if model/tools are local     | Ollama native client                 | local/runtime pattern dependent         | local Python/tools     | LOCAL_CAPABLE          |
| LlamaIndex      | strong local data stack                | feasible for local model/data paths   | broad local integrations             | explicit disk persistence               | Python integrations    | LOCAL_CAPABLE          |
| Llama Agents    | depends on selected model/deployment   | workflow runtime can be local         | provider-dependent                   | runtime-dependent                       | local service/runtime  | HYBRID                 |
| Haystack        | strong                                 | strong when local pipeline selected   | HF local, llama.cpp, Ollama          | local serialization/storage             | components/MCP stdio   | LOCAL_NATIVE / CAPABLE |
| DSPy            | model-adapter dependent                | possible with local LM adapter        | adapter dependent                    | local program artifacts possible        | Python                 | RUNTIME-AGNOSTIC       |
| AutoGen         | historical adapters                    | model/runtime dependent               | historically possible                | runtime dependent                       | tools                  | LEGACY/HYBRID          |
| Semantic Kernel | historical provider/local integrations | possible but successor is preferred   | successor explicitly supports Ollama | persistence via session/thread adapters | plugins/functions      | LEGACY/HYBRID          |

## LabLaunchPad decision

Do not define "local-first" as "can point at localhost". Define it as a **capability contract**:

1. `CloudAccount = optional`
2. `Network = denyable`
3. `ModelProvider = local/remote interchangeable`
4. `Storage = filesystem/sqlite/embedded selectable`
5. `Tools = explicit capability grants`
6. `Observability = local sink required`
7. `Evaluation = runnable offline where tests do not require frontier models`

A component is only LOCAL_NATIVE when the full workflow can execute without cloud credentials and without mandatory network dependencies.
