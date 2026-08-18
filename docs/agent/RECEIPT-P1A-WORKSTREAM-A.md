# Phase 1A — Workstream A Sub-Receipt: OKF v0.2 Adoption

```
============================================================
AGENT SDK PHASE RECEIPT
============================================================
PHASE:
  P1A — OKF v0.2 Adoption + Gap Audit (Workstream A: OKF Adoption)

STATUS:
  PASS

OUTCOME:
  Agent-facing knowledge (.context/, research/, specs/, ADR/) now carries OKF
  v0.2 frontmatter. A sixth validator (okf-conformance) enforces the spec's
  own conformance rule with proven leniency where the spec requires it.
  context-staleness-validator was rewritten to derive freshness and trust
  tier from the OKF envelope instead of trusting stored values. Every item in
  the no-regression gate holds. Workstream B (gap audit) may now begin.

TOOLCHAIN:
  node:              v24.19.0 (LTS Krypton) — unchanged from Phase 0
  pnpm:              10.33.0
  typescript:        6.0.3
  vitest:             4.1.10
  new dependency:    yaml@2.9.0 (repo-tools only; frontmatter parsing)

IMPLEMENTED:
  - okf.json — OKF conformance manifest (scopes, reserved/excluded filenames)
  - scripts/repo-tools/src/lib/okf.ts — shared frontmatter parsing, actor
    validation, trust-tier derivation (used by both new/rewritten validators)
  - okf-conformance-validator (6th) — structural OKF conformance
  - context-staleness-validator — rewritten: reads sources[]/x_source_sha256,
    derives freshness (never stored) and trust tier from verified[]
  - .context/ migrated: 4 cache records -> OKF markdown; INDEX.md -> index.md
    (reserved); log.md added (reserved)
  - ADR/0001-0006 + specs/persistence/STORE-INTERFACES.md: OKF frontmatter
    added, duplicated Status/Date rows removed from body tables
  - ADR/TEMPLATE.md, specs/TEMPLATE-BEHAVIOUR-SPEC.md: updated so future
    documents are born OKF-conformant
  - ADR-0007 (adopt OKF v0.2), ADR-0008 (cache trust tiers, amends ADR-0005)
  - AGENTS.md, SOURCE-OF-TRUTH.md, DECISIONS.md, NOW.md, NEXT.md, STATE.md,
    .context/state/{project,active-task}.json: updated for OKF + phase
    transition P00 -> P1A
  - repo-policy.json: .context/INDEX.md -> .context/index.md, okf.json added
    to requiredFiles
  - Stale .context/INDEX.md references fixed across AGENTS.md, CLAUDE.md,
    OPENCODE.md, CODEX.md, README.md, docs/agent/BOOTSTRAP.md,
    docs/agent/CONTEXT-MAP.md

SPEC:
  governing:  ADR-0007, ADR-0008
  satisfied:  yes
  drift:      none

FILES CHANGED:
  ~94 files touched. 32 fixture files added, 12 removed (JSON -> OKF
  markdown context fixtures), 1 renamed. 8 ADRs modified/added. 6 root
  manifests/configs changed or added (okf.json new).

VALIDATORS:
  schema-contract:      PASS  (unchanged from Phase 0)
  package-boundary:     PASS  (unchanged from Phase 0)
  context-staleness:    PASS  (records=4 ACTIVE=3 STALE=0 INVALID=0
                                NOT_REQUIRED=1 unverified=4
                                machine-confirmed=0 human-reviewed=0)
  okf-conformance:      PASS  (scanned=20 concepts=13 reserved=2 excluded=5) — NEW
  package-exports:      PASS  (unchanged from Phase 0)
  repository-policy:    PASS  (requiredFiles=14, +okf.json)

NO-REGRESSION GATE (A6):
  1. All 5 original validators still PASS .......................... PASS
  2. All original adversarial negative fixtures still reject
     (migrated, not deleted — see note below) ....................... PASS
  3. All 5 live negative probes from RECEIPT-P00.md re-run,
     each fails then reverts to green ................................ PASS
  4. pnpm verify green on Node 24.19.0 .............................. PASS
     CI green ........................................................ PASS (run #4, commit fb615ed)
  5. .context hash check still functions (proven live: editing
     ADR-0003 to add frontmatter produced a real STALE finding,
     caught before this receipt was written) ......................... PASS
  6. No knowledge fact exists in two formats simultaneously
     (verified: zero .context JSON files carry source/sha256/
     freshness fields; zero old-format context fixtures remain) ...... PASS

  Coverage note on #2: the old "freshness value outside the four
  states" test is gone because freshness is no longer a STORED field
  under OKF — there is nothing to hold an invalid enum value. It is
  replaced by a genuinely malformed-YAML-frontmatter fixture, which
  is the equivalent trigger for the INVALID state under the new
  model. All four freshness states (ACTIVE/STALE/INVALID/
  NOT_REQUIRED) remain exercised — INVALID now has three distinct
  triggers (source-missing, missing-hash-fields, malformed-frontmatter)
  instead of one.

NEGATIVE FIXTURES:
  context-staleness (5, all REJECTED):
    stale-record, source-missing, missing-hash-fields,
    malformed-record (malformed YAML), stale-after-elapsed (NEW —
    hash matches but calendar date has passed)

  okf-conformance (7, all REJECTED) — NEW:
    missing-type, missing-frontmatter, malformed-frontmatter,
    invalid-status, invalid-stale-after, invalid-generated-by,
    invalid-verified

  okf-conformance LENIENCY (3, all ACCEPTED — must NOT reject) — NEW:
    unknown type value + unknown key + broken link, all in one
    concept -> PASS
    bare `verified` mapping (not a list) -> PASS, correctly
    recognized as one-element list
    index.md/log.md with and without their one permitted field -> PASS

  Unchanged from Phase 0 (still REJECTED): 5 boundary, 4 policy,
  3 schema, 2 exports = 14 fixtures, verified present and passing.

LIVE PROBES (re-run against the OKF-migrated repository):
  1. node:fs import in runtime-neutral package -> FAIL, reverted -> PASS
  2. Spec edited without hash refresh -> FAIL (context-staleness
     caught it on ADR-0003 for real during this migration, not just
     as a synthetic probe), refreshed -> PASS
  3. Missing .js extension -> lint FAIL + smoke FAIL, reverted -> PASS
  4. Exports-map target removed -> FAIL, reverted -> PASS
  5. Inward dependency (layer 0 -> layer 99) -> FAIL, reverted -> PASS

BUILD:
  pnpm build (tsc, 2 packages) — PASS. repo-tools gained one runtime
  dependency (yaml@2.9.0); still builds and runs from dist/.

TESTS:
  unit:          11 passed / 11  (was 7; +4 okf-conformance positive/leniency)
  contract:      7 passed / 7   (unchanged)
  integration:   n/a
  adversarial:  26 passed / 26  (was 18; +7 okf negative, net +1 context)
  portability:   n/a
  total:        44 passed / 44, 4 files

LINT:
  eslint . — 0 errors, 0 warnings

FORMAT:
  prettier --check . — all matched files conform (refresh output confirmed
  formatter-stable for the new YAML frontmatter patcher, same discipline as
  Phase 0's JSON patcher)

EVIDENCE:
  - OKF v0.2 is real and current, verified against its own SPEC.md and the
    Google Cloud Blog v0.2 announcement, not assumed from the format's name
  - A real authoring defect was caught mid-migration: ADR-0004's frontmatter
    description started with an unquoted `@`, which is invalid YAML — the
    okf-conformance-validator rejected it before this receipt was written,
    and it is now a fixture (tests/fixtures/context/malformed-frontmatter,
    tests/fixtures/okf/malformed-frontmatter)
  - context-staleness-validator caught genuine drift during this same
    migration: editing ADR-0003 (to add its own frontmatter) invalidated its
    already-compiled .context/evidence/toolchain-pin.md summary — refreshed
    and re-verified, demonstrating the hash check functions on real edits,
    not only synthetic fixtures
  - The formatter-stability lesson from Phase 0's JSON patcher was reapplied
    proactively to the new YAML frontmatter patcher (surgical regex patch of
    x_source_sha256 and generated.at only, never a full re-serialize) —
    confirmed stable by re-running format:check immediately after a refresh

RISKS:
  - OKF v0.2 is six weeks old (shipped 2026-07-25); a v0.3 could change a
    field this repository depends on — mitigated by ADR-0007's revisit
    trigger, checked at each phase boundary alongside TYPESCRIPT_7_REVISIT
  - Every .context/ record is currently `unverified` — a truthful starting
    state, not yet a defect, but ADR-0008 commits to tracking this fraction
    in docs/agent/NEXT.md and revisiting if it never decreases
  - Two validators (okf-conformance, context-staleness) can both flag a
    single malformed record under different rule namespaces — deliberate
    separation of concerns (documented in both validators' docstrings), not
    accidental duplication, but worth knowing when reading validate output

UNKNOWN:
  - Whether OKF's own tooling (if any ships beyond the reference agent and
    static viewer mentioned in its announcement) would parse this
    repository's `x_`-prefixed extension fields without complaint — not
    tested against anything but this repository's own validator
  - Real-world value of the derived trust-tier mechanism — it exists now,
    but whether anyone actually uses `verified` going forward is an
    operational question tracked in NEXT.md, not something this receipt can
    determine

DRIFT:
  none

DECISIONS:
  - ADR-0007 — Adopt OKF v0.2 for agent-facing knowledge
  - ADR-0008 — Cache trust tiers via verified (amends ADR-0005)

LEARNINGS:
  - L004 — A malformed-YAML defect (unquoted `@`) was caught by the very
    validator built to catch it, on real content, within the same session
    that wrote both.                                       status: validated
  - L005 — Machine-written files and a formatter fight unless the writer
    patches surgically. Reapplying the Phase 0 JSON lesson to YAML
    frontmatter preemptively avoided a repeat regression. status: validated

NEXT GATE:
  Workstream B — Gap Audit (90 dimensions, split as: 1A-1 self-audit with no
  external research, then 1A-2 targeted primary-source evidence only for
  dimensions 1A-1 marks MISSING/UNVERIFIED).
  Entry condition: this receipt reads PASS and CI is confirmed green.

  Phase 2 has NOT started.
============================================================
```
