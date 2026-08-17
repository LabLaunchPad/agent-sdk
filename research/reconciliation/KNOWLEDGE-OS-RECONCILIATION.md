---
type: Research Consolidation Report
title: Knowledge OS Reconciliation
description: Evaluation of a user-supplied 94-file "Decision Operating System / Knowledge OS" package against this repository's existing governance, kernel architecture, and decision system — what is adopted, what is rejected, and why
sources:
  - resource: knowledge-os/00-canonical/knowledge-os-charter.md
    id: charter
  - resource: knowledge-os/08-repository-ai/repo-system-reference/AGENTS.md
    id: package-agents-md
  - resource: knowledge-os/06-agent-sdk/core-semantics.md
    id: core-semantics
  - resource: knowledge-os/03-decision-os/decision-method.md
    id: decision-method
  - resource: knowledge-os/01-product/business-scope.md
    id: business-scope
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_decision_outcome: PARTIAL_ADOPT
---

# Knowledge OS Reconciliation

## What was uploaded

Three zips, all describing the same "Decision Operating System /
Knowledge OS" work at different stages of consolidation:

| Zip                                                            | Files | Role                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `81ad241e-ai_agent_sdk_full_session_audit_bundle.zip`          | 23    | Smallest — a session-audit subset                                                                                                                                                                                                                                                                                                                                                          |
| `7b01bdd4-ai_agent_sdk_decision_operating_system_full.zip`     | 38    | An earlier/component bundle, includes a Python build script                                                                                                                                                                                                                                                                                                                                |
| `87e35b47-decision_operating_system_knowledge_os_complete.zip` | 94    | **The canonical one.** Its own `README.md`/`CHANGELOG.md` frame it as the consolidation of the other two ("Created the Knowledge OS layer on top of the prior Decision Operating System and AI-SDLC work"); its `knowledge-os/12-research/legacy-ledgers/` directory literally contains the other bundles' ledgers, labeled "prior research/ledger package retained as reference material" |

Only `87e35b47` required direct evaluation — the other two are subsumed
by it, confirmed by direct inspection of its contents, not assumed from
the user's own description.

## Method

This is the same shape of input this repository has handled repeatedly
this session: a large external artifact presenting itself as
foundational governance/architecture. The standing rule applied every
time (`research/imported-corpus/SOURCE-RECEIPT*.md`,
`POST-COMMIT-OPS-DECISION.md`, the TS7/Socratic review recorded in
`docs/agent/DECISIONS.md`) is: **do not silently replace an
architectural/governance decision; a fact lives in exactly one canonical
place.** Three independent research passes compared the package against
three different parts of this repository's existing bound system.

## Comparison 1 — Governance (`AGENTS.md` and adapters)

Compared: the package's `knowledge-os/08-repository-ai/repo-system-reference/{AGENTS,AI-SDLC-PROTOCOL,architecture,README}.md`,
`ai-constitution.md`, `repository-ai-system.md`, `00-canonical/{knowledge-os-charter,operating-principles}.md`
against this repository's real `AGENTS.md`.

**Verdict: substantially duplicate, expressed at a more generic and
unenforced level.** The package's phase loop (`Before/During/After
change`, charter's `Intent→Outcome→...→Reassessment`) covers the same
ground as `AGENTS.md`'s gated `READ CACHE → CHECK STATE → READ SPEC →
PLAN → RED TEAM → IMPLEMENT → TEST → BENCHMARK → RECONCILE → UPDATE
CACHE → CHECKPOINT` loop, but with no gating mechanism, no phase
receipts, and no CI enforcement. Its evidence/decision-authority language
matches `AGENTS.md`'s stop conditions almost exactly. Its cache/
token-efficiency guidance ("context is a projection, not truth"; "promote
only stable knowledge") restates `AGENTS.md`'s C1-C10 rules without their
mechanical, hash-based, CI-integrated specificity. It defines no
equivalent to `docs/architecture/SOURCE-OF-TRUTH.md`'s precedence
hierarchy at all.

**Rejected, explicitly**: the package's own `repo-system-reference/README.md`
proposes a `.ai/{decisions,risks,evaluations,knowledge,workflows}/`
directory layout designed to "coexist" with multiple parallel instruction
files (AGENTS.md, CLAUDE.md, Cursor rules, GEMINI.md,
copilot-instructions) with no validator preventing duplication. This
directly conflicts with `repository-policy-validator`'s mechanical
enforcement that adapter documents (`CLAUDE.md`/`OPENCODE.md`/`CODEX.md`)
must never duplicate canonical architecture, and would create a second,
competing home for decisions/evidence that already canonically live in
`ADR/`, `docs/agent/`, and `.context/`. **Not adopted.** The package's own
`repo-system-reference/AGENTS.md`, `AI-SDLC-PROTOCOL.md`, and
`architecture.md` are likewise not merged into this repository's real
`AGENTS.md` — nothing in them presents evidence, benchmarks, or a
red-teamed proposal that would justify displacing the existing bound
contract.

**Adopted**: the charter's FACT/INFERENCE/ASSUMPTION/HYPOTHESIS/
RECOMMENDATION/DECISION/UNKNOWN claim-classification vocabulary, as a
small addendum to `AGENTS.md`'s existing Evidence principle (see
Disposition table below) — it sharpens the existing principle without
contradicting or replacing it.

## Comparison 2 — Architecture / kernel

Compared: the package's `knowledge-os/04-architecture/{golden-architecture,layer-model}.md`,
`knowledge-os/06-agent-sdk/{core-semantics,determinism-model,execution-modes,engineering-agent-model}.md`
against `docs/architecture/KERNEL-CONSTITUTION.md` (just finished this
session, Phase 2) and `docs/architecture/PACKAGE-MAP.md`.

**Verdict: complementary at the process layer, genuinely conflicting if
its "core semantics" were treated as kernel-primitive-equivalent.** The
package's `core-semantics.md` + `golden-architecture.md` define 8
different primitives — `Agent, Run, State, Event, Tool, Model, Policy,
Checkpoint` — against the kernel constitution's 10 — `Identity, Task,
Run, State, Operation, Capability, Policy, Checkpoint, Evidence,
Verdict`. Only `Run`, `State`, `Policy`, `Checkpoint` overlap by name; the
package has no `Identity`, no `Task`, no `Operation`/side-effect state
machine, no `Verdict`, and its `Capability` template (a product/feature
deliverable with Owner/Dependencies/Enables/Conflicts) and `Evidence`
template (a decision-documentation classification) mean structurally
different things than the kernel's `Capability` (an authorization grant)
and `Evidence` (provenance/transition-linkage/E0-E5 confidence) — real
term collisions, not synonyms.

A full-text search of all 94 files for `UNKNOWN_OUTCOME` found **zero
matches**. There is no operation/side-effect state machine anywhere in
the package — no `OperationID`/`AttemptID`/`IdempotencyKey`/`InputHash`
fields, no `AUTHORIZED → DISPATCHED → ACKED|REJECTED|UNKNOWN_OUTCOME →
RECONCILING` enum, no timeout-vs-rejection distinction. This is this
repository's single most cross-corpus-corroborated finding
(`CTR-UNKNOWN-OUTCOME-CONVERGENCE`, ADR-0011, `KERNEL-CONSTITUTION.md`
section 2) — the package is silent on it, not contradicting it.

The package's `layer-model.md` (L0-L9, Product→Platform→Systems→
Modules→Subsystems→Components→Interfaces→Implementation→Evaluation→
Production) is a generic SDLC/org layering, answering a different
question than `PACKAGE-MAP.md`'s package-dependency-direction layers —
low collision risk, though both use "Layer N" numbering, which could
cause confusion if merged carelessly. Not merged.

**Rejected, explicitly**: the 8-primitive "core semantics" is not merged
into or allowed to override `KERNEL-CONSTITUTION.md`'s 10 primitives.
Doing so would violate the exact "zero new ADRs, synthesis not new
decision" discipline this repository just finished applying to write that
document, and would introduce the `Capability`/`Evidence` term collisions
noted above.

**Adopted, as non-kernel-competing reference notes only** (see
`research/topics/execution-modes.md`): the Chat/Agent/Workflow/
Engineering-agent execution-mode taxonomy, and the replay-envelope/
fixture concept (state + event history + model fixture + tool fixtures +
policy version + workspace snapshot + controlled clock/randomness →
reproducible stream) as a concrete technique to consider when Phase 4+
actually implements replay, not a change to the constitution's Testability
section.

## Comparison 3 — Decision method / business scope

Compared: the package's `knowledge-os/03-decision-os/{decision-method,
decision-depth-model,completeness-audit}.md`, `knowledge-os/01-product/
{business-scope,product-scope,non-goals}.md`, `ledgers/{business-scope,
canonical-decisions}.jsonl` against `ADR/TEMPLATE.md`, `docs/agent/
DECISIONS.md`, `docs/architecture/SOURCE-OF-TRUTH.md`, and `AGENTS.md`'s
Product Boundary section.

**Decision method verdict: reject as a replacement.** `decision-method.md`'s
39-step hierarchy, `decision-depth-model.md`'s 9 levels, and
`completeness-audit.md`'s 23-field checklist map roughly 1:1 onto
`ADR/TEMPLATE.md`'s existing Context/Decision/Adversarial review/
Alternatives/Consequences/Revisit trigger/Evidence structure — "evidence/
counter-evidence" ↔ Evidence + Adversarial review's Attack; "revisit
trigger" ↔ the same term, verbatim; "options/rejected options" ↔
Alternatives considered. The decision classes (BUILD/PROTOTYPE/RESEARCH/
REUSE/WRAP/ADAPT/DEFER/REJECT) are already live vocabulary in `docs/agent/
DECISIONS.md`'s smaller-calls table (`DEFER`/`ADAPT`/`REJECT` used
verbatim for the post-commit-ops decision). Same structure, different
words, no new rigor. `ADR/TEMPLATE.md` and `DECISIONS.md`'s structure are
**not changed**.

**Business scope verdict: no conflict, no meaningful sharpening.**
`business-scope.md`/`product-scope.md`/`non-goals.md` restate, in places
near-verbatim, decisions `AGENTS.md`'s Product Boundary section and this
repository's own local-first research already establish (solo/indie/
small-team focus, local-first, no mandatory cloud account, enterprise
usage allowed but not roadmap-driving). `ledgers/business-scope.jsonl`
(4 lines, BS-001-004) adds no further specificity. **Not merged.**

`ledgers/canonical-decisions.jsonl` (5 lines, ADR-CORE-001-005) asserts
terser, unsourced versions of decisions this repository has already made
via ADR-0001/0002/0009/0010/0012 — TypeScript-first kernel, a Run/State/
Event/Checkpoint substrate, pluggable sandbox backends, a 4-way memory-
class split. One line is genuinely not yet decided here: **SQLite/
file-first local persistence** (ADR-CORE-004) — `ADR-0006` explicitly
defers persistence interfaces to Phase 4/7, so this repository has no
binding position yet. Recorded as a watch-note (see Disposition table),
not adopted now — adopting a persistence backend from an unsourced,
compressed external ledger line would violate the same evidence
discipline this repository has applied to every other claim all session.

**Adopted**: `completeness-audit.md`'s 23-field checklist, specifically
its `NOT_APPLICABLE`-with-rationale escape hatch, as an _optional_ extra
pre-merge audit pass over future ADRs (`docs/agent/COMPLETENESS-CHECKLIST.md`)
— it is more granular than `ADR/TEMPLATE.md`'s single Adversarial review
section, but not required, and does not replace the template.

## Disposition table

| Item                                                                                                   | Source                                             | Disposition                                                                                                       | Where                                  |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `.ai/` parallel-instruction-file directory structure                                                   | `repo-system-reference/README.md`                  | **REJECT** — conflicts with mechanical anti-duplication enforcement                                               | This document only                     |
| Package's `repo-system-reference/{AGENTS,AI-SDLC-PROTOCOL,architecture}.md`                            | governance                                         | **REJECT** — no evidence justifying displacement of `AGENTS.md`                                                   | This document only                     |
| 8-primitive "core semantics" (`Agent/Run/State/Event/Tool/Model/Policy/Checkpoint`)                    | `core-semantics.md`, `golden-architecture.md`      | **REJECT** — term collisions with kernel `Capability`/`Evidence`, would violate zero-new-ADR synthesis discipline | This document only                     |
| `decision-method.md` / `decision-depth-model.md`                                                       | Decision OS                                        | **REJECT** — same structure as `ADR/TEMPLATE.md`, different words, no new rigor                                   | This document only                     |
| `business-scope.md` / `product-scope.md` / `non-goals.md`                                              | Product                                            | **REJECT** — restates existing `AGENTS.md` boundary, no new information                                           | This document only                     |
| Claim-classification vocabulary (FACT/INFERENCE/ASSUMPTION/HYPOTHESIS/RECOMMENDATION/DECISION/UNKNOWN) | `knowledge-os-charter.md`                          | **ADOPT** — small addendum, refines existing Evidence principle                                                   | `AGENTS.md`                            |
| Execution-mode taxonomy (Chat/Agent/Workflow/Engineering-agent)                                        | `execution-modes.md`                               | **ADOPT** — reference material, non-binding                                                                       | `research/topics/execution-modes.md`   |
| Replay-envelope/fixture concept                                                                        | `determinism-model.md`                             | **ADOPT** — reference material, non-binding                                                                       | `research/topics/execution-modes.md`   |
| Native-code escalation heuristic                                                                       | `engineering-agent-model.md`                       | **ADOPT** — reference material, non-binding                                                                       | `research/topics/execution-modes.md`   |
| 23-field completeness-audit checklist                                                                  | `completeness-audit.md`                            | **ADOPT** — optional extra check, not required                                                                    | `docs/agent/COMPLETENESS-CHECKLIST.md` |
| SQLite/file-first local persistence                                                                    | `ledgers/canonical-decisions.jsonl` (ADR-CORE-004) | **WATCH-NOTE** — not yet decided here, revisit at ADR-0006's Phase 4/7 trigger                                    | `.context/research/gaps.json`          |

## Conclusion

The package is not adopted as a governance, architecture, or decision
system. It is evaluated, and a small number of genuinely non-duplicate,
non-competing items are extracted as documented above. This is a
rejection of wholesale adoption with a few concrete extractions, not an
endorsement of the uploaded package as a replacement system — recorded
explicitly per this repository's standing rule against silently replacing
bound decisions.
