---
type: Framework Research
title: OpenAI Agents SDK
description: Local-first posture, built-in capability inventory and licensing for the OpenAI Agents SDK
sources:
  - resource: https://openai.github.io/openai-agents-python/tools/
    id: oai-tools
  - resource: https://openai.github.io/openai-agents-python/guardrails/
    id: oai-guardrails
  - resource: https://openai.github.io/openai-agents-python/ref/tool_guardrails/
    id: oai-tool-guardrails
  - resource: https://github.com/openai/openai-agents-python/blob/main/LICENSE
    id: oai-license
  - resource: https://openai.github.io/openai-agents-python/sessions/
    id: oai-sessions
  - resource: https://openai.github.io/openai-agents-js/guides/sessions/
    id: oai-sessions-js
generated:
  by: process:claude-code-session
  at: 2026-08-16T00:00:00Z
status: draft
x_evidence_level: E3
x_coverage: partial
---

# OpenAI Agents SDK

> **Coverage note.** This installment covers local-first execution, built-in
> tool inventory, guardrails, sessions and licensing — the dimensions the
> research phase weighted most heavily. State/memory internals, evaluation
> tooling, and full UX/DX audit are **not yet covered** — see `x_coverage:
partial` and the deferred list in `docs/agent/NEXT.md`.

## Licensing [E3]

MIT License, copyright OpenAI 2025.[^oai-license] Permissive: commercial use,
modification and redistribution permitted with copyright/license notice
retained. **Pattern-only extraction from this repository is unnecessary for
architecture ideas** — MIT permits source reuse — but LabLaunchPad's own
license terms for the SDK are a separate decision not addressed here.

## Local-first classification

| Capability                                      | Classification                                                                                                         | Evidence             |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `ShellTool`                                     | LOCAL_NATIVE — runs locally by default; can optionally run in a hosted container                                       | [E3] oai-tools       |
| `ComputerTool`                                  | LOCAL_WITH_ADAPTER — requires the caller to implement a `Computer`/`AsyncComputer` interface; execution is local       | [E3] oai-tools       |
| `ApplyPatchTool`                                | LOCAL_WITH_ADAPTER — requires a caller-supplied `ApplyPatchEditor`; local file edits                                   | [E3] oai-tools       |
| `FunctionTool`                                  | LOCAL_NATIVE — wraps any local function                                                                                | [E3] oai-tools       |
| `LocalShellTool`                                | LOCAL_NATIVE — legacy local shell integration                                                                          | [E3] oai-tools       |
| `WebSearchTool`                                 | CLOUD_ONLY — executes on OpenAI infrastructure                                                                         | [E3] oai-tools       |
| `FileSearchTool`                                | CLOUD_ONLY — requires OpenAI Vector Stores                                                                             | [E3] oai-tools       |
| `CodeInterpreterTool`                           | CLOUD_ONLY — hosted sandboxed execution                                                                                | [E3] oai-tools       |
| `ImageGenerationTool`                           | CLOUD_ONLY                                                                                                             | [E3] oai-tools       |
| `HostedMCPTool`                                 | CLOUD_ONLY — proxies a remote MCP server                                                                               | [E3] oai-tools       |
| Sessions (`MemorySession`)                      | LOCAL_NATIVE — explicitly "intended for local development"; pluggable storage backend via a shared `Session` interface | [E3] oai-sessions-js |
| Sessions (`OpenAIConversationsSession`)         | CLOUD_ONLY — backed by the Conversations API                                                                           | [E3] oai-sessions-js |
| Compaction (`OpenAIResponsesCompactionSession`) | CLOUD_ONLY — calls the OpenAI Responses API (`responses.compact`) to shrink history                                    | [E3] websearch       |

**Verdict**: the SDK is **not local-first by default**, but it is
**local-capable via an explicit split** — a caller who avoids the
cloud-only tool classes (WebSearch, FileSearch, CodeInterpreter, hosted
sessions/compaction) and supplies local `Computer`/`ApplyPatchEditor`
implementations can run entirely without a hosted control plane. This
matches PydanticAI's provider-adaptive pattern in spirit (native tool OR
local implementation) but OpenAI's version is explicit and manual rather
than automatically negotiated — see the Contradiction Matrix entry
`research/contradictions/local-execution-cheaper.md` for a related caveat.

## Guardrails: agent-level vs tool-level [E3, oai-guardrails / oai-tool-guardrails]

Two distinct guardrail mechanisms, not one:

- **Agent-level guardrails** run on overall agent input/output.
- **Tool guardrails** (`ToolInputGuardrailTripwireTriggered`,
  `ToolOutputGuardrailTripwireTriggered`) run _specifically_ on the function
  tools they are attached to — before invocation (input) and after
  invocation (output). A tool guardrail can reject the call/output and
  continue with a message to the model, or raise to halt execution.

**This directly confirms the architecture requirement in AGENTS.md's Policy
Gate**: "Do not rely only on system prompt / agent instruction / final
output guardrail. Tool input/output must be independently policy-aware
where required." OpenAI's own SDK draws exactly this line, for exactly the
stated reason — validation needs to happen "right at the point where the
agent is about to take a real-world action," which a single agent-level
guardrail cannot guarantee for every downstream tool call.

## LabLaunchPad extraction

| Pattern                                                                    | Adopt / Adapt / Reject                 | Rationale                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tool-level guardrails distinct from agent-level guardrails                 | **ADOPT** (pattern only, re-specified) | Confirms an architectural requirement already in this repository's Policy Gate; independent evidence, not the origin of the idea                                                                                                                               |
| Explicit local-vs-hosted tool split, caller opts into local                | **ADAPT**                              | We want automatic capability negotiation (`ModelCapabilityProfile`/`CapabilityImplementationPolicy`, see PydanticAI extraction) rather than manual per-tool choice, but the underlying tool taxonomy (native/adapter-required/cloud-only) is directly reusable |
| Session interface with pluggable storage, one local implementation shipped | **ADOPT** (pattern only)               | Matches our `StateStore`/`SessionStore` interface-first design from ADR-0006                                                                                                                                                                                   |

## Open questions

- Whether `ShellTool`'s "hosted container" mode shares any code path with
  the local mode, or is a fully separate implementation — UNKNOWN, requires
  reading source rather than docs.
- Full evaluation/tracing local-first posture — not yet researched.
