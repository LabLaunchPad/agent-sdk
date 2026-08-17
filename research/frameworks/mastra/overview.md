---
type: Framework Research
title: Mastra
description: Agent/workflow/memory/observability composability, Workspace (filesystem/command execution/search/skills), three-tier licensing (framework/platform/enterprise), LibSQL local storage for Mastra
sources:
  - resource: https://github.com/mastra-ai/mastra/blob/main/LICENSE.md
    id: mastra-license
  - resource: https://mastra.ai/docs/community/licensing
    id: mastra-license-docs
  - resource: https://mastra.ai/pricing
    id: mastra-pricing
  - resource: https://mastra.ai/reference/storage/libsql
    id: mastra-libsql
  - resource: https://mastra.ai/docs/workspace/overview
    id: mastra-workspace
  - resource: https://mastra.ai/reference/workspace/workspace-class
    id: mastra-workspace-class
  - resource: https://mastra.ai/templates/agent-harness
    id: mastra-harness-template
  - resource: https://mastra.ai/
    id: mastra-home
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_evidence_level: E3
x_coverage: architecture, Workspace (filesystem/command execution/search/skills), three-tier licensing, local-first storage — full 40-dimension depth not yet researched
---

# Mastra

> **Coverage note.** This installment covers architecture composability
> (agents/workflows/memory/observability), the Workspace capability
> (filesystem/command execution/search/skills/permissions), the Agent
> Harness template, a corrected three-tier licensing breakdown, and
> LibSQL-backed local storage. Full evaluation/DX/AX/OX/PX matrix not yet
> researched.
>
> **Correction to this file's own first draft**: the initial pass recorded
> licensing as a single "Apache-2.0 core / `ee/` Enterprise License" split
> and did not research Workspace or Harness at all. Mastra's actual
> licensing surface has three distinguishable tiers (framework, platform,
> enterprise/self-hosted), and Workspace is directly relevant to this
> repository's own local-first capability model — both corrected below.

## Licensing [E3] — three tiers, not two

Mastra's licensing is more nuanced than a single core/enterprise split:

1. **Framework license**: the core framework and the large majority of the
   codebase is **Apache License 2.0** — genuinely open source, permissive,
   patent grant included.[^mastra-license]
2. **Platform license**: Mastra Studio (the observability/debugging UI),
   the observability dashboard, and the Memory Gateway are **the platform
   layer** — available either as a hosted cloud service (Mastra Cloud) or
   self-hosted; pricing is metered by observability events and CPU-hours
   (free tier: 100K events / 24 CPU-hours per month; Teams tier: $250/mo
   for 1M events / 250 CPU-hours; Enterprise: custom).[^mastra-pricing]
   Self-hostable, but **not simply "Apache-2.0 covers it"** — it is a
   commercially metered product, distinct from the framework license.
3. **Enterprise license**: the Mastra Enterprise Edition extends the
   Community Edition with additional features (custom volume/retention,
   RBAC, audit logs, dedicated support, uptime SLAs) under the separate
   **Mastra Enterprise Edition License**, deployable self-hosted in a
   customer's own cloud or on-premises infrastructure.[^mastra-license-docs]

**LabLaunchPad implication**: recording this as a single license field
("Mastra = Apache-2.0") would have been a strictly worse finding than what
`research/licensing/MATRIX.md` now records — framework code, platform
product, and enterprise features are three separate offerings with three
separate terms, and only the first is unconditionally open source. This
reinforces (a third time, after LangGraph's two-way split) the "check the
whole tree/offering, not just one LICENSE file" rule from
`research/contradictions/license-split-by-directory.md`.

## Architecture: agents, workflows, memory, model router [E3]

- **Agents**: the reasoning/tool-use unit.
- **Workflows**: a graph-based orchestration engine with `.then()`,
  `.branch()`, `.parallel()` control-flow methods; supports
  suspend/resume — a workflow can pause indefinitely awaiting human input
  and resume from persisted state.
- **Memory**: conversation history plus "working" and "semantic" memory,
  backed by pluggable storage (see LibSQL below); first-party `@mastra/mem0`
  integration is notable for being usable without managing a separate Python
  server — a TypeScript-native path other frameworks' memory integrations
  often lack.
- **Model router**: a single interface reaching 90+ model providers.
- **Framework positioning**: industry commentary places Mastra in a
  "graph-based" tier alongside LangGraph (vs. role-based frameworks like
  CrewAI/AutoGen, or SDK-native frameworks like OpenAI Agents SDK) — an
  independent, secondary-source classification, not a first-party claim.

## Workspace [E3] — directly relevant to LabLaunchPad's local-first capability model

A Mastra Workspace gives an agent a persistent environment with up to four
independently-configurable capabilities — an agent only gets the ones it's
explicitly given:[^mastra-workspace]

- **Filesystem**: read/write file tools; a `resolver` function can return a
  _different_ filesystem per request — named specifically as the mechanism
  for multi-tenant or multi-role agents needing different storage roots or
  permissions per caller.
- **Command execution**: an `execute_command` tool backed by an optional
  sandbox — filesystem and command execution are explicitly separable
  (a workspace can have one without the other).
- **Search**: search over indexed workspace content.
- **Skills**: a `skills` array of directory paths, each containing a
  `SKILL.md` file with optional reference docs and scripts — Mastra's own
  implementation of the (external, cross-framework) Agent Skills
  spec.[^mastra-workspace-class]

**Permission model**: per-tool approval requirements are configurable
independently (e.g. `WRITE_FILE`/`EXECUTE_COMMAND` with `requireApproval`,
`requireReadBeforeWrite` options) — approval-gating is a first-class,
per-tool setting, not a single global on/off switch.

**LabLaunchPad implication**: this is the closest match found so far, across
all 8 frameworks researched, to this repository's own planned
`adapters/tools/{filesystem,sandbox}` boundary _plus_ a policy layer over
it in one coherent, named abstraction — Youtu-Agent's `Environment`
(installment 2) is architecturally similar but did not include a
comparable per-tool approval model.

## Agent Harness template [E3]

Mastra ships an "Agent Harness" template: a project-level Workspace for
files and command execution, with **approval gates for file changes,
deletions, and shell commands** built into the template itself, not
bolted on separately.[^mastra-harness-template] This is a first-party,
named "Harness" concept distinct from "Agent" — an independent
convergence with Microsoft Agent Framework's Agent/Harness/Workflow
three-layer split (installment 1), now observed in a second framework.

## Local-first classification

| Capability                                             | Classification                                                                                                                                                                                             | Evidence       |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| Storage (memory/workflow snapshots/traces/evals)       | **LOCAL_NATIVE** — `LibSQLStore` with a `file:filename.db` URL gives fully local, file-based persistent storage; LibSQL is SQLite-compatible and supports local or remote deployment by the same interface | [E3] websearch |
| Workspace (filesystem/command execution/search)        | **LOCAL_NATIVE** — these are in-process/local-filesystem tools by construction, gated by an explicit approval model, not an external service                                                               | [E3] websearch |
| Model execution                                        | **UNKNOWN leaning CLOUD_ADAPTIVE** — the "90+ providers through one interface" framing implies provider-adaptive routing; no local-model provider (Ollama, vLLM) confirmed either way this pass            | [E3] websearch |
| Platform layer (Studio, observability, Memory Gateway) | **LOCAL_CAPABLE with a commercial caveat** — self-hostable, but metered/commercial, not simply covered by the Apache-2.0 framework license                                                                 | [E3] websearch |

**Verdict**: `LOCAL_CAPABLE`, and now the strongest _combined_
storage-plus-tools local-first story of the frameworks researched so far —
LibSQL (storage) and Workspace (filesystem/command execution) are both
local-native by construction, with an explicit permission layer rather
than an implicit one. Model execution local-first status remains
genuinely `UNKNOWN`, unchanged from the first draft — not inferred either
way pending a direct check of the model router's provider list.

## LabLaunchPad extraction

| Pattern                                                                                                                               | Adopt / Adapt / Reject                                                               | Rationale                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SQLite-compatible embedded DB (LibSQL) as the default local storage backend                                                           | **ADOPT** (pattern only)                                                             | Directly relevant to Phase 4/7's persistence-interface work (ADR-0006) — a concrete, zero-infra local backend example to cite alongside Qwen-Agent's local model path            |
| Workflow suspend/resume backed by persisted state                                                                                     | **ADOPT** (pattern only)                                                             | Confirms this repository's own Checkpoint/State model design direction independently                                                                                             |
| Workspace: filesystem/command-execution/search/skills as independently-configurable, per-tool-approval-gated capabilities             | **ADOPT** (pattern only)                                                             | Strongest match found so far for this repository's planned `adapters/tools/{filesystem,sandbox}` boundary combined with a policy layer in one named abstraction                  |
| Per-request filesystem `resolver` for multi-tenant/multi-role isolation                                                               | **ADOPT** (pattern only)                                                             | A concrete mechanism worth citing when Phase 8 (Capability Registry) or a future multi-tenant story is designed — not currently a LabLaunchPad requirement, but a real precedent |
| Named "Harness" template distinct from "Agent," with approval gates built in                                                          | **RECORD AS PRECEDENT** (2nd independent framework, after Microsoft Agent Framework) | Reinforces the Agent/Harness/Workflow layering already confirmed via `agent-harness-workflow-layering.yaml` — no new architectural change, additional confirmation               |
| Three-tier licensing (framework / platform / enterprise) as the honest model for "open source" agent frameworks with a hosted product | **RECORD AS PRECEDENT**                                                              | Same "check the whole offering" lesson as LangGraph's split, now with a third tier (platform) that neither LangGraph nor the earlier draft of this file captured                 |

## Open questions

- Whether the model router supports any local/self-hosted model provider —
  genuinely unresearched, not inferred as either yes or no.
- Full evaluation/DX/AX/OX/PX dimensions — not researched.
- Exact scope of what code lives under `ee/` / Enterprise Edition beyond
  the licensing page's own summary — not independently enumerated file by
  file.
- Whether Workspace's sandbox for command execution provides the same kind
  of isolation guarantee this repository's own `SandboxProvider` spec
  (Phase 19) will require — not tested, only documented behaviour read.

[^mastra-license]: https://github.com/mastra-ai/mastra/blob/main/LICENSE.md

[^mastra-license-docs]: https://mastra.ai/docs/community/licensing

[^mastra-pricing]: https://mastra.ai/pricing

[^mastra-libsql]: https://mastra.ai/reference/storage/libsql

[^mastra-workspace]: https://mastra.ai/docs/workspace/overview

[^mastra-workspace-class]: https://mastra.ai/reference/workspace/workspace-class

[^mastra-harness-template]: https://mastra.ai/templates/agent-harness
