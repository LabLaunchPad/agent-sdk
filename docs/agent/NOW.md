# NOW

The single current objective. If you are working on something not described
here, stop and reconcile before continuing.

## Phase

**P1A — OKF v0.2 Adoption + Gap Audit**, Workstream B (research), installment 1

## Objective

Determine strongest proven patterns for a local-first Agent SDK with rich
built-in capabilities, via evidence-gated primary-source research across the
current agent-ecosystem, plus licensing/legal review — see
`docs/agent/DECISIONS.md` for the scope reconciliation note below.

## Scope reconciliation (explicit, not silent)

Workstream A's plan sketched Workstream B abstractly as a "90-dimension
self-audit (1A-1) then targeted research (1A-2)." A subsequent, far more
detailed operating prompt specified Workstream B concretely instead: a
local-first scorecard, built-in-capability matrix, licensing matrix,
pattern library and contradiction matrix across ~17 named sources
(OpenAI Agents SDK, Microsoft Agent Framework, LangGraph, PydanticAI,
Mastra, Qwen-Agent, Tencent Youtu-Agent, Volcengine AgentKit, Baidu
AppBuilder, Kimi Agent SDK, MCP, A2A, Agent Skills).

**This detailed prompt is adopted as the operative Workstream B design**,
superseding the abstract 90-dimension sketch — recorded here per AGENTS.md's
"do not silently replace an architectural decision" rule, not swapped
without a trace. The abstract 90-dimension audit's underlying goal (find
what the plan still misses) is preserved; the concrete research structure
just replaces the abstract classification exercise as the mechanism.

## In scope (installment 1, complete)

Real primary-source research (WebSearch/WebFetch, evidence level E3) for 4
of ~17 named sources: OpenAI Agents SDK, Microsoft Agent Framework,
PydanticAI, Kimi Agent SDK — chosen because the operating prompt weights
local-first relevance most heavily and these four are its own named
high-priority local-first references. Produced: per-framework OKF concept
docs, local-first scorecard, capability matrix, licensing matrix, 3
extracted patterns (`knowledge/patterns/`), 2 contradiction-matrix entries,
machine-facing `.context/research/*.json` summaries.

## Explicitly deferred (installment 2+)

LangGraph, Mastra, Qwen-Agent, Tencent Youtu-Agent, Volcengine AgentKit,
Baidu AppBuilder SDK, MCP, A2A, Agent Skills — all recorded `UNKNOWN`, never
silently assumed. Full per-framework 14-dimension depth (state, memory,
context, security, evaluation, DX, UX) for the 4 already-researched
frameworks — installment 1 covered local-first, capabilities and licensing
only. See `.context/research/gaps.json` for the complete remaining list and
prioritization.

## Out of scope

Any Agent SDK product implementation — this is a research phase per the
operating prompt's own "NO IMPLEMENTATION... STOP after producing the final
audit" rule. No code in `packages/` changes as part of this installment.

## Definition of done (installment 1)

Real evidence (not model-knowledge recall) for every claim; evidence level
recorded per claim; `UNKNOWN` used honestly rather than inferred; all new
knowledge OKF-conformant (validated); no fabricated coverage of
unresearched sources. **Status: met** — see the installment receipt.
