---
type: Research Consolidation Report
title: Current State Reconciliation
description: Verified repository inventory grounding Phase 1B — ADR/spec/contract/test/CI/pattern layer, checked directly rather than assumed
sources:
  - resource: /ADR
    id: adr-dir
  - resource: /specs
    id: specs-dir
  - resource: /docs/architecture/PACKAGE-MAP.md
    id: package-map
  - resource: /docs/architecture/DEPENDENCY-DIRECTION.md
    id: dependency-direction
  - resource: /docs/architecture/SOURCE-OF-TRUTH.md
    id: source-of-truth
  - resource: /.github/workflows/ci.yml
    id: ci
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: direct read-only inspection this session, substituting for an Explore-agent pass that hit a session-limit API error mid-run. Every fact below was read from the file named, not recalled or inferred.
---

# Current State Reconciliation

Phase 1B's own governing rule ("do not reinterpret these numbers as
absolute truth without checking the repository") applied to itself: before
consolidating anything, this file records what direct inspection actually
found, separate from what the audit or the operating prompt assumed.

## 1. ADRs (`ADR/`)

8 accepted, `ADR/0001` through `ADR/0008`, plus `TEMPLATE.md` and
`README.md`. One-sentence decision and open edge for each:

| ADR  | Decision                                                                                           | Does NOT cover                                                               |
| ---- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 0001 | TypeScript is the canonical implementation language; contracts stay language-neutral (JSON Schema) | Which packages exist, or when                                                |
| 0002 | `nodenext` module resolution; no bundler in core                                                   | Runtime adapters (Phase 17)                                                  |
| 0003 | TypeScript pinned to 6.0.3; `TYPESCRIPT_7_REVISIT` gate                                            | Any other dependency version policy                                          |
| 0004 | `@lablaunchpad/*` npm namespace                                                                    | Package boundaries themselves                                                |
| 0005 | `.context/` is a compiled cache, never canonical                                                   | What IS canonical (that's `SOURCE-OF-TRUTH.md`, not an ADR)                  |
| 0006 | Store interfaces specified in Phase 0, implemented in Phases 4/7; no cloud DB in core              | The actual interface shapes (that's `specs/persistence/STORE-INTERFACES.md`) |
| 0007 | Adopt OKF v0.2 for `.context/`, `research/`, `specs/`, `ADR/`                                      | `docs/` (explicitly out of scope)                                            |
| 0008 | Cache trust tiers (`unverified`/`machine-confirmed`/`human-reviewed`) via `verified`               | A review cadence — the mechanism exists, nobody has used it yet              |

**The open space these 8 ADRs leave**: nothing about the actual SDK
architecture (Agent/Capability/Policy/State/Workspace/Security/Model
boundaries) has been decided at ADR rank yet. All of that currently lives
one rank lower, as `research/` (rank 8, DERIVED) — which is exactly the
conversion gap this phase exists to close.

**ADR template** (`ADR/TEMPLATE.md`): `Context` / `Decision` (imperative,
one per ADR) / `Adversarial review` (Attack, Failure modes, Falsifying
experiment — required) / `Alternatives considered` (table) / `Consequences`
/ `Revisit trigger` (must be observable, "when it feels wrong" is
explicitly disallowed) / `Evidence`. A `Phase` / `Supersedes` header table.
This is the template every new ADR in this phase uses, unchanged — see
`DECISION-CONSOLIDATION.md` for why a second, competing template was not
introduced.

## 2. Specs (`specs/`)

Three files total: `README.md`, `TEMPLATE-BEHAVIOUR-SPEC.md`, and
**`specs/persistence/STORE-INTERFACES.md`** — a real, non-trivial
constraint spec (`SPEC-PERSIST-001`, v0.1.0, governed by ADR-0006) already
covering `StateStore`/`SessionStore`/`CheckpointStore`/`MemoryStore`/
`EvidenceStore`/`EventStore`. It already states an invariant directly
relevant to this phase's `UNKNOWN_OUTCOME` finding: "side-effect completion
is itself persisted state, not inferred from progress." Its own "Open
questions" section already flags exactly the kind of uncertainty an ADR
should resolve (`EventStore` cross-stream ordering; optimistic concurrency
sufficiency for `StateStore`). **This file gets amended, not replaced or
duplicated, by ADR #2 below.**

No other specs exist. Phase 2 (behaviour specification for the boundaries
this phase locks) has genuinely not started.

## 3. Contracts (`packages/contracts/src/`)

`index.ts`, `harness/{define-contract,conformance}.ts`,
`__scaffold__/version-tag.ts`. Exactly what Phase 0 built: a Zod↔JSON
Schema round-trip harness and one trivial scaffold export, explicitly
marked for deletion in Phase 3. No domain contracts exist. Confirms: there
is nothing at contract rank for this phase's ADRs to contradict or
duplicate.

## 4. Validators (`scripts/repo-tools/src/validators/`)

Six today: `schema-contract`, `package-boundary`, `context-staleness`,
`okf-conformance`, `package-exports`, `repository-policy`.

- `context-staleness-validator`: recomputes each `.context/` record's
  source hash, reports `ACTIVE`/`STALE`/`INVALID`/`NOT_REQUIRED`, and
  derives a trust tier from `verified`. It does **not** check ID
  cross-references between JSON files, and does **not** check markdown
  link resolution.
- `okf-conformance-validator`: scans `.context/`, `research/`, `specs/`,
  `ADR/` (from `okf.json`'s `scopes`) for frontmatter presence, required
  `type`, and well-known field format (`status` enum, `stale_after` date,
  `generated.by`/`.at`, `verified` shape). It does **not** validate
  arbitrary JSON files (`canonical-research.json`, `.context/research/*.json`
  are plain JSON, out of its scan scope), and does **not** check link
  resolution either.

**Confirmed genuine gap** (see also §6): neither validator, nor any other,
checks that an `evidence_ids`/`source_ids`/`claim_ids`-style reference
inside a JSON ledger actually resolves to a real ID, or that a relative
markdown link resolves to a real file. This is the concrete, bounded scope
for the 7th validator this phase adds (`research-integrity`).

## 5. Tests (`tests/`)

Fixture-driven: `tests/fixtures/{boundaries,schema,policy,exports,context,okf}/`,
each with positive and negative-fixture subdirectories, one directory per
validator. `tests/README.md` documents the convention. The new
`research-integrity` validator follows the identical pattern:
`tests/fixtures/research-integrity/{valid,broken-reference,broken-link}/`.

## 6. CI (`.github/workflows/ci.yml`)

78 lines. Steps: checkout → pnpm/node setup → toolchain-version print →
`install --frozen-lockfile` → `build` → `typecheck` → `lint` → `format:check`
→ `test` → 5 named validator steps (`schema-contract`, `package-boundary`,
`context-staleness`, `package-exports`, `repository-policy`).

**Confirmed gap, not assumed**: `okf-conformance` never appears in this
file. It is the 6th validator (added in Workstream A, after this CI file
was last touched) and is only ever run via the local `pnpm validate`
aggregate command, never in CI. Every PR since Workstream A has been able
to merge with OKF-nonconformant frontmatter across `.context/`, `research/`,
`specs/`, or `ADR/` without CI catching it — the local pre-push discipline
this session has followed happened to catch every case, but CI itself does
not enforce it. Fixed in this phase (§8 of the plan): add the missing
step, plus the new `research-integrity` step.

## 7. Extracted patterns (`knowledge/patterns/*.yaml`)

4 files, all `status: CANDIDATE`, none `VALIDATED` (validation requires
LabLaunchPad's own repeated experimental confirmation, which hasn't
happened — consistent with `GAP-E5-ZERO`): `agent-harness-workflow-layering`
(MAF's three-layer split, confirms existing `PACKAGE-MAP.md` composition
layer — no new decision needed), `local-model-gateway-with-hosted-fallback`,
`thin-sdk-shared-runtime`, `tool-boundary-guardrails` (OpenAI's
`ToolInputGuardrail`/`ToolOutputGuardrail`, direct input to ADR #5 below).

## 8. Precedence hierarchy (`docs/architecture/SOURCE-OF-TRUTH.md`)

Already exactly the hierarchy the operating prompt asks for, in this
repository's own words: `ADR` (1, canonical decisions) > `specs/` (2,
canonical behaviour) > `tests/` (3, canonical verification) >
`packages/`/`adapters/` (4, canonical implementation) > `benchmarks/`
results (5, canonical measurement) > `golden-cases/` (6) > `docs/` (7) >
`research/` (8, **DERIVED — informs decisions, never overrides them**) >
`.context/` (9, compiled cache, never canonical). Explicit conflict-
resolution rule: "If implementation contradicts spec, that is drift.
Report it... If the spec turns out to be wrong, change it via an ADR, then
change the code. Never the reverse order, and never only one of the two."
**No new hierarchy or rule is introduced by this phase — it already
exists and is followed as-is.**

## 9. Package/layer model (`docs/architecture/PACKAGE-MAP.md`,

`DEPENDENCY-DIRECTION.md`)

`PACKAGE-MAP.md`'s planned-package table and `DEPENDENCY-DIRECTION.md`'s
layer model are complementary, not identical: `DEPENDENCY-DIRECTION.md`
names 5 conceptual layers (`contracts → core → composition → runtime →
adapters`), and `PACKAGE-MAP.md` lists the actual candidate packages within
those layers at finer grain (state/context/memory/capabilities/policy are
all layer-1 `core` packages in `DEPENDENCY-DIRECTION.md`'s terms).

**Correction to this session's own earlier framing** (recorded in
`BOUNDARY-RECONCILIATION.md`, not silently fixed here): `DEPENDENCY-
DIRECTION.md` already names `adapters/tools (browser/sandbox)` and
`adapters/protocols (MCP/A2A/Skills)` as layer-4 categories. Sandbox
already has a declared architectural home, and so does Agent Skills — the
`research/canonical/ARCHITECTURE-DECISIONS.md` framing of `SandboxEngine`
as wholly "absent from the package map" was imprecise; it is absent as an
_elaborated package_, not absent as a _named category_. This narrows ADR
#4 below from "propose a new boundary" to "resolve where Workspace sits
relative to the already-named sandbox category, and give it a concrete
package/spec home."

Creation rule (unchanged, verbatim from `PACKAGE-MAP.md`): a package is
created only for a proven dependency cut, an independent version cadence,
or a genuine portability requirement — never because it appears in this
table.
