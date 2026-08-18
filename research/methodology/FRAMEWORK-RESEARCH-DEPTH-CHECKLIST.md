---
type: Research Consolidation Report
title: Framework Research Depth Checklist
description: The 40-dimension checklist and precision scheme deferred since installment 3 — a reusable methodology tool, not a completed audit
generated:
  by: process:claude-code-session
  at: 2026-08-18T00:00:00Z
status: draft
x_evidence_level: N/A — this is a methodology document, not a claim about any framework
---

# Framework Research Depth Checklist

**This is a tool, not a completed audit.** It defines the 40 dimensions
and the precision scheme named as deferred work since installment 3
(`docs/agent/NOW.md`'s "Explicitly deferred" section). Applying it in
full — 40 dimensions × 8+ already-researched frameworks — is a genuine
broad research wave, the exact shape `BROAD_RESEARCH: LOCKED` and Phase
1B's research-budget rule exist to prevent. It is adopted here as a
reusable instrument; **its full application to the existing framework
set remains explicitly deferred**, not silently implied as done by this
document's existence. See "When to actually run this" at the bottom.

## Precision scheme

Every dimension, for every framework, gets exactly one of these five
tags — never a bare prose claim without one:

| Tag                  | Meaning                                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `DOCUMENTED`         | The vendor's own official documentation states this directly                                                                       |
| `OBSERVED-IN-SOURCE` | This session read the actual source code and confirmed it                                                                          |
| `OBSERVED-IN-TESTS`  | This session read or ran the framework's own test suite and confirmed it                                                           |
| `REPRODUCED-BY-US`   | This session independently ran the framework and got the same result — the only tag that constitutes this repository's own E5 tier |
| `UNKNOWN`            | Checked, no answer found — never silently omitted, never inferred from a similar framework                                         |

`UNKNOWN` is always preferred over an inferred guess, per this
repository's own Evidence principle (`AGENTS.md`). A dimension with no
tag at all is not a completed cell, regardless of how much prose
surrounds it.

## The 40 dimensions, in 7 categories

### State (6)

1. Canonical state shape — what a "state" object actually contains
2. State mutation model — in-place vs. immutable/copy-on-write
3. State versioning — does state carry a schema version field
4. State validation — is state validated on read, write, both, neither
5. Multi-tenant/multi-session state isolation
6. State size limits — documented or discovered ceiling

### Memory (6)

7. Built-in memory abstraction — exists or caller-managed
8. Memory persistence backend — options and defaults
9. Memory retrieval mechanism — recency, semantic, hybrid, none
10. Memory write triggers — automatic vs. explicit
11. Memory pruning/expiry policy
12. Memory isolation across agents/sessions

### Context (6)

13. Context window management — truncation, summarization, none
14. Context injection sources — system prompt, tools, memory, retrieval
15. Context budget controls — token/cost limits, exposed or not
16. Context caching — prompt caching, KV-cache reuse
17. Context composition order — documented precedence
18. Context-loss failure mode — what happens when context overflows

### Security (7)

19. Tool-output injection defenses
20. Sandbox isolation model for tool/code execution
21. Credential/secret handling in tool calls
22. Capability/permission model — exists, granularity
23. Source-to-sink enforcement point — model-output-only vs. dispatch-time
24. Supply-chain posture — dependency pinning, lockfiles, provenance
25. Documented CVEs or disclosed vulnerabilities

### Evaluation (5)

26. Built-in eval harness — exists or bring-your-own
27. Deterministic replay/regression testing support
28. Published benchmark suite
29. Eval-in-CI integration pattern
30. Human-in-the-loop eval/approval workflow

### DX — Developer Experience (5)

31. Time-to-first-agent-run (steps, not estimate)
32. Type safety / schema validation on inputs and outputs
33. Error message actionability
34. Local development loop (hot reload, debugging tools)
35. Migration/versioning guidance across framework releases

### UX — end-user-facing (5)

36. Streaming response support
37. Human-in-the-loop interrupt/approval UX
38. Observability surfaced to the end user (not just developer)
39. Multi-turn conversation continuity
40. Failure/error surfacing to the end user

## When to actually run this

Per the research-budget rule applied throughout this session ("research
only what a pending decision needs"): run this checklist against a
specific framework only when a real, named architectural decision is
blocked on evidence this repository doesn't already have at the depth
this checklist provides. Do not run it speculatively across the existing
framework set "to be thorough" — that is exactly the broad-research
pattern this repository's own discipline exists to prevent. When a
trigger does fire, scope the run to the specific dimensions the blocking
decision actually needs, not automatically all 40.
