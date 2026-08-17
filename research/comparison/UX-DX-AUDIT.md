---
type: Research Consolidation Report
title: UX/DX Comparative Audit
description: Time-to-first-run, CLI/SDK ergonomics, and documentation completeness across the installments 1-3 framework set plus Volcengine AgentKit and Baidu AppBuilder SDK
sources:
  - resource: research/frameworks/volcengine-agentkit/overview.md
    id: volcengine
  - resource: research/frameworks/baidu-appbuilder-sdk/overview.md
    id: baidu
  - resource: research/frameworks/pydantic-ai/overview.md
    id: pydantic-ai
  - resource: research/frameworks/kimi-agent-sdk/overview.md
    id: kimi
  - resource: research/comparison/DX-AX-OX-UX-PX-MATRIX.md
    id: prior-dx-matrix
generated:
  by: process:claude-code-session
  at: 2026-08-18T00:00:00Z
status: draft
x_evidence_level: E2
x_coverage: partial
x_provenance: substantially adapted from a user-supplied external research pass whose citations were unverifiable bare bracketed numbers with no bibliography (see research/imported-corpus/SOURCE-RECEIPT-5.md); claims retained here are either independently verified this session or explicitly tagged DOCUMENTED_NOT_REPRODUCED
---

# UX/DX Comparative Audit

> **Scope note**: `research/comparison/DX-AX-OX-UX-PX-MATRIX.md` already
> covers the 5-framework batch-1 supplementary corpus (OpenHands, Letta,
> Google ADK, Browser Use, CrewAI) under a DX/AX/OX/UX/PX rubric. This
> document uses a narrower UX/DX-only lens over a different framework
> set: the installments 1-3 core frameworks plus the two new frameworks
> from this pass.

## Time-to-first-run

| Framework                   | Friction                                                                                                                                                                                        | Evidence                                                                                                                 |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Volcengine AgentKit / VeADK | High — requires a Volcengine cloud account and an ARK API key before any local code runs (confirmed: the documented config example has no working default, `api_key` is a required blank field) | [E3] `research/frameworks/volcengine-agentkit/overview.md`                                                               |
| Baidu AppBuilder SDK        | High — requires setting `APPBUILDER_TOKEN` from a Baidu Qianfan account before any call succeeds                                                                                                | [E3] `research/frameworks/baidu-appbuilder-sdk/overview.md`                                                              |
| PydanticAI                  | Low — `pip install pydantic-ai`, define a Pydantic model, point at any OpenAI-compatible key; no framework-specific account needed                                                              | [E3] existing `research/frameworks/pydantic-ai/overview.md` licensing/durable-execution research + this pass's deepening |
| Kimi Agent SDK              | Low local setup, but hard-gated by a mandatory Moonshot API key before the agent can actually run (confirmed this pass — no self-hosted path exists)                                            | [E3] `research/frameworks/kimi-agent-sdk/overview.md`'s deepening pass                                                   |

## CLI vs SDK ergonomics

`DOCUMENTED_NOT_REPRODUCED` — carried from the external research pass,
not independently re-verified this session: Volcengine's own CLI (for
`agentkit-sdk-python`) reportedly adds cloud-authentication boilerplate
rather than reducing local coding boilerplate; Baidu AppBuilder has no
local CLI for agent execution, only API invocation; Kimi's CLI _is_ the
primary product (already independently confirmed elsewhere in this
corpus — `research/frameworks/kimi-agent-sdk/overview.md`'s existing
"thin SDK, fat shared runtime" finding, itself E3).

## Error message quality

**PydanticAI** — the one claim in this dimension independently
corroborated this session: PydanticAI's own docs describe validation
failures surfacing through Pydantic's native `ValidationError` type,
giving field-level, type-specific errors rather than a generic failure
message. This is consistent with (not independently re-derived from, but
matching) the external corpus's claim on this specific point. [E3,
inferred from PydanticAI's own documented validation-first design
described in this session's deepening pass — not a direct fetch of a
troubleshooting doc]

Volcengine/Baidu/Kimi error-message quality: not assessed this pass —
`NOT_EXECUTED`.

## Debugging/observability tooling

`DOCUMENTED_NOT_REPRODUCED` for Volcengine (external corpus claimed deep
integration with a "Full-Stack Observability platform") and Baidu
(external corpus claimed platform-level console logging only) — neither
independently re-verified this session. PydanticAI is separately and
independently known (E3, from this repo's own installment-1 research) to
integrate with standard Python logging/OpenTelemetry rather than shipping
a proprietary dashboard.

## Documentation completeness

Volcengine and Baidu both mix Chinese and English documentation, per this
session's own direct fetches (see each framework's overview.md) — this
is independently confirmed, not carried from the external corpus's
unverified claim.

## Limitations

1. Qwen-Agent, Tencent Youtu-Agent, LangGraph, and Mastra were not
   assessed for this specific dimension this pass — same deferral as
   `TOKEN-CONTEXT-EFFICIENCY.md`.
2. "Community support signals" (issue-tracker response time, forum
   activity) from the external corpus are omitted entirely from this
   document — the source corpus itself rated this dimension no higher
   than E1/E2, and this session did not attempt to independently
   reproduce a statistic-shaped claim (response time, activity level)
   that neither corpus actually computed rigorously.
