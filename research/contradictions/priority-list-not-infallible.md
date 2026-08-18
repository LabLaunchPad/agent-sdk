---
type: Contradiction
title: A Sourcing Priority List Is Itself Evidence
description: Counterexample to treating an operating prompt's stated priorities as verified facts rather than hypotheses to test
sources:
  - resource: /research/frameworks/tencent-youtu-agent/overview.md
    id: youtu-overview
  - resource: /research/frameworks/qwen-agent/overview.md
    id: qwen-overview
generated:
  by: process:claude-code-session
  at: 2026-08-16T00:00:00Z
status: draft
---

# Contradiction: "The research brief's priority framing is itself reliable evidence"

## Claim under test

The operating prompt for this research phase names Qwen-Agent and
Youtu-Agent under the heading "HIGH-PRIORITY LOCAL-FIRST REFERENCES,"
implying both are strong local-first exemplars worth researching first for
that specific property.

## Counterexample

Direct research confirms this for Qwen-Agent — first-party self-hosted
model deployment via vLLM/Ollama, documented alongside the hosted option —
but **not** for Youtu-Agent, whose default setup requires an external LLM
provider API key and does not demonstrate offline operation for its
default configuration. One of the two frameworks named under "high-priority
local-first" turned out, on direct evidence, not to be confirmed
local-first at all.

## Result

The claim is **FALSE** as a blanket rule. A framework's inclusion on a
priority list — even one written by a careful, detailed operating prompt —
is a **hypothesis about what research will find**, not a substitute for
doing the research. This is not a criticism of the operating prompt; a
reasonable person could believe Youtu-Agent is local-first from its
"open-source models" framing without having directly checked its default
setup requirements. The point is structural: **any claim, including one
embedded in the instructions themselves, is subject to the same evidence
hierarchy as a claim about a competitor's framework.**

## Change required

This repository's evidence rules (E0–E5, "never convert DOCUMENTED into
VERIFIED IMPLEMENTATION") already implicitly cover this case, but it is
worth stating the corollary explicitly: **operating-prompt assertions about
external systems are E0 (model/author knowledge) until independently
checked, exactly like any other unverified claim** — they do not gain
evidentiary weight from appearing in an authoritative-sounding instruction.
This applies symmetrically to future operating prompts, not just this one.

## Test required

No code test — this is a research-process finding, not a runtime
behaviour. The applicable safeguard is procedural: every future research
installment must independently verify any framework classification
asserted in its own governing instructions, exactly as this installment
did, rather than inheriting the instruction's framing as already-true.
