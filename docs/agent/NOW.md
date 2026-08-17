# NOW

The single current objective. If you are working on something not described
here, stop and reconcile before continuing.

## Phase

**P1A — OKF v0.2 Adoption + Gap Audit**, Workstream B (research), installment 3

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

## In scope (installments 1-3, complete)

Real primary-source research (WebSearch/WebFetch, evidence level E3/E4) for
8 of ~17 named sources plus one full protocol special audit. Installment 1:
OpenAI Agents SDK, Microsoft Agent Framework, PydanticAI, Kimi Agent SDK.
Installment 2: Qwen-Agent, Tencent Youtu-Agent — the operating prompt's own
named "high-priority local-first references." Installment 3: LangGraph,
Mastra, and the MCP 2026-07-28 special audit (moved up in priority per the
user's explicit instruction that the current spec materially changed the
protocol's architecture). Produced across all three: per-framework OKF
concept docs, local-first scorecard, capability matrix, licensing matrix,
7 extracted patterns/precedents (`knowledge/patterns/` +
`.context/research/decisions.json` candidates), 5 contradiction-matrix
entries, machine-facing `.context/research/*.json` summaries.

**Self-correction within installment 3**: LangGraph's local-first verdict
and Mastra's licensing tier count were both corrected after further
evidence review — LangGraph's checkpointer was initially mischaracterized
as requiring PostgreSQL/Redis for production (corrected to `LOCAL_CAPABLE`:
in-memory/SQLite are first-class, not a fallback), and Mastra's licensing
was initially recorded as a simple two-way split (corrected to three
distinguishable tiers: framework/platform/enterprise). Both corrections are
recorded explicitly in the affected files, not silently overwritten — the
same evidence-discipline rule applied to the Youtu-Agent correction in
installment 2 applies symmetrically here, including to steers from any
source, human included: re-verify against primary evidence, don't accept a
characterization on assertion.

**Notable installment 2 finding**: Youtu-Agent, despite being named
high-priority for local-first relevance in the operating prompt itself, was
found to be cloud-configured by default on direct evidence — recorded as a
correction (`research/contradictions/priority-list-not-infallible.md`), not
smoothed over. Qwen-Agent, by contrast, is the strongest local-first
reference found across all frameworks researched so far.

**Notable installment 3 findings**: (1) LangGraph and Mastra both split
their license by directory (core permissive, server/enterprise component
restricted) — found independently in both, promoted to a standing
due-diligence rule (`research/contradictions/license-split-by-directory.md`).
(2) MCP's 2026-07-28 revision removes protocol-level sessions entirely,
pushing state ownership onto the application layer — motivates an explicit
PROTOCOL/APPLICATION/AGENT STATE distinction, recorded as a decision
candidate for Phase 18, not an ADR yet (`research/protocols/mcp-2026-07-28.md`).
(3) LangGraph's checkpointer had a real, disclosed SQL-injection/deserialization
vulnerability — a concrete argument for applying this repository's own
Policy Gate to state/checkpoint query paths, not only tool invocation.

## Explicitly deferred (installment 4+)

Volcengine AgentKit, Baidu AppBuilder SDK, A2A, Agent Skills — all recorded
`UNKNOWN`, never silently assumed. Full per-framework 40-dimension depth
(state, memory, context, security, evaluation, DX, UX, plus the
DOCUMENTED/OBSERVED-IN-SOURCE/OBSERVED-IN-TESTS/REPRODUCED-BY-US/UNKNOWN
precision scheme) for all 8 already-researched frameworks — installments
1-3 covered local-first, capabilities and licensing only, plus one
protocol-architecture special audit for MCP. Also deferred: the
comparative network-disabled test, the token/context-efficiency audit file,
the UX/DX audit file, and deepening passes for PydanticAI and Kimi Agent
SDK specifically flagged as shallow. See `.context/research/gaps.json` for
the complete remaining list and prioritization.

## Out of scope

Any Agent SDK product implementation — this is a research phase per the
operating prompt's own "NO IMPLEMENTATION... STOP after producing the final
audit" rule. No code in `packages/` changes as part of this installment.

## Architecture status (explicit, corrected wording)

"No architecture changes required" from installments 1-2 does **not** mean
the architecture is validated. It means: **no change is justified yet from
partial evidence.** The architecture (docs/architecture/PACKAGE-MAP.md,
existing ADRs) remains **PROVISIONAL** until the fuller research corpus and
cross-source contradiction matrix are complete. This distinction was an
explicit correction to earlier receipt wording — recorded here so it is not
re-lost in a future summary.

## Definition of done (installments 1-3)

Real evidence (not model-knowledge recall) for every claim; evidence level
recorded per claim; `UNKNOWN` used honestly rather than inferred; all new
knowledge OKF-conformant (validated); no fabricated coverage of
unresearched sources. **Status: met** — see the installment receipt.
