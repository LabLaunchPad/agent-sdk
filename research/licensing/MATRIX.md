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
  - resource: https://github.com/langchain-ai/langgraph/blob/main/LICENSE
    id: langgraph-license
  - resource: https://github.com/mastra-ai/mastra/blob/main/LICENSE.md
    id: mastra-license
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_coverage: 7 of 17 sources
---

# Licensing Matrix

| Framework                 | License                                                                                                                                                                                                                                                               | Copyright holder                                                                                                       | Attribution required                                         | Redistribution                                               | Commercial use                                                                                                                   | Patent grant                                                                                 | Whole tree checked?                                                                                                  | Status                                                                                                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OpenAI Agents SDK         | MIT                                                                                                                                                                                                                                                                   | OpenAI, 2025                                                                                                           | Yes — copyright + license notice in copies                   | Permitted                                                    | Permitted                                                                                                                        | No (MIT is silent on patents)                                                                | No — root LICENSE only, per installment 1-2 methodology                                                              | **FACT** — LICENSE file directly cited                                                                                                                                       |
| Microsoft Agent Framework | MIT (asserted; not directly confirmed for the primary `microsoft/agent-framework` LICENSE file in this pass)                                                                                                                                                          | Microsoft                                                                                                              | Presumed yes if MIT                                          | Presumed permitted                                           | Presumed permitted                                                                                                               | No (if MIT)                                                                                  | No                                                                                                                   | **INFERENCE, not FACT** — confirmed for the _Samples_ repo, not the primary repo. `LICENSE_UNKNOWN` until directly re-verified.                                              |
| PydanticAI                | MIT                                                                                                                                                                                                                                                                   | Pydantic Services Inc., 2024–present                                                                                   | Yes                                                          | Permitted                                                    | Permitted                                                                                                                        | No                                                                                           | No                                                                                                                   | **FACT** — LICENSE file directly cited                                                                                                                                       |
| Kimi Agent SDK            | Apache-2.0                                                                                                                                                                                                                                                            | Moonshot AI (implied by repo ownership; not independently confirmed by copyright line)                                 | Yes — plus NOTICE-file obligation Apache-2.0 adds beyond MIT | Permitted                                                    | Permitted                                                                                                                        | **Yes — express patent grant**                                                               | No                                                                                                                   | **FACT** for license identity (badge + LICENSE reference); copyright holder is INFERENCE                                                                                     |
| Qwen-Agent                | Apache-2.0                                                                                                                                                                                                                                                            | **Unfilled in the LICENSE file itself** — template placeholder `Copyright [yyyy] [name of copyright owner]` left as-is | Yes — same Apache-2.0 obligations                            | Permitted                                                    | Permitted                                                                                                                        | **Yes — express patent grant**                                                               | No                                                                                                                   | **FACT** for license type (LICENSE file directly fetched and quoted); copyright holder is a genuine gap in the source, not an inference we chose not to make                 |
| Tencent Youtu-Agent       | MIT                                                                                                                                                                                                                                                                   | Tencent, 2025                                                                                                          | Yes                                                          | Permitted                                                    | Permitted                                                                                                                        | No                                                                                           | No                                                                                                                   | **FACT** — LICENSE file directly fetched and quoted: "Tencent is pleased to support the open source community by making Youtu-agent available. Copyright (C) 2025 Tencent."  |
| **LangGraph**             | **Split** — core (`langgraph`, `langchain-core`, model integrations) is MIT                                                                                                                                                                                           | LangChain, Inc., 2024                                                                                                  | Yes for MIT-covered code                                     | Permitted for core; restricted for `langgraph-api`           | Permitted for core; **restricted for `langgraph-api`** (Elastic License 2.0 limits offering as a competing hosted service)       | No (MIT core is patent-silent; Elastic 2.0 terms differ, not independently re-verified here) | **Yes — this pass specifically checked beyond the root LICENSE and found the split**                                 | **FACT** — both the core LICENSE and the `langgraph-api`/Elastic split are independently sourced. See `research/contradictions/license-split-by-directory.md`.               |
| **Mastra**                | **Three-tier, not a simple split** — (1) core framework: Apache-2.0; (2) platform (Studio/observability/Memory Gateway): self-hostable or hosted, commercially metered, not a code license per se; (3) Enterprise Edition: separate Mastra Enterprise Edition License | Kepler Software (Mastra maintainers)                                                                                   | Yes for Apache-2.0-covered code                              | Permitted for core; restricted for platform/Enterprise tiers | Permitted for core; **restricted/metered for platform tier; restricted for Enterprise tier** (source-available, not open source) | **Yes — express patent grant for Apache-2.0-covered code**                                   | **Yes — this pass specifically checked beyond the root LICENSE and found three distinguishable tiers, not just two** | **FACT** — Mastra's own licensing docs page and pricing page directly state the platform/Enterprise separation. See `research/contradictions/license-split-by-directory.md`. |

## Governing rule (from the research brief, restated)

Never assume "open source" = "no obligations," and never assume "public
docs" = "free source-code reuse." All licenses recorded above are genuinely
permissive at the core-license level and would allow direct source reuse of
that core if LabLaunchPad ever wanted it — but this repository's own policy
(ADR-driven, pattern-only extraction by default) means source reuse is
**not currently authorized** regardless of what the upstream license would
permit. License permission and LabLaunchPad's own reuse policy are two
different gates; both licenses being permissive does not change the second
gate.

## Installment 3 finding: license splits are common, not rare

LangGraph and Mastra — 2 of the 7 frameworks with a licensing row so far —
both split their license/commercial terms rather than applying one license
uniformly. Neither split was found by checking the root LICENSE file alone;
both required reading further (a secondary blog post for LangGraph, the
framework's own licensing and pricing docs pages for Mastra). This promotes
"check the whole tree/offering, not just the root LICENSE" from a one-off
observation to a standing due-diligence rule for this repository — see
`research/contradictions/license-split-by-directory.md`. The five
frameworks researched in installments 1-2 have **not** been retroactively
re-checked against this rule; their `Whole tree checked?` column is
honestly marked "No," not silently assumed clean.

**Correction to this file's own first draft**: Mastra's row initially
recorded a simple two-way split (core Apache-2.0 vs. `ee/` Enterprise
License). Deeper research found a **third** tier: the platform layer
(Mastra Studio, observability, Memory Gateway) is a separately-metered
commercial product, self-hostable or hosted, distinct from both the
Apache-2.0 framework code and the Enterprise Edition License. Corrected in
the table above, not silently overwritten.

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

Volcengine AgentKit, Baidu AppBuilder SDK, MCP, A2A, Agent Skills
specification. Each requires its own LICENSE-file fetch (and, per the
installment 3 finding above, a whole-tree check, not just the root file)
before any claim is recorded here — do not extrapolate a license from a
framework's general "open source" reputation.
