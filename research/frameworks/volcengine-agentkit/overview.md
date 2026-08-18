---
type: Framework Research
title: Volcengine AgentKit / VeADK
description: Local-first posture, model coupling, and licensing for ByteDance's Volcengine AgentKit runtime and VeADK SDK
sources:
  - resource: https://github.com/volcengine/agentkit-sdk-python
    id: agentkit-repo
  - resource: https://github.com/volcengine/agentkit-sdk-python/blob/main/LICENSE
    id: agentkit-license
  - resource: https://github.com/volcengine/veadk-python
    id: veadk-repo
generated:
  by: process:claude-code-session
  at: 2026-08-18T00:00:00Z
status: draft
x_evidence_level: E3
x_coverage: partial
x_provenance: this session independently verified the load-bearing claims below via direct WebFetch of the primary GitHub repositories, after a user-supplied external research pass on this framework was found to have unverifiable citations (bare bracketed reference numbers with no bibliography) and could not be trusted as-is — see research/imported-corpus/SOURCE-RECEIPT-5.md
---

# Volcengine AgentKit / VeADK

> **Coverage note.** This is new-framework research closing one of the
> original 17-source brief's last two remaining `UNKNOWN` entries
> (Volcengine AgentKit, Baidu AppBuilder SDK — see
> `research/reconciliation/RESEARCH-REOPEN-GATES.md`). Local-first,
> licensing, and model-coupling dimensions only — not the full
> multi-dimension depth applied to installments 1-3.

## Local-first classification

| Capability                            | Classification | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AgentKit Runtime (managed deployment) | `CLOUD_ONLY`   | [E3] `agentkit-sdk-python`'s own README describes it as "a fully managed service" — a Starter Toolkit for deploying agents _to_ the Volcengine AgentKit Runtime, not a self-hosted runtime itself                                                                                                                                                                                                                                                                                                                       |
| VeADK model execution                 | `CLOUD_ONLY`   | [E3] Directly fetched `veadk-python`'s README configuration example: `model: agent: provider: openai name: doubao-seed-1-6-250615 api_base: https://ark.cn-beijing.volces.com/api/v3/ api_key: # <-- set your Volcengine ARK api key here`. The `provider: openai` field means it uses an OpenAI-compatible _wire format_, not that it accepts arbitrary OpenAI-compatible endpoints — the shown example is hard-pointed at Volcengine's own `ark.cn-beijing.volces.com` endpoint and requires a Volcengine ARK API key |

**Correction to an external claim, not silently adopted**: a user-supplied
research pass (see `SOURCE-RECEIPT-5.md`) additionally claimed VeADK
"allows configuration of other LLM providers in code" as an `INFERENCE`
with no cited evidence. This session's own direct fetch of the repo's
README shows only the Volcengine ARK endpoint configured in the
documented example — whether arbitrary third-party endpoints are
actually supported was not confirmed either way by this fetch. Recorded
as `UNKNOWN`, not inferred from the SDK's provider-field naming.

## Core primitives

VeADK/AgentKit platform-specific concepts observed in the fetched
README: "AgentKit Runtime" (the managed deployment target),
"AgentKit Application". [E3]

## Licensing

Both `volcengine/agentkit-sdk-python` and `volcengine/veadk-python` are
**Apache-2.0** licensed — confirmed by directly fetching each repository
(README license badge + explicit "Apache 2.0 License" statement in
`agentkit-sdk-python`'s README; "Apache-2.0 license" badge in
`veadk-python`'s README). [E3]

## Language/documentation accessibility

Not independently re-verified this pass beyond what the fetched READMEs
themselves show (English). `UNKNOWN` whether deeper platform
documentation is Chinese-only — a user-supplied research pass claimed
this but the claim's own citation (`[[2]]`) could not be traced to a
checkable URL, so it is not repeated here as fact.

## Unresolved / explicitly not verified this pass

- **"99% token savings" claim**: a user-supplied research pass attributed
  this figure to Volcengine AgentKit, citing `explodential.com/agents`.
  An independent WebSearch this session found no corroborating source for
  this specific claim anywhere, including no reference on Volcengine's
  own properties. **Not adopted as a claim** — recorded here only as a
  claim this session actively checked and could not confirm, so a future
  pass doesn't re-import it uncritically from the same external corpus.
- Tool/function-calling sandboxing model, multi-agent orchestration
  depth, security/prompt-injection posture: not independently verified
  this pass — see `SOURCE-RECEIPT-5.md` for what the external corpus
  claimed (unverified, not repeated as fact here).
- Data residency requirements for the managed AgentKit Runtime: plausible
  given it's a ByteDance/mainland-China cloud service, but not confirmed
  by a fetched primary source this pass — `UNKNOWN`.
