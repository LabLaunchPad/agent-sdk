---
type: Protocol Research
title: Agent Skills Specification
description: SKILL.md format, progressive disclosure, governance, and the security-relevant gap in its permission model — closes the last remaining original-brief source
sources:
  - resource: https://agentskills.io
    id: agentskills-overview
  - resource: https://agentskills.io/specification
    id: agentskills-spec
  - resource: https://deepwiki.com/anthropics/skills/6.1-agent-skills-specification
    id: deepwiki-spec
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_evidence_level: E4 (agentskills.io pages, directly fetched) / E3 (governance-body claim, WebSearch snippet only, not independently confirmed against the fetched primary source)
x_gap_closed: "Closes the last of the original 17-source Workstream B brief's 4 sources (Volcengine, Baidu, A2A, Agent Skills) that remained fully UNKNOWN. Volcengine and Baidu remain UNKNOWN, deliberately not researched this phase per the operating prompt's own budget rule — see research/reconciliation/RESEARCH-REOPEN-GATES.md."
x_scope: 'Bounded, decision-relevant research for the InstructionSkillEngine boundary decision — not a full 40-dimension audit.'
---

# Agent Skills Specification

> **Closes an original-brief gap, deliberately narrow scope.** Researched
> specifically because `InstructionSkillEngine`'s `DEFER` disposition
> (`research/reconciliation/BOUNDARY-RECONCILIATION.md`) named it as the
> reason for deferral — this is a decision-relevant, bounded research pass,
> not a broad research wave. Volcengine AgentKit and Baidu AppBuilder SDK
> remain unresearched this phase because no pending decision depends on
> them yet.

## Governance and format [E4]

Agent Skills was originally developed by Anthropic and released as an open
standard, published at agentskills.io. `agentskills.io` states the format
"has been adopted by a growing number of agent products" and is "open to
contributions from the broader ecosystem" via a public GitHub repository
(`agentskills/agentskills`) and Discord — genuinely open governance, not a
single-vendor spec wearing an open label, though the primary source page
fetched this session does not itself name a specific steward organization.
**One claim not independently confirmed**: a WebSearch result described
governance as stewarded by "the Agentic AI Foundation" — this specific
detail was not corroborated by the primary `agentskills.io` page itself
during this session's fetch, and is recorded as `UNKNOWN` rather than
repeated as verified fact.

A skill is a directory containing a required `SKILL.md` file plus optional
`scripts/`, `references/`, and `assets/` subdirectories. `SKILL.md` is YAML
frontmatter + Markdown body.

## Frontmatter fields, exact [E4]

| Field           | Required | Notes                                                                                                                                              |
| --------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`          | Yes      | ≤64 chars, lowercase alphanumeric + hyphens only, must match the parent directory name                                                             |
| `description`   | Yes      | ≤1024 chars, must describe both what the skill does and when to use it                                                                             |
| `license`       | No       | License name or reference to a bundled license file                                                                                                |
| `compatibility` | No       | ≤500 chars — environment requirements (product, system packages, network access)                                                                   |
| `metadata`      | No       | Arbitrary string-to-string map, client-defined                                                                                                     |
| `allowed-tools` | No       | **Experimental.** Space-separated string of pre-approved tools. Spec's own words: "support for this field may vary between agent implementations." |

## Progressive disclosure, exact budgets [E4]

Three stages, with approximate token budgets stated by the spec itself:
**Discovery** (~100 tokens — `name`+`description` only, loaded for every
skill at startup), **Activation** (<5000 tokens recommended — full
`SKILL.md` body, loaded only when a task matches), **Execution** (as
needed — `scripts/`/`references/`/`assets/` loaded only when the
instructions call for them). This is a close structural match to this
repository's own already-recorded `adopt-context-broker-progressive-
disclosure` decision — independent convergence on the same
budget-conscious loading pattern, not new information, but a useful
concrete numeric anchor (100/5000/as-needed) this repository's own
research hadn't previously cited with specific figures.

## Ecosystem adoption [E4]

The client showcase lists 45+ products supporting the format as of this
fetch, spanning coding agents (Claude Code, Cursor, GitHub Copilot, VS
Code, Gemini CLI, OpenCode, Goose, Amp), stateful-agent platforms (Letta —
already researched in batch 1), cloud/data platforms (Databricks,
Snowflake), and general assistants (ChatGPT/Codex). Genuinely broad,
cross-vendor — not a single-ecosystem lock-in the way some researched
frameworks' own extension mechanisms are.

## Security-relevant finding — the actual reason this stays `DEFER` [E4]

The spec has **no stable permission/security model**. `allowed-tools` is
explicitly marked Experimental with inconsistent cross-implementation
support. `scripts/` bundles "executable code that agents can run" with
only soft guidance (self-contained, handle edge cases gracefully) — no
spec-level isolation, capability-scoping, or trust boundary at all. This
is not a gap in this research; it is a gap in the specification itself, as
of this fetch.

**Direct reinforcement of ADR-0013** (Security Enforcement at the
Policy/Capability Boundary, this phase): if LabLaunchPad ever consumes
Agent Skills, a skill's own bundled scripts are exactly the untrusted
content ADR-0013 already requires source-to-sink containment for — the
skill format provides no security guarantee of its own to lean on instead.

## LabLaunchPad extraction

| Pattern                                                            | Adopt / Adapt / Reject               | Rationale                                                                                                                                                                                                                            |
| ------------------------------------------------------------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SKILL.md progressive-disclosure token budgets (100/5000/as-needed) | **RECORD AS PRECEDENT**              | Concrete numeric anchor for Phase 6 (Context) design, corroborating the already-adopted context-broker pattern                                                                                                                       |
| `allowed-tools` pre-approval field                                 | **REJECT as sufficient on its own**  | Explicitly experimental and inconsistently supported by the spec's own admission; any LabLaunchPad Skills consumption must still enforce ADR-0013's source-to-sink containment rather than trusting a skill's own declared tool list |
| Treating a skill as a capability declaration                       | **RECORD AS PRECEDENT for ADR-0012** | Conceptually similar in spirit to Mastra's Workspace declarations — a skill's `name`/`description` is a capability-discovery mechanism, relevant if `InstructionSkillEngine` is ever bound                                           |

## Why `InstructionSkillEngine` stays `DEFER`, not promoted

Per `research/reconciliation/BOUNDARY-RECONCILIATION.md`'s correction: this
research closes `GAP-AGENTSKILLS`, but the evidence found argues _against_
promotion, not for it. The spec's own permission model is immature
(Experimental `allowed-tools`), and no concrete LabLaunchPad use case for
consuming or authoring Skills exists yet. Binding a contract now would be
designing against a moving, admittedly-experimental target. The revisit
trigger (`research/reconciliation/RESEARCH-REOPEN-GATES.md`) — a real
LabLaunchPad skill-consuming use case, or the spec's `allowed-tools` field
reaching non-experimental status — is unchanged by this research; it is
now backed by a concrete reason rather than an absence of research.

## Open questions

Full validation-tooling behavior (`skills-ref`) beyond frontmatter/naming
conformance was not explored in depth. Real-world security-incident
history (has the missing permission model caused an actual documented
problem in any of the 45+ adopting products) was not researched — would
be directly relevant if `InstructionSkillEngine` is reopened.

[^agentskills-overview]: https://agentskills.io

[^agentskills-spec]: https://agentskills.io/specification

[^deepwiki-spec]: https://deepwiki.com/anthropics/skills/6.1-agent-skills-specification
