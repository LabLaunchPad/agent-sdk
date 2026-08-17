---
type: Framework Research
title: LabLaunchPad Agent SDK — Current-Wave Master Matrix
description: 'Comparison matrix: LabLaunchPad Agent SDK — Current-Wave Master Matrix, imported from the "current wave" research corpus'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus ("current wave"), URLs not independently re-verified via WebFetch/WebSearch in this session - treat as DOCUMENTED_NOT_REPRODUCED
---

# LabLaunchPad Agent SDK — Current-Wave Master Matrix

**Research date:** 2026-08-17
**Scope:** current-generation P0/P1 wave only; prior-wave ecosystems reused per user-provided corpus summary.
**Evidence ceiling:** E4 for source-backed findings in this pass; no E5 claims.

## Executive conclusion

The current ecosystem is converging on a layered model:

`small agent kernel -> capability/tool boundary -> context/state -> explicit workflow/durable execution -> observability/evaluation`

The important architectural split is no longer “agent vs workflow” but **dynamic agent loop vs explicit execution semantics**. Microsoft Agent Framework explicitly recommends agents for open-ended work and workflows for well-defined processes, while OpenAI Agents SDK intentionally keeps a small core and layers sessions, guardrails, tracing, MCP, sandbox execution, and orchestration around it. [OpenAI](https://openai.github.io/openai-agents-python/) [Microsoft](https://learn.microsoft.com/en-us/agent-framework/overview/)

| Area              | OpenAI Agents SDK                                                                                | Microsoft Agent Framework                       | MCP                                       | A2A                                     | Durable execution                                  | Browser/computer-use                             | Security                              | LabLaunchPad extraction                                 |
| ----------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------- | ----------------------------------------- | --------------------------------------- | -------------------------------------------------- | ------------------------------------------------ | ------------------------------------- | ------------------------------------------------------- |
| Core abstraction  | Agent + Runner + tools/handoffs/guardrails                                                       | Agent + Harness + Workflow                      | protocol primitives                       | AgentCard + Task + Message + Artifact   | workflow/task history + replay/checkpoint          | browser state + action loop                      | capability/source/sink controls       | Agent Kernel + Capability + Runtime                     |
| Explicit workflow | Secondary; orchestration patterns                                                                | First-class graph workflows                     | Not a workflow engine                     | Task lifecycle, not internal workflow   | First-class                                        | Usually agent-driven                             | Policy layer                          | Workflow Engine optional but first-class adapter        |
| State             | Sessions / RunState / sandbox state                                                              | Sessions, checkpoints, persistence              | Tasks, but protocol-level                 | Task state + contextId                  | Durable execution state                            | browser/session/history                          | security state                        | State is explicit, typed, durable/ephemeral classified  |
| Memory            | session history; sandbox memory                                                                  | context providers + memory/persistence          | resources/context, not memory             | contextId + task history                | state history, not semantic memory                 | page/history/message compaction                  | memory poisoning is a security domain | Memory != State != Context                              |
| Context           | run input shaping, sessions, tool catalogs                                                       | context providers, compaction, harness          | resource/tool/prompt primitives           | message/parts/artifacts                 | replayed prior results                             | DOM + screenshots + extracted content            | treat external content as data        | Context Engine as independent concern                   |
| Capabilities      | function tools, MCP, hosted tools, sandbox tools                                                 | functions, MCP, providers, harness tools        | tools/resources/prompts                   | declared skills + endpoints             | activity/task capabilities                         | click/type/scroll/DOM/screenshot                 | least privilege + approvals           | Capability objects with policy contracts                |
| Workspace         | sandbox agents, manifests, snapshots                                                             | file/shell tools; Docker in current releases    | out of scope                              | opaque remote agent                     | worker execution                                   | browser profile/session                          | isolation boundary                    | WorkspaceContract + SandboxContract                     |
| Portability       | provider/model abstractions, adapters; feature gaps remain                                       | multi-provider model clients                    | protocol portability                      | protocol portability                    | runtime portability only via adapters              | model/tool/browser dependence                    | semantic portability                  | capability matrix required                              |
| Local-first       | local runtime tools supported; tracing may be separately configured; sandbox local client exists | local + Docker shell path; cloud features exist | stdio/local plus HTTP auth options        | HTTP(S) oriented                        | local/self-host possible, implementation dependent | local browser possible, data/model may be remote | offline must be tested                | LOCAL_NATIVE only after E5                              |
| Multi-agent       | agents-as-tools vs handoffs                                                                      | workflows + agents                              | protocol server/client                    | native inter-agent protocol             | orchestration engine                               | often single agent loop                          | remote-agent trust risk               | benchmark single vs workflow vs multi-agent             |
| Durability        | sessions + sandbox resume; exact guarantees vary                                                 | checkpoint/resume is explicit                   | tasks are durable protocol state machines | long-running stateful tasks             | core property                                      | browser state is not durable semantics           | unknown side-effect first-class       | durable runtime separate from memory                    |
| Evaluation        | tracing/eval ecosystem integration                                                               | telemetry/DevUI and workflow testing surfaces   | protocol compliance/testing               | interoperability + task lifecycle tests | replay/recovery tests                              | trajectory/action eval                           | adversarial/security eval             | Evaluation Engine external to kernel                    |
| Security          | guardrails + tool approvals + sandboxing                                                         | middleware/HITL/hosting security                | authorization + consent principles        | auth declared in AgentCard              | replay/idempotency                                 | prompt injection + action risk                   | OWASP agentic risks                   | capability policy, trust provenance, side-effect ledger |

## P0 priority

1. MCP 2026-07-28 changes are architecture-significant: stateless protocol core, MRTR, header-based routing, cacheable list results, authorization hardening, formal extensions framework. This reduces pressure to model MCP as a sessionful subsystem inside LabLaunchPad. [MCP](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
2. A2A 1.0.1 establishes a mature remote-agent boundary around Agent Cards, Tasks, Messages, Artifacts, streaming and push; remote agents should be treated as opaque external capabilities rather than as shared internal state. [A2A](https://a2a-protocol.org/latest/topics/key-concepts/)
3. Microsoft Agent Framework makes checkpointing/resume and graph workflows first-class, reinforcing separation of runtime durability from agent reasoning. [Microsoft](https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-autogen/)
4. OpenAI sandbox agents turn workspace state, capabilities, snapshots and resume into a concrete agent runtime concern, but sandbox APIs are explicitly beta in the Python docs. [OpenAI](https://openai.github.io/openai-agents-python/sandbox_agents/)
5. Security is moving from “prompt filtering” toward source-to-sink risk control: external content is untrusted input and dangerous capabilities need constrained impact. [OpenAI](https://openai.com/index/designing-agents-to-resist-prompt-injection/) [OWASP](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)

## Reuse versus current-wave delta

Prior wave conclusions that remain supported:

- small semantic kernel
- explicit side-effect contracts
- explicit execution state
- capability-based security
- evaluation as infrastructure
- honest provider capability degradation
- context budgets
- provenance

Current wave strengthens:

- **Workflow is an execution contract, not merely orchestration sugar.**
- **Protocol boundaries (MCP/A2A) should remain adapters at the kernel boundary.**
- **Sandbox/workspace is becoming a first-class execution domain.**
- **Durability must distinguish persisted execution state from semantic memory.**
- **Security must constrain impact even when model/content classification fails.**
