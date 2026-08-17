---
type: Architecture Decision
title: Security Enforcement at the Policy/Capability Boundary
description: Security is enforced at the source-to-sink capability boundary by PolicyEngine and per-tool guardrails, never by trusting model judgement of tool descriptions or output
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: stable
---

# ADR-0013 — Security Enforcement at the Policy/Capability Boundary

| Field      | Value                                   |
| ---------- | --------------------------------------- |
| Phase      | P08 (Capability Registry), P09 (Policy) |
| Supersedes | —                                       |

## Context

Three independent sources converge on the same conclusion, already
promoted to `ACTION_REQUIRED` in `.context/research/decisions.json` given
the evidence density: OpenHands' own documentation states its LLM-based
security analyzer is explicitly not a complete prompt-injection solution,
and its `execute_tool()` bypasses conversation analyzers/confirmation
entirely (`CLM-OPENHANDS-001`, `reject-llm-only-security-judgement`); MCP's
own 2026-07-28 spec states tool behavior descriptions and annotations are
not inherently trusted (`CLM-MCP-004`); and the security-2026 topic's own
research independently reaches the identical conclusion
(`current-wave-cw-005-source-to-sink-security`). This is recorded as
`security[0]` in `research/canonical/canonical-research.json` — the
strongest single security finding in the whole corpus, and the one place
this research explicitly names its own honesty gap: `actual` impact is
`UNKNOWN`, never independently tested by this session or any of the 6
corpora.

OpenAI's own two-layer guardrail design (agent-level input/output
guardrails, plus per-tool `ToolInputGuardrail`/`ToolOutputGuardrail`
running immediately before/after each invocation) is directly relevant
mechanism-level evidence, already extracted as a pattern
(`knowledge/patterns/tool-boundary-guardrails.yaml`,
`adopt-tool-boundary-guardrails`).

## Decision

Security enforcement lives at the **source-to-sink** capability boundary
— the point where a capability actually executes a file write, shell
command, network call, or other consequential action — not at the point
where a model produces or receives text. `SecurityEngine` is not a
standalone package (it fails the delete-test: nothing needs a security
subsystem separate from the policy/capability boundary itself, and a
separate subsystem could be bypassed if a caller skips it). Security is
folded into `@lablaunchpad/policy` and `@lablaunchpad/capabilities`
directly: every capability invocation passes through a policy check
independent of any agent-level guardrail (OpenAI's two-layer pattern,
extended beyond first-party function tools to also cover MCP tool calls
and A2A remote-agent invocations, which OpenAI's own reference
implementation does not address). Tool output is treated as **data, never
authority** — a tool's own description, annotations, or returned content
must never be trusted to self-report its safety or grant capability access.

## Adversarial review

**Attack:** enforcing at the sink alone, with no input-side filtering, lets
obviously-malicious content flow all the way to the point of execution
before being caught — a defense-in-depth argument says both layers should
exist, and this ADR risks being read as "skip the input-side guardrail
entirely."

**Failure modes:** this is real: the `actual` impact of this whole finding
is honestly recorded as `UNKNOWN` — no independent test exists yet
confirming source-to-sink containment actually stops a real injection
attempt against LabLaunchPad's own eventual implementation, only that
three external sources agree it's the right place to focus.

**Falsifying experiment:** `research/canonical/canonical-research.json`'s
own `BEN-TOOL-INJECTION` benchmark plan (malicious tool-output injection,
expected policy preservation) is exactly this test, currently `NOT_RUN`.
Running it against a real Phase 8/9 capability implementation is the
direct falsification path — if a crafted tool output can still cause an
unauthorized sink action despite policy enforcement, this ADR's core claim
is wrong, not just under-tested.

## Alternatives considered

| Alternative                                                        | Why rejected                                                                                                                        |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Rely on agent-level input/output guardrails only                   | Directly contradicted by OpenHands' own docs — `execute_tool()` bypasses exactly this layer in their own reference implementation   |
| Rely on model-judgement classification of tool descriptions/output | Directly contradicted by MCP's own spec, which explicitly does not trust tool descriptions                                          |
| A standalone `SecurityEngine` package                              | Fails the delete-test; a separable security subsystem is a bypass risk, not a safety improvement, if any caller can route around it |

## Consequences

Easier: one enforcement point (the capability/policy boundary) to audit
and test, rather than reasoning about security properties scattered across
prompt design, model behaviour, and execution code. Harder: every
capability implementation must route through policy enforcement with no
shortcut path — this is a hard constraint on Phase 8/9's implementation,
not a best-effort recommendation. Forecloses: any capability
implementation, including future MCP/A2A tool-call paths, that executes
without a policy check on the theory that the model's own judgement or the
tool's own self-description is sufficient.

## Revisit trigger

When `BEN-TOOL-INJECTION` (or an equivalent E5) is actually run against a
real implementation and either confirms or contradicts source-to-sink
containment's effectiveness — this is the one ADR in this set whose core
claim is explicitly unverified and should be revisited the moment real
evidence exists, not left to age silently as `UNKNOWN`.

## Evidence

`research/canonical/canonical-research.json` `security[0]`, claims
`CLM-OPENHANDS-001`, `CLM-MCP-004`, benchmark `BEN-TOOL-INJECTION`;
`docs.openhands.dev/sdk/guides/security` (via `CLM-OPENHANDS-001`);
`research/topics/security-2026.md`; `knowledge/patterns/tool-boundary-guardrails.yaml`;
`.context/research/decisions.json` entries `reject-llm-only-security-judgement`,
`adr-candidate-003-capability-based-tool-security`,
`current-wave-cw-005-source-to-sink-security`, `adopt-tool-boundary-guardrails`.
