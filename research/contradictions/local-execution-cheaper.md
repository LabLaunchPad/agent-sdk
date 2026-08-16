---
type: Contradiction
title: Local Execution Is Always Cheaper
description: Counterexample to the claim that local-first execution is unconditionally the cheaper/preferred path
sources:
  - resource: /research/frameworks/openai-agents-sdk/overview.md
    id: oai-overview
generated:
  by: process:claude-code-session
  at: 2026-08-16T00:00:00Z
status: draft
---

# Contradiction: "Local execution is always cheaper"

## Claim under test

A local-first design principle could be mis-read as "prefer local execution
whenever possible, because local is cheaper than hosted."

## Counterexample

`CodeInterpreterTool` in the OpenAI Agents SDK is deliberately CLOUD_ONLY —
it executes in a hosted sandboxed environment rather than the caller's own
process, even though local code execution is technically possible (many
frameworks offer a local code-interpreter option). The likely reason,
inferable from the design rather than directly stated: safe arbitrary code
execution requires a genuinely isolated sandbox — process isolation,
resource limits, network egress control — that a caller's local environment
often cannot cheaply provide. A hosted sandbox amortizes that isolation
infrastructure across all callers; a local implementation would require
each caller to build or operate their own sandbox, which is not "cheaper,"
it is a cost shifted onto every consumer instead of centralized once.

## Result

The claim as stated is **FALSE** in general. Local execution is cheaper
**per call** when the safety/isolation requirement is low (a `FunctionTool`
wrapping a pure computation) and can be **more expensive in aggregate**
when the safety requirement is high (arbitrary code execution) and the
caller would otherwise have to build sandbox infrastructure themselves.

## Change required

LabLaunchPad's own Capability Economy Gate ("deterministic function → local
tool → compiled workflow → local model → cheap remote model → frontier
model → multi-agent → human") should not be read as "always prefer the
leftmost option." The correct reading, consistent with this counterexample,
is: **prefer the leftmost option that satisfies the safety/isolation
requirement**, not the leftmost option unconditionally. A capability
requiring genuine sandbox isolation may legitimately skip past "local tool"
to a properly isolated execution environment, local or hosted, even though
that is a more expensive mechanism in raw compute terms.

## Test required

When Phase 19 (Browser + Sandbox providers) is implemented, the
`SandboxProvider` spec must explicitly address this tradeoff: define the
isolation guarantee required for code execution capabilities, and require
that guarantee be met regardless of whether the concrete backend is local
or hosted — never silently downgrade isolation to satisfy a "prefer local"
default.
