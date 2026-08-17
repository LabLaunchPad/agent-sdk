---
type: Framework Research
title: Evidence-Backed Contradictions
description: 'Comparison matrix: Evidence-Backed Contradictions, imported from the "current wave" research corpus'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus ("current wave"), URLs not independently re-verified via WebFetch/WebSearch in this session - treat as DOCUMENTED_NOT_REPRODUCED
---

# Evidence-Backed Contradictions

## 1. Small kernel vs rich runtime

**Evidence A:** OpenAI emphasizes very few primitives. [OpenAI](https://openai.github.io/openai-agents-python/)

**Evidence B:** Microsoft exposes agents, harnesses, workflows, sessions, context providers, middleware, telemetry and hosting. [Microsoft](https://learn.microsoft.com/en-us/agent-framework/overview/)

**Where A wins:** simple tasks, low onboarding cost, composability.

**Where B wins:** durable, policy-heavy, enterprise workflows.

**LabLaunchPad:** ADOPT small kernel; ADAPT optional runtime modules.

## 2. Dynamic agent loop vs explicit workflow

**Evidence A:** OpenAI supports manager/specialist orchestration via agents-as-tools and handoffs. [OpenAI](https://openai.github.io/openai-agents-python/multi_agent/)

**Evidence B:** Microsoft explicitly recommends workflows for well-defined processes. [Microsoft](https://learn.microsoft.com/en-us/agent-framework/overview/)

**LabLaunchPad:** SELECT based on uncertainty/coordination need, benchmark rather than defaulting to multi-agent.

## 3. Stateful sessions vs stateless protocol core

**Evidence A:** OpenAI sessions persist conversation history. [OpenAI](https://openai.github.io/openai-agents-python/sessions/)

**Evidence B:** MCP 2026-07-28 removes handshake/session requirements from the protocol core. [MCP](https://blog.modelcontextprotocol.io/posts/2026-07-28/)

**LabLaunchPad:** keep state in runtime/application; keep protocol adapters stateless where protocol permits.

## 4. Rich context vs token efficiency

**Evidence A:** Browser agents combine DOM/markdown, screenshots, memory and history. [browser-use](https://github.com/browser-use/browser-use/blob/main/browser_use/agent/service.py)

**Evidence B:** browser-use explicitly compacts history and filters content; MCP adds cacheable list results. [browser-use](https://github.com/browser-use/browser-use/blob/main/browser_use/agent/service.py) [MCP](https://blog.modelcontextprotocol.io/posts/2026-07-28/)

**LabLaunchPad:** context must be selected and budgeted, never blindly maximized.

## 5. Durable execution vs execution convenience

**Evidence A:** Microsoft workflows provide checkpointing/resume. [Microsoft](https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-autogen/)

**Evidence B:** durable execution systems require side-effect discipline/idempotency. [LangGraph](https://docs.langchain.com/oss/python/langgraph/functional-api)

**LabLaunchPad:** durability is a separate contract with explicit side-effect semantics.

## 6. Managed sandbox vs local execution

**Evidence A:** OpenAI provides sandbox harnesses and hosted/container modes. [OpenAI](https://openai.github.io/openai-agents-python/sandbox_agents/)

**Evidence B:** OpenAI also supports local tool implementations. [OpenAI](https://openai.github.io/openai-agents-python/tools/)

**LabLaunchPad:** pluggable sandbox; never conflate local-capable with local-first.

## 7. Security filtering vs impact containment

**Evidence A:** traditional guardrails can block dangerous inputs/outputs. [OpenAI](https://openai.github.io/openai-agents-python/guardrails/)

**Evidence B:** modern prompt injection increasingly resembles social engineering, so detection alone is insufficient. [OpenAI](https://openai.com/index/designing-agents-to-resist-prompt-injection/)

**LabLaunchPad:** guardrails + source/sink controls + capability policy.

## 8. Remote-agent interoperability vs trust

**Evidence A:** A2A makes remote agents discoverable via Agent Cards and supports async tasks. [A2A](https://a2a-protocol.org/latest/topics/key-concepts/)

**Evidence B:** OWASP explicitly identifies insecure inter-agent communication, supply chain vulnerabilities and rogue agents. [OWASP](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)

**LabLaunchPad:** treat A2A peers as untrusted remote capabilities until authenticated/authorized.
