---
type: Framework Research
title: Baidu AppBuilder SDK
description: Local-first posture, model coupling, and licensing for Baidu's AppBuilder SDK (Qianfan platform client)
sources:
  - resource: https://github.com/baidubce/app-builder
    id: appbuilder-repo
generated:
  by: process:claude-code-session
  at: 2026-08-18T00:00:00Z
status: draft
x_evidence_level: E3
x_coverage: partial
x_provenance: this session independently verified the load-bearing claims below via direct WebFetch of the primary GitHub repository plus one independent WebSearch, after a user-supplied external research pass on this framework was found to have unverifiable citations and could not be trusted as-is — see research/imported-corpus/SOURCE-RECEIPT-5.md
---

# Baidu AppBuilder SDK

> **Coverage note.** Closes the second of the original 17-source brief's
> last two remaining `UNKNOWN` entries (alongside Volcengine AgentKit) —
> see `research/reconciliation/RESEARCH-REOPEN-GATES.md`. Local-first,
> licensing, and model-coupling dimensions only.

## Local-first classification

| Capability         | Classification                                       | Evidence                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SDK execution      | `CLOUD_ONLY`                                         | [E3] Directly fetched the repo's README: quickstart requires setting `os.environ["APPBUILDER_TOKEN"]` (mandatory) before any call; body text (Chinese) describes the SDK as invoking "发布的AI原生应用" (published AI-native applications) hosted on Baidu's own AppBuilder web console, and free-tier component usage requiring "申领免费试用额度" (claiming a free trial quota) from Baidu's service |
| Architecture shape | AppBuilder-as-a-Service, not a self-hostable library | [E3] Same fetch — the SDK is a thin client wrapping the hosted Qianfan AppBuilder platform; there is no documented self-hosted runtime path                                                                                                                                                                                                                                                            |

## Model coupling — corrected from an external claim, not silently adopted

A user-supplied research pass (see `SOURCE-RECEIPT-5.md`) classified this
framework as "architecturally bound to ERNIE" (`FACT`, cited only as a
bare, untraceable reference number). An independent WebSearch this
session found this to be **too narrow**: Baidu's AI Studio LLM API
(which AppBuilder builds on) is documented as compatible with the
`openai-python` SDK format and explicitly supports **DeepSeek-V3.1** in
addition to ERNIE models — not an ERNIE-exclusive architecture. [E2/E3,
WebSearch corroborated by multiple independent results, not a single
vendor page]

This is recorded as a correction, per this repository's standing rule of
never silently resolving a contradiction between an external claim and
what independent verification actually shows.

## Licensing

`baidubce/app-builder` is **Apache-2.0** licensed — confirmed by directly
fetching the repository (license badge: `license-Apache%202-blue.svg`;
footer text "AppBuilder-SDK遵循Apache-2.0开源协议" — "AppBuilder-SDK follows
the Apache-2.0 open-source license"). [E3]

## Language/documentation accessibility

The fetched README mixes English section headers with substantial
Chinese-language body text (quickstart instructions, component
descriptions) — both languages present, not English-only. [E3, directly
observed in the fetched content]

## Unresolved / explicitly not verified this pass

- Whether self-hosted ERNIE weights (reportedly open-sourced per
  independent search results, separate from AppBuilder itself) can be
  pointed at from the AppBuilder SDK specifically: `UNKNOWN` — the
  open-weight release and the AppBuilder SDK's own configuration surface
  are two separate questions this pass did not cross-verify.
- Multi-agent orchestration depth, tool/function-calling sandboxing
  model, security posture, data residency terms: not independently
  verified this pass — see `SOURCE-RECEIPT-5.md` for the external
  corpus's unverified claims (not repeated here as fact).
