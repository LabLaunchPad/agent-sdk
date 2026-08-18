# Repository Integrity Audit — Derived-Projection Drift & Validator Semantics

Audit of `LabLaunchPad/agent-sdk` at `5d4ec6f` (branch
`claude/agent-sdk-execution-context-h1lzv2`), executed 2026-08-18 on the
baseline toolchain the repository itself requires (Node 24.19.0, pnpm 10.33.0,
TypeScript 6.0.3) so that results qualify as evidence under
`.context/state/runtime.json`'s `evidenceRule`.

Every claim below is labelled `VERIFIED` (executed and observed),
`SUPPORTED` (read directly from source), `INFERRED`, or `UNKNOWN`, per
`AGENTS.md`'s Evidence principle.

---

## A. Confirmed findings

### A1 — Seven validators pass against knowingly false content `VERIFIED`

Reverting `.context/index.md` and `README.md` to their pre-fix content — which
stated "six validators" and "five validators" respectively, against seven on
disk — and running the full validator suite produced **`7/7 validators
passed`**. The suite cannot observe the truth of prose claims about the
repository.

This is the load-bearing experimental result of the audit: not that a number
was wrong, but that **nothing mechanical could ever have caught it**, and
nothing prevents recurrence tomorrow.

### A2 — A live three-way contradiction about the current phase `VERIFIED`

At `5d4ec6f`, three artifacts disagreed about the single most consequential
fact in the repository:

| Artifact                                                      | Claim                                                         |
| ------------------------------------------------------------- | ------------------------------------------------------------- |
| `.context/index.md`                                           | "P1A … Workstream B in progress" + "**Do not begin Phase 2**" |
| `docs/agent/STATE.md`                                         | "Phase 1B … (complete)"                                       |
| `.context/state/project.json`, `specs/active.json`, `NEXT.md` | `P2` / `COMPLETE`                                             |

`AGENTS.md` rule **C2** mandates `.context/index.md` as the first artifact any
agent reads. The stalest description of current state was therefore also the
most-read one, and it actively instructed agents not to begin a phase that had
already completed, and to close research gaps that were already closed.

### A3 — The drift is systemic across every hand-maintained projection `VERIFIED`

Census against ground truth at `5d4ec6f`:

| Fact            | Ground truth (authority)            | `.context/index.md`    | `README.md` | `STATE.md`   |
| --------------- | ----------------------------------- | ---------------------- | ----------- | ------------ |
| Validator count | **7** (`validators/*.ts`, `ci.yml`) | 6 ✗                    | 5 ✗         | 7 ✓          |
| Current phase   | **P2** (`state/project.json`)       | P1A ✗                  | "Phase 0" ✗ | P1B ✗        |
| ADRs            | **16** (`ADR/[0-9]*.md`)            | lists 8 ✗              | —           | —            |
| Research brief  | **17/17** (`NEXT.md`)               | "9 of 17, 3 UNKNOWN" ✗ | —           | "2 of 17" ✗  |
| Benchmarks run  | **3** (`benchmarks/*/runs/`)        | "None recorded" ✗      | —           | "1 of 10+" ✗ |

Note `README.md` still describes the repository as "Phase 0 — foundation
only", four phases behind. Nine distinct false statements across three files;
zero detected by CI.

### A4 — The custom JSON Schema evaluator silently fails open on 20 of 21 constructs `VERIFIED`

Differential test driving the **real compiled `schemaContractValidator`**
against **Ajv 8.20.0** (the reference implementation the repository already
depends on in `packages/contracts`):

```
not · oneOf · anyOf · allOf · multipleOf · exclusiveMinimum · exclusiveMaximum
minItems · maxItems · uniqueItems · contains · tuple items[] · additionalProperties:schema
patternProperties · propertyNames · minProperties · maxProperties
dependentRequired · if/then · $ref
        → IGNORED (custom evaluator accepts what Ajv rejects)
```

20/21 ignored; `format` "agreed" only because Ajv without `ajv-formats` also
ignores unknown formats — coincidence, not implementation.

Every divergence is in the **fail-open** direction. `schema-contract.ts`'s own
docstring states the validator exists to catch "a projection that is _more
permissive_ than the schema it came from" — the evaluator has exactly that
defect internally.

### A5 — The exposure is imminent, not theoretical `VERIFIED`

Probing `z.toJSONSchema(…, { target: 'draft-7' })` at the pinned Zod 4.4.3,
**8 of 12 everyday constructs emit ignored keywords**:

| Zod construct              | Emits              |
| -------------------------- | ------------------ |
| `z.union([…])`             | `anyOf`            |
| `z.string().nullable()`    | `anyOf`            |
| `z.discriminatedUnion(…)`  | `oneOf`            |
| `z.array(…).min(1)`        | `minItems`         |
| `z.number().positive()`    | `exclusiveMinimum` |
| `z.number().multipleOf(5)` | `multipleOf`       |
| `z.record(…)`              | `propertyNames`    |
| `z.intersection(…)`        | `allOf`            |

Current exposure is low only because exactly one contract exists
(`contractsChecked=1`) and it uses only supported keywords. **The first real
Phase 3 contract containing a union or a nullable field silently loses
validation.** Both error directions follow: a false negative ships a genuine
cross-language divergence, and a false positive raises a spurious CI failure
whose most tempting "fix" is to weaken the sample set — which would disable the
check permanently.

### A6 — A stale docstring inside the validator itself `SUPPORTED`

`scripts/repo-tools/src/validators/schema-contract.ts` documents
`acceptsUnderProjection` as: _"Ajv is loaded lazily and per-call from the
validated package's own dependency tree…"_. The function calls
`compile()` → `buildValidator()` → the hand-rolled `evaluate()`. Ajv is never
imported. The same drift class as A1–A3, now inside executable code, where the
comment is the only thing a reader has to go on.

### A7 — Drift has recurred before `VERIFIED`

Commit `9eef033` — _"Repair stale `.context/state/*.json` (Phase 2 + Knowledge
OS not reflected)"_ — is the repository correcting this exact class after the
fact. A2 proves the repair did not hold: the same class reappeared within two
phases. Manual repair is demonstrably not a durable control.

---

## B. Refuted findings

| Hypothesis                                              | Verdict             | Basis                                                                                                                                                                                                                   |
| ------------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| H17 — canonical precedence not encoded                  | **FALSE**           | `docs/architecture/SOURCE-OF-TRUTH.md` encodes a 9-rank precedence table plus an explicit conflict-resolution procedure. Among the strongest artifacts in the repository.                                               |
| H18 — contradiction lacks fail-closed representation    | **FALSE**           | `PARTIAL` is a first-class gate status; `phase-gate.json`'s `lock_state` distinguishes spec-prep from implementation. `SOURCE-OF-TRUTH.md` §"Resolving a conflict" mandates reporting drift, not silently resolving it. |
| H03 — validates artifacts without cross-artifact checks | **MOSTLY FALSE**    | `package-boundary` does real graph analysis incl. cycle detection; `research-integrity` checks 248 ID cross-references and 41 links across the canonical graph. Only the _prose-fact_ class is unchecked.               |
| H09 — simulation may satisfy integration evidence       | **FALSE (guarded)** | `GATE_B_E5_02` is recorded `PASS_SIMULATED`, never `PASS`. The repository already refuses this substitution explicitly.                                                                                                 |

The repository's epistemic discipline is genuinely unusual — `UNKNOWN` as a
first-class value, `NOT_EXECUTED` claims in receipts, explicit "this phase does
not prove" sections. The failures found are **not** failures of rigour in
reasoning; they are failures of **mechanisation**, in exactly the places where
rigour was left to human diligence.

---

## C. Remaining unknowns

| ID  | Status     | Why it cannot yet be established                                                                                                       |
| --- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| H15 | `PARTIAL`  | Claim→evidence lineage is rigorous in the Phase 2 receipt. Whether that discipline holds uniformly across all 528 files is unsampled.  |
| H19 | `UNKNOWN`  | Agent context/tool-budget efficiency is a property of sessions over time. `FAILURES.md` is empty; no session telemetry exists in-repo. |
| H20 | `UNKNOWN`  | Same. Static intent (`AGENTS.md` C1–C10, the efficiency ladder) must not be read as evidence of runtime behaviour.                     |
| H07 | **CLOSED** | Was `NOT_EXECUTED` in the Phase 2 receipt; this audit executed the full gate on-baseline and observed green. See §M.                   |

---

## D. Root-cause DAG

```
                    ┌──────────────────────────────────────────┐
                    │ ROOT: facts are DUPLICATED by hand into  │
                    │ projections, with no generation and no   │
                    │ machine check binding copy to source     │
                    └───────────────┬──────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌───────────────┐        ┌─────────────────────┐      ┌──────────────────┐
│ prose facts   │        │ multiple "current   │      │ code comments    │
│ (counts, ADR  │        │ state" artifacts    │      │ describing a     │
│  lists)       │        │ (index/STATE/JSON)  │      │ replaced design  │
└───────┬───────┘        └──────────┬──────────┘      └────────┬─────────┘
        │ A1, A3                    │ A2, A7                   │ A6
        └───────────────────────────┴──────────────────────────┘
                                    ▼
                    ┌──────────────────────────────────────────┐
                    │ partial update propagation (one copy     │
                    │ updated, siblings missed)                │
                    └───────────────┬──────────────────────────┘
                                    ▼
                    ┌──────────────────────────────────────────┐
                    │ STALE PROJECTION, undetectable by CI     │
                    └───────────────┬──────────────────────────┘
                                    ▼
                    ┌──────────────────────────────────────────┐
                    │ agent obeying C2 receives false context  │
                    │ ("Do not begin Phase 2")                 │
                    └───────────────┬──────────────────────────┘
                                    ▼
                    ┌──────────────────────────────────────────┐
                    │ wasted budget (redo closed research) or  │
                    │ refusal of legitimate work → DECISION    │
                    │ INTEGRITY RISK                           │
                    └──────────────────────────────────────────┘

SEPARATE BRANCH — same root, different medium:

  declared vocabulary (draft-07) ⊋ implemented vocabulary (≈9 keywords)
                    │  with no mechanism asserting the difference
                    ▼
  unsupported construct encountered → silently IGNORED (fail-open)
                    ▼
  validator's verdict diverges from every real consumer (A4)
                    ▼
  Phase 3's first union/nullable contract → guarantee evaporates (A5)
```

---

## E. Common systemic cause

The three symptom families — stale prose, contradictory state files, fail-open
schema semantics — are **one architectural gap in three media**:

> A **derived fact is stored rather than derived**, and no mechanism binds the
> stored copy to the authority that determines it.

- `.context/index.md` stores a phase name that `state/project.json` determines.
- `README.md` stores a validator count that `validators/*.ts` determines.
- `evaluate()` stores an _implicit_ vocabulary claim that `draft-07` determines.

`ADR-0005` already names the correct principle — "`.context` is compiled
cache". **The word doing the work is _compiled_, and nothing compiles it.**
`context:refresh` refreshes hashes of _linked source files_; it does not
generate index content. So the repository holds precisely the right belief and
lacks the mechanism that would make the belief true. That gap — belief without
mechanism — is the finding.

---

## F. Engineering mental models

1. **A cache that is written by hand is not a cache; it is a second source of
   truth wearing a cache's label.** Freshness metadata on _entries_ does not
   confer freshness on the _index_ that lists them.
2. **The most-read artifact decays fastest and is checked least.** Read
   frequency and verification effort are inversely correlated unless mechanised
   — `.context/index.md` is mandated first-read and was the most stale.
3. **Fail-open is invisible; fail-closed is loud.** JSON Schema's
   ignore-unknown-keywords rule exists for _cross-implementation portability of
   unknown vocabularies_, not as licence for a validator to skip keywords it
   knows about. Ajv fails compilation on unknown keywords by default;
   `schemasafe` tracks processed keywords and throws if any remain uncovered.
   Both treat under-implementation as a build-time error, which is the correct
   posture for a repository whose entire premise is verifiability.
4. **A comment is a projection of code.** It drifts by the same mechanism and
   deserves the same suspicion (A6).
5. **Manual repair of a systemic defect resets the clock; it does not stop
   it.** `9eef033` proved this empirically two phases before this audit.

---

## G. Formal invariants

Machine-checkable. Retained only where evidence supports them.

| ID               | Invariant                                                                                                                                                    | Status at `5d4ec6f`                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| `I-STATE-001`    | Every canonical fact has exactly one authoritative source.                                                                                                   | **VIOLATED** (A2)                          |
| `I-STATE-002`    | A derived projection never becomes authoritative.                                                                                                            | Stated in `SOURCE-OF-TRUTH.md`; unenforced |
| `I-STATE-003`    | Every derived projection is either generated from, or machine-checked against, its authority.                                                                | **VIOLATED** (A1, A3)                      |
| `I-STATE-004`    | Contradiction between authoritative records yields `CONFLICT`, and autonomous execution must not proceed.                                                    | **ABSENT** — no `CONFLICT` state exists    |
| `I-EVIDENCE-001` | Decision-critical evidence identifies the execution that produced it.                                                                                        | **VIOLATED** (H14 — see below)             |
| `I-EVIDENCE-002` | Decision-critical evidence identifies the repository revision it applies to.                                                                                 | **VIOLATED** (H14)                         |
| `I-EVIDENCE-003` | Simulation evidence never silently satisfies an integration-evidence requirement.                                                                            | **HOLDS** (`PASS_SIMULATED`)               |
| `I-SCHEMA-001`   | A schema construct the validator does not implement fails **closed**.                                                                                        | **VIOLATED** (A4)                          |
| `I-SCHEMA-002`   | Validator semantics agree with the declared vocabulary, or the declared vocabulary is narrowed to what is implemented — and that narrowing is itself tested. | **VIOLATED** (A4)                          |
| `I-AGENT-001`    | Agent context precedence is deterministic.                                                                                                                   | **HOLDS** (`SOURCE-OF-TRUTH.md`)           |
| `I-AGENT-002`    | Agent-readable state is reproducible from canonical state.                                                                                                   | **VIOLATED** (A3)                          |

`I-POLICY-001` (authorization tied to policy/capability state) is **not
assessable**: no `PolicyEngine`/`CapabilityEngine` exists — Phase 8/9, LOCKED.
Recording it as `UNKNOWN` rather than assuming either verdict.

### H14 evidence-chain trace `VERIFIED`

```
.context/evidence/phase-2-kernel-receipt.json
  └─ consumed by → phase-gate.json#phase_2_gates → lock_state_after_this_phase
        └─ decides → "may Phase 2 implementation begin?"
              └─ freshness checked?      NO — no stale_after, not hash-bound
              └─ commit identity?        NO — no SHA anywhere in the receipt
              └─ execution identity?     NO — "by": "process:claude-code-session"
              └─ environment identity?   NO — no toolchain fingerprint
              └─ timestamp granularity?  DATE ONLY ("2026-08-17")
```

The receipt's own `TESTS` field said `pnpm verify` was `NOT_EXECUTED` — so a
gate decision rested on a receipt that documented its own unverified state, and
nothing downstream could detect that. **Old-but-valid evidence can satisfy a
new decision**: a genuine temporal-integrity defect. Contrast SLSA/in-toto,
where an attestation binds a `subject` name _and digest_, and verification fails
if either mismatches.

---

## H. Minimal primitive set

Four primitives, not one per symptom.

### 1. `CanonicalFact`

- **Purpose**: the single authoritative answer to one question about the repo.
- **Data**: `{ id, value, authority: { kind: 'file'|'glob'|'query', ref }, computedAt }`
- **Authority**: derived by executing `authority`, never stored by hand.
- **Examples**: `validators.count` ← `scripts/repo-tools/src/validators/*.ts`;
  `phase.id` ← `.context/state/project.json#phase.id`; `adr.count` ← `ADR/[0-9]*.md`.
- **Failure mode**: authority unresolvable → `UNKNOWN`, never a stale default.

### 2. `FactProjection`

- **Purpose**: a rendered appearance of a `CanonicalFact` in human/agent-readable text.
- **Data**: `{ factId, file, marker }` — an explicit, addressable region.
- **Lifecycle**: `generate` (write from fact) or `check` (compare, fail on mismatch).
- **Invariant**: no projection exists without a registered `factId`.

### 3. `ConsistencyConstraint`

- **Purpose**: relate two or more facts that must agree (`index.phase == project.json.phase == STATE.phase`).
- **Verdict**: `AGREE` | `CONFLICT`. `CONFLICT` is fail-closed and blocks CI —
  this is the missing `I-STATE-004` representation.

### 4. `ExecutionReceipt`

- **Purpose**: bind evidence to the execution that produced it.
- **Data**: `{ commit, treeDigest, toolchain: {node,pnpm,tsc}, startedAt, command, exitCode, outcome }`
- **Invariant**: a gate may consume a receipt only if `receipt.commit` is an
  ancestor of (or equal to) the commit under evaluation, and the toolchain
  matches `runtime.json`. Directly implements `I-EVIDENCE-001/002` and the
  existing `evidenceRule`.

`EvidenceReference` and `Verdict` already exist in substance
(`KERNEL-CONSTITUTION.md` §5, the `VERIFIED/SUPPORTED/INFERRED/UNKNOWN/
NOT_EXECUTED` scale) and should be reused, **not** re-invented.

---

## I. Architecture alternatives

| Option                                                      | Correctness | Drift resistance | Agent readability      | CI cost | Maintenance | Failure transparency             |
| ----------------------------------------------------------- | ----------- | ---------------- | ---------------------- | ------- | ----------- | -------------------------------- |
| **A** — dedicated census validator (check-only)             | Medium      | Medium           | Unchanged              | Low     | Low         | Good (names mismatch)            |
| **B** — fully generated docs (`index.md` emitted wholesale) | High        | High             | Risk: prose voice lost | Medium  | Medium      | Poor (regeneration hides intent) |
| **C** — typed canonical manifest only                       | Medium      | Low              | Improves               | Low     | Low         | N/A — no check                   |
| **D** — generated projections + independent checker         | High        | High             | Preserved              | Medium  | Medium      | Good                             |
| **E** — manifest + generated regions + consistency check    | High        | High             | Preserved              | Low-Med | Low-Med     | Excellent                        |

**A** is insufficient alone: it catches only facts someone remembered to
enumerate, and A3 shows enumeration by hand is exactly what fails. **B**
over-corrects — `.context/index.md`'s prose carries genuine editorial judgment
(the "Active risks" section is high-value human writing that no generator would
produce). **C** has no enforcement, so it repeats the current failure with extra
structure.

---

## J. Recommended target architecture — Option E

Smallest design that eliminates the recurrence class rather than the instance:

1. **`repo-facts.json`** — a registry of `CanonicalFact` declarations
   (`id` → `authority`). Hand-authored **once per fact**, never per occurrence.
2. **Marked regions** in projections:
   ```md
   <!-- fact:validators.count -->seven<!-- /fact -->
   ```
   Prose around the marker stays human-authored; only the marked span is
   mechanical. This preserves what makes `index.md` valuable while removing
   what makes it wrong.
3. **Validator #8 `fact-consistency`** — recomputes each fact, compares every
   projection, and evaluates `ConsistencyConstraint`s. Fail-closed, CI-blocking,
   never advisory (mirroring `context-staleness`'s existing posture and honouring
   `index.md`'s own Active Risk #3).
4. **`pnpm facts:write`** — explicit local command that rewrites marked regions.
   Never runs in CI: auto-refresh in CI would rubber-stamp drift, the precise
   reasoning already documented for `context:refresh` in `ci.yml`.

For schema semantics, adopt the `schemasafe` posture: **track processed
keywords; if any keyword in a projection was not implemented, fail
compilation.** That converts A4 from a silent fail-open into a loud
build-time error, satisfying `I-SCHEMA-001` without expanding the evaluator's
vocabulary — which `AGENTS.md`'s efficiency principle and the "do not silently
broaden scope" rule both counsel against.

---

## K. Test / proof strategy

| Invariant            | Proof                                                                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `I-STATE-003`        | **Mutation test**: programmatically corrupt each marked region; assert `fact-consistency` fails. This is A1's experiment inverted into a permanent test. |
| `I-STATE-004`        | Fixture with deliberately contradictory phase values in two authorities; assert verdict `CONFLICT`, exit non-zero.                                       |
| `I-SCHEMA-001`       | Fixture schema per unimplemented keyword; assert **compile-time rejection**, not silent acceptance. Seeded directly from the 20 constructs in A4.        |
| `I-SCHEMA-002`       | Differential harness vs Ajv 8.20.0 over the supported subset; assert agreement on every sample. The probe used in this audit is the prototype.           |
| `I-EVIDENCE-001/002` | Assert a gate rejects a receipt whose `commit` is not an ancestor of `HEAD`, and one whose toolchain differs from `runtime.json`.                        |
| Regression for A1/A2 | `ci-coverage.unit.test.ts` already asserts every validator has positive + negative fixtures + CI wiring — extend it to cover validator #8.               |

Each maps to `docs/agent/FAILURES.md`'s rule 2: _"Every resolved failure carries
a regression test. No test, not resolved."_ — which, notably, is currently
unsatisfiable for A1–A7 because `FAILURES.md` is empty despite `9eef033` having
recorded exactly such a failure in its commit message.

---

## L. Implementation boundary

**Do now** (no runtime dependency; all are governance/tooling, which
`PHASE_2_IMPLEMENTATION: LOCKED` does not prohibit):

- Record A1–A7 in `docs/agent/FAILURES.md` — currently empty, which is itself a
  finding given A7 happened and was never recorded.
- `repo-facts.json` + validator #8 for the five facts already proven to drift.
- Fail-closed keyword tracking in `schema-contract.ts`.
- Delete or correct the stale Ajv docstring (A6).
- Add `commit`/`toolchain` fields to the phase-receipt template.

**Defer to Phase 4+** (needs runtime surface that does not exist):

- `ExecutionReceipt` as a kernel primitive rather than a repo-tooling struct.
- `CONFLICT` as a first-class kernel `Verdict` — belongs with
  `KERNEL-CONSTITUTION.md` §5, and `ADV-09/10/11` remain `NOT_EXECUTED` pending
  the same Guard/Event-log model.

**Do not do**: expand the JSON Schema evaluator's vocabulary to chase parity
with Ajv. Fail-closed on the subset is correct, smaller, and testable; parity is
an unbounded commitment.

---

## M. Evidence ledger

| #   | Evidence                                                                                              | Type     | Result                                                                                  |
| --- | ----------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------- |
| 1   | `git rev-parse`, `ls-remote`, `worktree add` at `5d4ec6f`                                             | Executed | Identity `VERIFIED`; prior 3-file audit was a different branch                          |
| 2   | `pnpm install --frozen-lockfile` + `pnpm verify`, Node 24.19.0 / pnpm 10.33.0 / tsc 6.0.3             | Executed | **7/7 validators, 50/50 tests, green** — closes H07                                     |
| 3   | Revert both projections to pre-fix content, re-run `validate`                                         | Executed | **7/7 PASS against known-false content** — proves A1                                    |
| 4   | Differential probe: real `schemaContractValidator` vs Ajv 8.20.0, 21 constructs                       | Executed | **20/21 IGNORED, all fail-open** — proves A4                                            |
| 5   | `z.toJSONSchema` probe, Zod 4.4.3, 12 constructs                                                      | Executed | **8/12 emit ignored keywords** — proves A5                                              |
| 6   | Census: `ls ADR/[0-9]*.md`, `validators/*.ts`, `benchmarks/*/runs/`, `boundaries.json` vs projections | Executed | 9 false statements across 3 files — proves A3                                           |
| 7   | `git show 9eef033`                                                                                    | Read     | Prior occurrence of the same class — proves A7                                          |
| 8   | `schema-contract.ts` L156-193, `conformance.ts` L1-62                                                 | Read     | Ajv docstring vs hand-rolled evaluator — proves A6                                      |
| 9   | Ajv strict-mode & security docs; `schemasafe` README                                                  | External | Fail-closed on unknown keywords is the industry posture                                 |
| 10  | SLSA v1.1 / in-toto attestation model                                                                 | External | `subject` + digest binding; verification fails on mismatch — informs `ExecutionReceipt` |

### Commits produced by this audit

| Commit    | Change                                                                                                         |
| --------- | -------------------------------------------------------------------------------------------------------------- |
| `fcc8839` | `.context/index.md` validator count six → seven                                                                |
| `43ee7f1` | `README.md` validator count five → seven (two occurrences)                                                     |
| `ff9f7b3` | `.context/index.md` + `docs/agent/STATE.md`: phase, ADR list, research status, benchmark baseline, next action |

All three are **symptomatic repairs**. Every fact they correct is derivable
from an authority that already exists; hand-maintaining a second copy is the
defect. Without §J, the expected outcome is another `9eef033` in two phases.

### FIX-VERDICT

| Dimension           | Assessment                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Correctness         | **PASS** — each new value matches ground truth; full gate green on-baseline                                              |
| Completeness        | **PARTIAL** — `README.md` still says "Phase 0 — foundation only"; `NOW.md` remains a P1A-era snapshot (may be by design) |
| Regression coverage | **NONE** — no test prevents recurrence; A1's experiment shows CI cannot detect it                                        |
| Recurrence risk     | **HIGH (unchanged)** — no mechanism added; A7 is the precedent                                                           |

---

## Addendum — Recurrence-class mechanization (2026-08-18)

The FIX-VERDICT above is superseded. Following this audit, the recurrence
class was mechanized rather than the instances patched again. See
`docs/agent/FAILURES.md` (F001-F005) for the failure records.

**Architecture (Option E, per §J):** a `CanonicalFact` registry
(`scripts/repo-tools/src/lib/facts.ts`) defines seven facts, each with a
single authoritative source and a `compute()` function - no fact is entered
by hand. The `GENERATED:START fact=<id>` / `GENERATED:END` HTML-comment pair
marks the exact span of a projection that must equal a fact's computed
value; everything outside a marked span stays hand-authored prose
(`scripts/repo-tools/src/lib/generated-regions.ts`). `pnpm facts:write`
(local-only, mirroring `context refresh`'s CI exclusion) regenerates marked
spans; validator #8, `derived-projection-consistency`, checks them,
fail-closed, CI-blocking.

**Proof, not assertion:** reverting `.context/index.md` and `README.md` to
their pre-fix (false) content and running the full suite now produces
`0/1 validators passed` on `derived-projection-consistency` with a precise
`DERIVED_PROJECTION_MISMATCH` finding - the exact experiment that proved
A1 now proves the opposite. Five mutation tests (Tests A-E, one per
demonstrated-drift fact) and four adversarial marker-corruption tests make
this permanent (`derived-projection-consistency.unit.test.ts`).

**Schema safety (§G/H):** `schema-contract.ts` now declares
`SUPPORTED_SCHEMA_KEYWORDS` explicitly and asserts every schema stays
within it - recursively, including nested `items`/`properties` - before
compiling a validator; an unrecognised keyword raises
`schema/unsupported-construct` rather than being silently accepted. A
12-keyword regression corpus (every construct the differential test in
finding A4 found ignored, plus one nested case) asserts fail-closed
behaviour, and a live differential test against Ajv 8.20.0 asserts
agreement on every sample for the supported subset
(`schema-safety.unit.test.ts`).

**Verified on-baseline** (Node 24.19.0, pnpm 10.33.0, tsc 6.0.3): full
`pnpm verify` green - 8/8 validators, 80/80 tests (1 differential test
skip-guarded as `VERIFY-BLOCKED` rather than silently passed if Ajv is
ever unavailable).

**Deliberately not implemented this pass:** count-style claims embedded in
non-`.md` files (e.g. the `.github/workflows/ci.yml` step-count comment)
are outside `derived-projection-consistency`'s `.md`-only scan scope, so
they can still drift undetected; `docs/agent/NOW.md`/`NEXT.md` were left
fully hand-authored (narrative, not atomic facts); the Node-baseline
`evidenceRule` is enforced by `pnpm`'s `engines` field, not by the CLI
itself - invoking `dist/cli.js` directly with `node` on any version
bypasses it (pre-existing, all eight validators, not scoped to this
milestone).
