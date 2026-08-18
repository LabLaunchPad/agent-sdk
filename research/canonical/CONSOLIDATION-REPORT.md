---
type: Research Consolidation Report
title: Multi-Corpus Consolidation Report
description: Merge, contradiction, version-drift, gap-closure, unknown-register, and next-wave-requirements report across all 6 Workstream B research corpora
sources:
  - resource: /research/canonical/canonical-research.json
    id: canonical
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: original synthesis produced by this session, reading across all 6 previously-imported corpora; not itself independently re-verified against primary sources beyond what each corpus's own import already recorded
x_authoritative_source_note: this file is a human-readable rendering of research/canonical/canonical-research.json. Where the two disagree, the JSON is authoritative.
---

# Multi-Corpus Consolidation Report

Consolidates 6 research/governance corpora into one cross-referenced record:
this session's own live-researched installments 1-3 (`SRC-SESSION`), 4
imported research corpora (`SRC-BATCH1`, `SRC-BATCH2`, `SRC-BATCH3`,
`SRC-WAVE1`), and 1 imported governance corpus (`SRC-POSTCOMMIT`). Full
records live in `research/canonical/canonical-research.json`; this file is
the readable companion, structured around the consolidation task's own
requested output shape (merge report, contradiction report, version-drift
report, gap-closure report, unknown register, next-wave requirements).

**Status: PARTIAL, not COMPLETE.** E5 reproduction is 0/14 across every
corpus combined. See `meta.scoping_decision` in the JSON for the exact
granularity trade-off made in this pass.

## A — Merge report

| Metric                                                             | Count |
| ------------------------------------------------------------------ | ----- |
| Sources consolidated                                               | 6     |
| Distinct ecosystems (frameworks + protocols + topics + governance) | 29    |
| Atomic claims recorded                                             | 35    |
| Evidence records                                                   | 36    |
| Benchmark plans (all NOT_RUN / BLOCKED)                            | 10    |
| Security findings                                                  | 1     |
| Gaps                                                               | 5     |
| Contradictions                                                     | 5     |
| Decision cross-references                                          | 6     |
| Architecture boundaries evaluated (delete_test)                    | 25    |
| Framework/protocol migrations                                      | 2     |
| Licensing findings                                                 | 5     |
| Unknowns                                                           | 5     |

Claim depth is uneven **by design**: full atomic-claim treatment applied
only to the 4 ecosystems every corpus independently touched — MCP, A2A,
OpenAI Agents SDK, Microsoft Agent Framework — because that is where
dedup/contradiction/version-drift value concentrates. Every other
ecosystem gets one claim per major finding, pointing at its existing
`research/frameworks/*/overview.md` or `.context/research/*.json` record
as the full evidence trail rather than re-deriving it here.

**No independent re-verification happened during this consolidation pass**
beyond the one live A2A version WebSearch (see Section C). Every imported
corpus's claims remain at the evidence level already recorded when it was
first integrated.

## B — Cross-corpus convergences (stronger than any single source)

Four findings were reached independently by multiple corpora that had not
seen each other's output — treated as materially stronger evidence than a
single-source claim:

1. **AutoGen → Microsoft Agent Framework, Semantic Kernel → Microsoft
   Agent Framework** (successor relationship) — confirmed 3 ways
   (`SRC-SESSION`, `SRC-BATCH2`, `SRC-BATCH3`).
2. **Source-to-sink capability containment, not prompt-text
   classification, is the load-bearing security control** — confirmed 3
   ways (OpenHands's own docs via `SRC-BATCH1`; MCP's own 2026-07-28 spec
   via `SRC-WAVE1`; the security-2026 topic via `SRC-BATCH3`). See
   `security[0]` in the JSON.
3. **`UNKNOWN_OUTCOME` needs to be a first-class state**, not an
   afterthought, for any side effect with an ambiguous remote result —
   proposed independently by `SRC-BATCH2` (ADR-CANDIDATE-006),
   `SRC-POSTCOMMIT` (MERGE_UNKNOWN/DEPLOY_UNKNOWN/RECONCILING states), and
   `SRC-WAVE1` (scoped exactly-once semantics topic + E5-A durable-restart
   benchmark plan). See `CTR-UNKNOWN-OUTCOME-CONVERGENCE`.
4. **Workspace/sandbox needs to be an explicit, named architectural
   boundary** — proposed independently by `SRC-BATCH1` (OpenHands, Browser
   Use, Letta), this session's own live research (Mastra's Workspace,
   Youtu-Agent's Environment), and `SRC-BATCH3` (the sandbox-execution
   topic's Docker/Firecracker/Wasmtime tradeoff analysis). See
   `CTR-WORKSPACE-CONVERGENCE`.

Findings 3 and 4 are recorded as `resolution_status: PARTIAL` — they are
not contradictions to resolve, they are gaps in the current architecture
strongly evidenced enough to raise as `ADD_CANDIDATE` boundaries (see
`ARCHITECTURE-DECISIONS.md`), not yet formal ADRs.

## C — Version-drift report

| Ecosystem                 | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MCP                       | **No drift.** All 3 sources that researched it (`SRC-SESSION`, `SRC-BATCH3`, `SRC-WAVE1`) independently agree on `2026-07-28`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| A2A                       | **Drift found and resolved.** 3 different version numbers were cited: `1.0.1` (`SRC-BATCH3`), `v0.2.5` (this session's own live fetch — a stale, still-live archived spec path), and `0.3.0` (`SRC-WAVE1`, asserted as "official latest" in its own `drift-report.json`). A follow-up live WebSearch during this consolidation confirms **A2A reached v1.0 in early 2026 and v1.2 by late March 2026** — meaning wave1's own drift-detection artifact was itself carrying stale data. Notable irony, recorded plainly rather than smoothed over: the corpus whose stated purpose includes detecting version drift had drift in its own output. |
| OpenAI Agents SDK         | **Version genuinely unpinned**, not a research gap. `SRC-BATCH3`'s own refresh check found the SDK's documentation surfaces internally disagree (Python docs vs. GitHub release page v0.17.4 vs. main-branch release notes 0.19.0 vs. TypeScript repo v0.11.6); `SRC-WAVE1` independently marked it `VERSION_UNPINNED` rather than picking a number. Two independent corpora agreeing the version is unstable is itself a finding.                                                                                                                                                                                                             |
| Microsoft Agent Framework | **Partially pinned.** `SRC-BATCH3` found specific release numbers (Python 1.6.0 / .NET 1.10.0); `SRC-WAVE1` did not pin one. Not a contradiction — treat `SRC-BATCH3`'s numbers as the better-evidenced data point, neither independently re-verified this pass.                                                                                                                                                                                                                                                                                                                                                                               |

**Standing rule going forward**: do not treat any single imported corpus's
version claim as authoritative without a direct check — this consolidation's
own A2A resolution included.

## D — Contradiction report

5 contradictions recorded in `canonical-research.json.contradictions[]`;
summary:

| ID                                | Topic                                                | Status   | Impact                                                         |
| --------------------------------- | ---------------------------------------------------- | -------- | -------------------------------------------------------------- |
| `CTR-A2A-VERSION`                 | A2A version number                                   | RESOLVED | LOW — protocol facts stable across the disputed range          |
| `CTR-LICENSE-SPLIT-PATTERN`       | Root-LICENSE-file-only due diligence is insufficient | RESOLVED | MEDIUM — affects any future dependency-review process          |
| `CTR-LANGGRAPH-LOCAL-FIRST`       | LangGraph's own self-correction (installment 3)      | RESOLVED | LOW — this repository's own error, already fixed               |
| `CTR-UNKNOWN-OUTCOME-CONVERGENCE` | Need for a first-class `UNKNOWN_OUTCOME` state       | PARTIAL  | HIGH — feeds `@lablaunchpad/state`/`@lablaunchpad/task` design |
| `CTR-WORKSPACE-CONVERGENCE`       | Need for an explicit workspace/sandbox boundary      | PARTIAL  | HIGH — feeds `ADD_CANDIDATE` architecture entries              |

`CTR-LICENSE-SPLIT-PATTERN` is the most operationally significant resolved
item: the first two research imports each checked only a framework's root
`LICENSE` file. LangGraph (by directory), Mastra (by commercial tier), and
AG2 (by code provenance) each split their license a **different** way —
proving root-file-only checks are not sufficient due diligence. This is now
a standing rule for any future framework research, not retroactively
applied to the 5 frameworks reviewed under the old methodology (their
`research/licensing/MATRIX.md` rows honestly say "No" under "Whole tree
checked?").

## E — Gap-closure report

Against the **original 17-source Workstream B brief**: A2A closed
(installment "current wave", live-researched) — the only genuine reduction
in the original brief's gap count from any import. Volcengine AgentKit,
Baidu AppBuilder SDK, and Agent Skills remain fully `UNKNOWN` — not
addressed by any of the 6 corpora, including the two supplied after A2A's
closure.

Beyond the original brief, this consolidation records 5 gaps
(`gaps[]` in the JSON):

| Gap ID                            | Priority | Summary                                                                                                                                                                                                                                                                         |
| --------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GAP-VOLCENGINE`                  | P1       | Not researched by any corpus                                                                                                                                                                                                                                                    |
| `GAP-BAIDU`                       | P1       | Not researched by any corpus                                                                                                                                                                                                                                                    |
| `GAP-AGENTSKILLS`                 | P1       | Not researched by any corpus, despite indirect references (Mastra implements it)                                                                                                                                                                                                |
| `GAP-E5-ZERO`                     | **P0**   | Zero E5 reproductions across all 6 corpora combined                                                                                                                                                                                                                             |
| `GAP-ARCHITECTURE-RECONCILIATION` | **P0**   | 4 corpora's worth of ADR-CANDIDATEs (22 total) plus 1 governance bundle never reconciled against `docs/architecture/PACKAGE-MAP.md` or each other — this consolidation's `architecture[]` array and `ARCHITECTURE-DECISIONS.md` are a first pass, not a formal ADR-writing pass |

## F — Unknown register

5 entries in `unknowns[]`, full schema (type / why_unknown /
evidence_search_scope / architecture_impact / closure_method /
revisit_trigger) in the JSON:

- `UNK-MAF-LOCAL-SHELL` — single-source, unverified lead that MAF's latest
  Python release adds local/Docker shell support.
- `UNK-VOLCENGINE`, `UNK-BAIDU`, `UNK-AGENTSKILLS` — the 3
  original-brief sources still fully unresearched.
- `UNK-E5-ALL` — no corpus, including this session, has a runnable pinned
  LabLaunchPad environment to execute any of the 10 recorded benchmark
  plans. This is the highest-impact unknown in the entire graph: every
  architecture decision here rests on E3/E4 documentation evidence, never
  E5 reproduction.

## H — Security finding

One cross-cutting security finding, `security[0]` in the JSON: prompt
injection via tool descriptions or tool output is treated across 3
independent sources as requiring containment at the capability-granting
sink (file write, shell exec, network call), not classification of the
injected text itself. `actual` impact is recorded honestly as `UNKNOWN` —
not independently tested by this session or any of the 6 corpora. Already
promoted to `ACTION_REQUIRED` in `.context/research/decisions.json` given
the evidence density.

## J — Next-wave requirements (highest-impact first)

1. **A runnable, pinned LabLaunchPad implementation** — the precondition
   for closing `GAP-E5-ZERO`/`UNK-E5-ALL`. No amount of further desk
   research changes this; it requires Phase 2+ implementation.
2. **Formal ADR-writing pass** over the 22 accumulated ADR-CANDIDATEs plus
   `SRC-POSTCOMMIT`'s governance proposals, using `ARCHITECTURE-DECISIONS.md`
   below as the starting map, not a substitute for it.
3. **Close the 3 remaining original-brief gaps** (Volcengine, Baidu, Agent
   Skills) via live WebSearch/WebFetch, same discipline as the A2A closure.
4. **Re-verify `UNK-MAF-LOCAL-SHELL`** directly against MSFT's own release
   notes — single-source claims should not silently become assumed fact.
5. **Design `@lablaunchpad/state`'s `CheckpointStore` contract** with the
   `UNKNOWN_OUTCOME` convergence and LangGraph's persistence-lifecycle gap
   (`CLM-LANGGRAPH-002`) as direct, named inputs — not abstractly deferred.

## Completion statement

Per the consolidation task's own completion rule: this report does **not**
claim `COMPLETE`. `meta.status` in `canonical-research.json` is `PARTIAL`.
Evidence remains insufficient for every architecture decision recorded here
in the strict E5 sense — all of it rests on E3/E4 documentation, consistent
with every corpus's own honest self-assessment (wave1: "STATUS: PARTIAL...
does not claim full completion because the existing LabLaunchPad
repository/corpus and runnable E5 environment were not available").
