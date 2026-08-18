---
type: Framework Research
title: Portability
description: 'Comparison matrix: Portability, imported from the "current wave" research corpus'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus ("current wave"), URLs not independently re-verified via WebFetch/WebSearch in this session - treat as DOCUMENTED_NOT_REPRODUCED
---

# Portability

## Core rule

Semantic portability > API compatibility.

OpenAI's SDK documents provider integration through built-in provider hooks and third-party adapters, while explicitly warning that feature support and request semantics vary by provider. [OpenAI](https://openai.github.io/openai-agents-python/models/)

Microsoft's framework supports multiple model providers and agent hosting integrations, but capability coverage remains provider-dependent. [Microsoft](https://learn.microsoft.com/en-us/agent-framework/overview/)

## LabLaunchPad ModelCapability contract

```yaml
ModelCapability:
  tool_calling: NATIVE|SUPPORTED|DEGRADED|UNSUPPORTED|UNKNOWN
  structured_output: NATIVE|SUPPORTED|DEGRADED|UNSUPPORTED|UNKNOWN
  streaming: NATIVE|SUPPORTED|DEGRADED|UNSUPPORTED|UNKNOWN
  vision: NATIVE|SUPPORTED|DEGRADED|UNSUPPORTED|UNKNOWN
  audio: NATIVE|SUPPORTED|DEGRADED|UNSUPPORTED|UNKNOWN
  reasoning: NATIVE|SUPPORTED|DEGRADED|UNSUPPORTED|UNKNOWN
  context_window: numeric_or_UNKNOWN
  parallel_tools: NATIVE|SUPPORTED|DEGRADED|UNSUPPORTED|UNKNOWN
  fallback: SUPPORTED|UNSUPPORTED|UNKNOWN
  routing: SUPPORTED|UNSUPPORTED|UNKNOWN
  local_execution: SUPPORTED|UNSUPPORTED|UNKNOWN
```

## Policy

No “model agnostic” claim without capability tests. No “drop-in compatible” claim without semantic contract tests.
