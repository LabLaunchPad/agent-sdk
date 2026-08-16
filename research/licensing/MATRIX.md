---
type: Licensing Matrix
title: Licensing Matrix
description: License, attribution and reuse-restriction status for researched frameworks
sources:
  - resource: https://github.com/openai/openai-agents-python/blob/main/LICENSE
    id: oai-license
  - resource: https://github.com/pydantic/pydantic-ai/blob/main/LICENSE
    id: pai-license
  - resource: https://github.com/MoonshotAI/kimi-agent-sdk
    id: kimi-license
  - resource: https://github.com/QwenLM/Qwen-Agent/blob/main/LICENSE
    id: qwen-license
  - resource: https://github.com/TencentCloudADP/youtu-agent/blob/main/LICENSE
    id: youtu-license
generated:
  by: process:claude-code-session
  at: 2026-08-16T00:00:00Z
status: draft
---

# Licensing Matrix

| Framework                 | License                                                                                                      | Copyright holder                                                                                                       | Attribution required                                         | Redistribution     | Commercial use     | Patent grant                   | Status                                                                                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------ | ------------------ | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OpenAI Agents SDK         | MIT                                                                                                          | OpenAI, 2025                                                                                                           | Yes — copyright + license notice in copies                   | Permitted          | Permitted          | No (MIT is silent on patents)  | **FACT** — LICENSE file directly cited                                                                                                                                      |
| Microsoft Agent Framework | MIT (asserted; not directly confirmed for the primary `microsoft/agent-framework` LICENSE file in this pass) | Microsoft                                                                                                              | Presumed yes if MIT                                          | Presumed permitted | Presumed permitted | No (if MIT)                    | **INFERENCE, not FACT** — confirmed for the _Samples_ repo, not the primary repo. `LICENSE_UNKNOWN` until directly re-verified.                                             |
| PydanticAI                | MIT                                                                                                          | Pydantic Services Inc., 2024–present                                                                                   | Yes                                                          | Permitted          | Permitted          | No                             | **FACT** — LICENSE file directly cited                                                                                                                                      |
| Kimi Agent SDK            | Apache-2.0                                                                                                   | Moonshot AI (implied by repo ownership; not independently confirmed by copyright line)                                 | Yes — plus NOTICE-file obligation Apache-2.0 adds beyond MIT | Permitted          | Permitted          | **Yes — express patent grant** | **FACT** for license identity (badge + LICENSE reference); copyright holder is INFERENCE                                                                                    |
| Qwen-Agent                | Apache-2.0                                                                                                   | **Unfilled in the LICENSE file itself** — template placeholder `Copyright [yyyy] [name of copyright owner]` left as-is | Yes — same Apache-2.0 obligations                            | Permitted          | Permitted          | **Yes — express patent grant** | **FACT** for license type (LICENSE file directly fetched and quoted); copyright holder is a genuine gap in the source, not an inference we chose not to make                |
| Tencent Youtu-Agent       | MIT                                                                                                          | Tencent, 2025                                                                                                          | Yes                                                          | Permitted          | Permitted          | No                             | **FACT** — LICENSE file directly fetched and quoted: "Tencent is pleased to support the open source community by making Youtu-agent available. Copyright (C) 2025 Tencent." |

## Governing rule (from the research brief, restated)

Never assume "open source" = "no obligations," and never assume "public
docs" = "free source-code reuse." All six licenses above are genuinely
permissive and would allow direct source reuse if LabLaunchPad ever wanted
it — but this repository's own policy (ADR-driven, pattern-only extraction
by default) means source reuse is **not currently authorized** regardless
of what the upstream license would permit. License permission and
LabLaunchPad's own reuse policy are two different gates; both licenses
being permissive does not change the second gate.

## Noteworthy: Qwen-Agent's incomplete LICENSE file

Apache-2.0's template requires the copyright line to be filled in with the
actual holder and year; Qwen-Agent's repository ships the file with the
placeholder still present. This does not change the license _type_ (still
verifiably Apache-2.0 from the file's body text), but it means "copyright
holder: Alibaba/QwenLM" is this research's own reasonable inference from
repository ownership, not a fact directly readable from the license text —
recorded as such rather than silently treated as equivalent to Youtu-Agent's
complete, specific copyright statement.

## Not yet researched

Volcengine AgentKit, Baidu AppBuilder SDK, LangGraph, Mastra, MCP, A2A,
Agent Skills specification. Each requires its own LICENSE-file fetch before
any claim is recorded here — do not extrapolate a license from a
framework's general "open source" reputation.
