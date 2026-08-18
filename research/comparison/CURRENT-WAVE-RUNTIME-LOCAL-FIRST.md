---
type: Framework Research
title: Runtime and Local-First Analysis
description: 'Comparison matrix: Runtime and Local-First Analysis, imported from the "current wave" research corpus'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus ("current wave"), URLs not independently re-verified via WebFetch/WebSearch in this session - treat as DOCUMENTED_NOT_REPRODUCED
---

# Runtime and Local-First Analysis

## Strict definition

LabLaunchPad should label a runtime `LOCAL_FIRST` only after demonstrating:

- no mandatory cloud account
- network can be disabled
- local model can execute
- local storage can execute
- local tools can execute
- local observability works
- evaluation can run locally where applicable
- secrets need not leave device

Otherwise use LOCAL_CAPABLE, HYBRID, CLOUD_DEPENDENT or UNKNOWN.

## Findings

### OpenAI Agents SDK

The Python SDK supports local runtime implementations for computer, shell and patch tools; its docs also provide a local sandbox client. Non-OpenAI providers are supported through provider abstractions and best-effort adapters. This is **LOCAL_CAPABLE**, not proof of LOCAL_FIRST. [OpenAI tools](https://openai.github.io/openai-agents-python/tools/) [OpenAI sandbox](https://openai.github.io/openai-agents-python/sandbox_agents/) [OpenAI models](https://openai.github.io/openai-agents-python/models/)

### Microsoft Agent Framework

Current docs support multiple model/provider backends, and the latest Python release adds local and Docker shell execution. This is **LOCAL_CAPABLE/HYBRID** until offline evaluation and complete local observability are independently reproduced. [Microsoft overview](https://learn.microsoft.com/en-us/agent-framework/overview/) [Release](https://github.com/microsoft/agent-framework/releases)

### MCP

MCP supports local stdio and HTTP-oriented deployments; its 2026-07-28 revision makes the protocol core stateless. Local transport availability does not make an application local-first. [MCP](https://blog.modelcontextprotocol.io/posts/2026-07-28/)

### A2A

A2A is HTTP(S)-oriented, so it should be treated as a network protocol by default. Local use is implementation/deployment specific. [A2A](https://a2a-protocol.org/latest/topics/key-concepts/)

## Decision

LabLaunchPad should make **local capability a runtime property with a testable contract**, not a marketing label.
