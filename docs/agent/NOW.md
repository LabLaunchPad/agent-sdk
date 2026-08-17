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

## Supplementary corpus import (explicit scope expansion, not silent)

The user supplied a prior, external research pass covering **5 frameworks
not named in the original 17-source brief**: OpenHands Software Agent SDK,
Letta, Google Agent Development Kit (ADK), Browser Use, and CrewAI —
85 per-dimension files, 13 cross-framework comparison matrices, and 6
machine-facing JSON summaries. This is a genuine scope expansion beyond the
17-source list, recorded here explicitly rather than folded silently into
the "8 of 17" figure above. Integrated into `research/frameworks/{name}/`,
`research/comparison/`, `research/imported-corpus/SOURCE-RECEIPT.md`, and
`.context/research/{gaps,decisions,local-first,licensing,capabilities}.json`
plus the 5 new per-framework `.context/research/{name}.json` files.

**Provenance discipline applied**: this corpus is real, URL-cited E3/E4
evidence, but it was **not independently re-fetched or re-verified via
WebSearch/WebFetch in this session**. Every imported file carries an
explicit `x_provenance` frontmatter field saying so, and every reference to
it in the master matrices is tagged `IMPORTED CLAIM, DOCUMENTED_NOT_REPRODUCED`
rather than `FACT` or `VERIFIED` — the same evidence-level discipline
applied throughout installments 1-3, extended to a case where the _research_
itself (not just a framework's own claims) was not performed by this
session. Six new decision candidates were recorded from it in
`.context/research/decisions.json`, none auto-adopted into architecture —
the imported receipt's own 6 ADR-CANDIDATEs and 10 proposed benchmarks have
**not** been reconciled against the existing locked architecture; that
reconciliation is future work.

## Supplementary corpus import, batch 2 (second scope expansion, not silent)

The user supplied a **second** prior external research pass ("next wave")
covering **9 more frameworks not named in the original 17-source brief**:
Strands Agents, Hugging Face smolagents, AG2, LlamaIndex, Llama Agents +
Workflows, Haystack, DSPy, Microsoft AutoGen, and Microsoft Semantic
Kernel — 9 framework overviews, 11 comparison matrices, 6
`ADR-CANDIDATE-*.md` files, a `LICENSE-REVIEW.md`, and 6 machine-facing
delta JSON files (`source-index`, `gap-delta`, `benchmark-delta`,
`dimension-coverage`, `spec-delta`, `next-wave`). Combined with batch 1,
this is **14 imported frameworks total, beyond the 17-source brief** —
recorded explicitly as a second, distinct scope expansion, not merged
silently into batch 1's figures. Integrated into
`research/frameworks/{name}/overview.md`, `research/comparison/NEXT-WAVE-*.md`
(prefixed to avoid colliding with batch 1's filenames — `CAPABILITY-MATRIX.md`
would otherwise have collided), `research/decisions/ADR-CANDIDATE-*.md`,
`research/sources/LICENSE-REVIEW.md`, `research/imported-corpus/SOURCE-RECEIPT-2.md`,
`.context/research/{name}.json` (9 files) and `.context/research/next-wave/*.json`
(6 meta-delta files), plus updates to
`.context/research/{gaps,decisions,local-first,licensing,capabilities}.json`.

**Same provenance discipline as batch 1**: real, URL-cited E4 evidence,
`DOCUMENTED_NOT_REPRODUCED` per the source corpus's own vocabulary, not
independently re-fetched via WebFetch/WebSearch in this session. Two of
the nine (AutoGen, Semantic Kernel) are explicitly migration-era research
whose documented successor is Microsoft Agent Framework, already
researched live in installment 1 — not double-counted as independent new
framework coverage. Six more ADR-CANDIDATEs were recorded as decision
candidates (none auto-adopted); **both imported corpora's ADR-CANDIDATEs
(12 total) remain unreconciled against the existing locked architecture**
— now the standing follow-up item across both batches, not just one.

## "Current wave" import — mixed: one real gap closure, plus refresh/topics (not silent)

A fourth corpus, distinct in kind from batches 1-2: not purely new
frameworks. It contained (1) **A2A** — genuinely new, the first evidence
for one of the original 17-source brief's 4 remaining `UNKNOWN` sources.
Unlike every other imported framework/protocol so far, this session
**independently re-verified A2A live** via WebSearch/WebFetch rather than
trusting the import — the imported okf.md was thin (a lead, not a final
record) and A2A was important enough to warrant the same live-research
discipline as installments 1-3. Result: `research/protocols/a2a-1.0.1.md`,
9 of 17 original-brief sources now researched live (was 8), 3 remaining
(was 4). (2) **Refresh/delta checks** on 3 sources already live-researched
this session (OpenAI Agents SDK, Microsoft Agent Framework, MCP) —
appended as short, dated "External refresh check" sections to the
existing canonical files, not duplicated as competing new files; one
genuinely actionable lead surfaced (Microsoft Agent Framework's latest
Python release reportedly adds local/Docker shell support — not
independently confirmed, recorded as a lead in the local-first scorecard).
(3) Two new cross-cutting topics, `research/topics/sandbox-execution.md`
and `research/topics/security-2026.md` (new directory — neither
framework- nor protocol-shaped). 7 more ADR-CANDIDATEs recorded, several
now showing 3-4-way independent convergence across separate corpora (most
notably `UNKNOWN_OUTCOME`-as-first-class-state and source-to-sink
security, both promoted to `ACTION_REQUIRED` given the evidence density —
still not ADRs, but no longer single-source candidates either). See
`research/imported-corpus/SOURCE-RECEIPT-3.md` and
`.context/research/gaps.json`'s `imported_corpus_batch_3_current_wave`
entry for the full breakdown — **the A2A closure and the beyond-brief
additions are recorded separately, not conflated into one figure.**

## Post-commit operations bundle import (out of Workstream B scope, tracked separately)

The user also supplied a third corpus, different in kind from the two
research imports above: a **post-commit operations protocol** for this
repository's own git/PR/CI/deploy lifecycle (not research about external
agent frameworks). Stored at `docs/operations/post-commit-ops/` —
outside `research/` and outside Workstream B's scope entirely. SHA-256
verified against the user-provided hash and the bundle's own internal
manifest before use. One systematic OKF non-conformance was fixed
(`verified: documented`, a bare string, renamed to
`x_verification_state`) since `docs/` isn't in `okf.json`'s validated
scopes but consistency was still worth the trivial fix. **Recorded as
CANDIDATE, not adopted** — not wired into `AGENTS.md` or CI; see
`docs/operations/post-commit-ops/PROVENANCE.md` and
`docs/agent/DECISIONS.md`'s 2026-08-17 entry. One genuine cross-corpus
convergence worth flagging: this bundle's UNKNOWN_OUTCOME/RECONCILING
states for merges and deployments independently converge with research
batch 2's ADR-CANDIDATE-006 (Operation ID + UNKNOWN_OUTCOME side-effect
model) — two unrelated corpora landing on the same "never blindly retry
an operation with an unknown side-effect outcome" rule.

## "Wave1" import — fifth research corpus, mostly reinforcement + new benchmark categories (not silent)

A fifth corpus (`research_run_id: llp-rsch-2026-08-17-wave1`, self-checksummed,
54/54 files verified). Mostly another independent MCP/A2A/OpenAI Agents SDK
pass — reinforcing, not contradicting, this session's own findings (MCP
version agreement across all 3 sources that researched it; A2A's opaque
trust model corroborated) — plus genuinely new content: 3 formally-numbered
`WAVE1-ADR-*.md` decision proposals (MCP baseline, semantic portability,
durability boundary), 3 new cross-cutting topics
(`research/topics/{durability-exactly-once,e5-evidence-levels,capability-aware-routing}.md`),
and 7 new benchmark-plan categories extending `research/benchmarks/` (all
explicitly `NOT_RUN`, 0/14 E5 executed, no fabricated results). Its own
`drift-report.json` flagged A2A version drift as HIGH impact — this
session's follow-up live WebSearch confirmed the drift was real but that
wave1's own "0.3.0 official latest" claim was itself the stale data point
(see `research/protocols/a2a-1.0.1.md`'s "Version drift" section and
`research/canonical/CONSOLIDATION-REPORT.md` Section C). Despite the
source's confident "ADR-001"/"ADOPT" naming, all 3 proposals are recorded
in `.context/research/decisions.json` at `CANDIDATE` status, same as every
other imported decision — naming confidence in a source does not confer
this repository's actual architectural authority.

## Canonical multi-corpus consolidation (`research/canonical/`)

At the user's explicit request, all 6 research/governance corpora
integrated so far (this session's own live research + batches 1-3 +
post-commit-ops + wave1) were consolidated into one deduplicated,
evidence-graded knowledge graph per a user-supplied
`LabLaunchPad.ResearchCanonical` schema — see `research/canonical/index.md`
for the entry point. **Explicitly supplementary, not authoritative**: it
does not replace `.context/research/{gaps,decisions}.json` or the OKF
markdown tree (ADR-0007 remains in force); recorded as such in
`.context/research/decisions.json`'s
`canonical-research-graph-is-supplementary-not-authoritative` entry. Its
main net-new contribution is cross-corpus contradiction/version-drift
detection (the A2A resolution above) and a first `delete_test` pass over
25 candidate architecture boundaries against `docs/architecture/PACKAGE-MAP.md`,
surfacing 3 evidenced-but-unplanned `ADD_CANDIDATE` boundaries
(`WorkspaceEngine`, `SandboxEngine`, `SideEffectEngine`) — flagged for a
future ADR, **not** added to the package map by this consolidation itself.
Status recorded honestly as `PARTIAL`: E5 reproduction remains 0/14 across
every corpus combined.

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
