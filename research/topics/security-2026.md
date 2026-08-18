---
type: Topic Research
title: Agent Security 2026
description: OWASP Top 10 for Agentic Applications 2026 and source-to-sink prompt-injection defense, imported from the "current wave" corpus
sources:
  - resource: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
    id: owasp-agentic-top-10-2026
  - resource: https://openai.com/index/designing-agents-to-resist-prompt-injection/
    id: openai-prompt-injection
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_evidence_level: E3
x_provenance: imported research corpus ("current wave"), URLs not independently re-verified via WebFetch/WebSearch in this session — treat as DOCUMENTED_NOT_REPRODUCED
---

# Agent Security 2026

## OWASP Top 10 for Agentic Applications 2026 [E3, imported]

Named categories: goal hijack, tool misuse, identity/privilege abuse,
supply chain, unexpected code execution, memory/context poisoning,
insecure inter-agent communication, cascading failures, human-agent trust
exploitation, rogue agents.

Two of these directly overlap with findings already recorded elsewhere in
this repository's research corpus, not coincidentally:

- **Memory/context poisoning** — matches the `durable memory vs
poisoning/staleness` contradiction already recorded from the batch 1
  import (`research/comparison/CONTRADICTION-MATRIX.md` #2) and Letta's
  own guarded-memory pattern (`decisions.json`
  `adopt-durable-state-distinct-from-memory`).
- **Insecure inter-agent communication** — directly relevant to A2A's
  opaque-remote-agent trust model, just audited in
  `research/protocols/a2a-1.0.1.md` — A2A's design (never expose or trust
  a remote peer's internals) is a partial mitigation for exactly this
  OWASP category, not a coincidence given both were researched from
  security-conscious 2026-era sources.

## Source-to-sink defense, not just text classification [E3, imported]

OpenAI's own prompt-injection guidance (as characterized by the source
corpus): defenses should constrain impact **at dangerous capability
sinks** rather than relying primarily on classifying injected text.

**LabLaunchPad implication**: this is the same architectural conclusion
this repository already reached independently from OpenHands's own
documentation (batch 1 import,
`decisions.json` `reject-llm-only-security-judgement`: "OpenHands' own
docs state its LLM-based security analyzer is explicitly not a complete
prompt-injection solution... capability enforcement must live below the
agent loop"). **This is the third independent source now converging on
the same conclusion** — OpenHands's own docs, this "current wave"
corpus's OpenAI citation, and (implicitly) A2A's opaque-boundary design —
promoting this from a candidate pattern to a load-bearing security
requirement for this repository's own Policy Gate design, not merely one
opinion among several.

## Open questions

- Attack success rates vary by model/runtime per the source corpus's own
  stated unknown — no local reproduction performed, by this session or
  the source corpus.
- Exact mapping from the 10 OWASP categories to this repository's own
  planned Policy Gate / Capability Registry controls — not designed yet.
