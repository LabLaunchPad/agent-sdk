---
type: Framework Research
title: Kimi Agent SDK
description: Thin-SDK-over-CLI-runtime pattern and licensing for Moonshot AI's Kimi Agent SDK
sources:
  - resource: https://github.com/MoonshotAI/kimi-agent-sdk
    id: kimi-repo
  - resource: https://github.com/MoonshotAI/kimi-code
    id: kimi-cli-repo
generated:
  by: process:claude-code-session
  at: 2026-08-16T00:00:00Z
status: draft
x_evidence_level: E3
x_coverage: partial
---

# Kimi Agent SDK

> **Coverage note.** This installment covers the thin-SDK architecture
> pattern and licensing. Local-first/offline model support was searched but
> **not confirmed either way** by the primary source — recorded honestly as
> UNKNOWN rather than assumed.

## Licensing [E3]

Apache-2.0, per the repository's license badge and LICENSE file
reference.[^kimi-repo] Permissive, includes an express patent grant (a
detail Apache-2.0 offers that MIT does not) — worth noting if LabLaunchPad
ever reuses Apache-2.0-licensed source directly, since Apache-2.0 carries
a NOTICE-file attribution obligation MIT does not.

## Architecture: thin client over a shared CLI runtime [E3, kimi-repo]

Direct quote: "The SDKs are thin, language-native clients that reuse the
same Kimi CLI configuration, tools, skills, and MCP servers." This is **not**
a case of the SDK reimplementing agent logic per language — Python, Node.js
and Go bindings share:

- CLI configuration
- Custom tool registration
- Skills
- MCP server connections
- Session orchestration
- Approval handling

The underlying Kimi CLI itself moved from Python/uv to TypeScript,
compiling to a single distributable binary that requires no separate
Node.js installation to run.

**This is the cleanest example found so far of the "thin SDK, fat shared
runtime" pattern** the original research brief called out as a precedent
for LabLaunchPad's own future language-binding strategy (ADR-0001: contracts
are language-neutral, TypeScript is canonical, other languages arrive as
bindings later — not parallel implementations).

## LabLaunchPad extraction

| Pattern                                                                           | Adopt / Adapt / Reject   | Rationale                                                                                                                                                                                  |
| --------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| One runtime, many thin language bindings sharing config/tools/skills/MCP/sessions | **ADOPT** (pattern only) | Directly validates ADR-0001's binding strategy — independent evidence that a real, shipping multi-language agent SDK chose the same shape we already committed to                          |
| CLI-as-execution-engine, SDK as a client of it                                    | **ADAPT**                | LabLaunchPad's canonical runtime is a library (`@lablaunchpad/agent-sdk`), not necessarily a CLI process — the _shared-runtime_ idea transfers, the specific CLI-process mechanism may not |

## Deepening pass [2026-08-18, E3] — closes the local-first UNKNOWN below

> Independently verified via direct WebFetch of Moonshot's own platform
> docs, after a user-supplied external research pass on this framework
> was found to have unverifiable citations and could not be trusted as-is
> — see `research/imported-corpus/SOURCE-RECEIPT-5.md`.

**Local-first classification: `CLOUD_ONLY`** (resolved, was `UNKNOWN`).
Directly fetched `https://platform.kimi.com/docs`: the documented API
usage requires "你需要从 Kimi 开放平台中创建一个 API Key" ("you need to
create an API Key from the Kimi open platform"), and the docs state
compatibility "兼容 OpenAI API 格式" (compatible with the OpenAI API
format) — a wire-format compatibility statement, not evidence of
self-hosted model support. No documented path to a self-hosted or
open-weight Kimi model endpoint was found anywhere in the fetched
documentation. [E3]

This is the answer, not a restatement of the gap: the prior installment
correctly identified this as unknown; this pass closes it with a
`CLOUD_ONLY` classification rather than leaving it open again.

## Open questions

- Full built-in capability inventory — not yet researched.
- Security/sandbox boundary for local tool execution — not yet researched.
