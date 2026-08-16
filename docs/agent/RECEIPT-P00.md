# Phase 0 Receipt

```
============================================================
AGENT SDK PHASE RECEIPT
============================================================
PHASE:
  P00 — Foundation + Working Toolchain Only

STATUS:
  PASS

OUTCOME:
  The repository now has a proven engineering substrate and the machinery that
  keeps it from drifting. A clean frozen-lockfile install builds, typechecks,
  lints, formats, tests and validates green on the pinned Node 24.19.0 baseline;
  five named validators enforce schema fidelity, dependency direction, cache
  freshness, publication correctness and repository policy, and each has been
  shown to REJECT its negative fixture. No Agent SDK product behaviour exists.

TOOLCHAIN:
  node:              v24.19.0 (LTS Krypton)
  pnpm:              10.33.0
  npm:               11.17.0
  typescript:        6.0.3   (latest available 7.0.2 — gated, see ADR-0003)
  typescript-eslint: 8.67.0
  eslint:            10.8.1
  prettier:          3.9.6
  vitest:            4.1.10
  zod:               4.4.3
  ajv:               8.20.0
  changesets:        3.0.0

IMPLEMENTED:
  - AGENTS.md — canonical cross-agent operating contract
  - CLAUDE.md / OPENCODE.md / CODEX.md — thin adapters, no duplicated architecture
  - docs/agent/ — bootstrap, state, now, next, decisions, failures, learnings,
    context map, phase receipt template
  - docs/architecture/ — package map, dependency direction, source of truth,
    naming, versioning, test taxonomy, benchmark taxonomy
  - .context/ — compiled cache with four-state freshness envelopes
  - boundaries.json / repo-policy.json — machine-readable layer and policy manifests
  - @lablaunchpad/contracts — placeholder: schema conformance harness + one
    deterministic exported function. No agent contracts.
  - @lablaunchpad/repo-tools — private package carrying the five validators,
    built by tsc and executed from dist/
  - ADR/0001–0006 + ADR and behaviour-spec templates
  - .github/workflows/ci.yml — validators as individually named steps

SPEC:
  governing:  none (Phase 0 establishes the substrate; behaviour specs are Phase 2)
  satisfied:  yes
  drift:      none

FILES CREATED:
  148 files — tests/fixtures 63, root 20, docs 17, scripts 13, .context 10,
  packages 8, ADR 8, specs 3, one README each for research/golden-cases/
  examples/benchmarks, .github 1, .changeset 1

VALIDATORS:
  schema-contract:      PASS  (modules=1 contractsChecked=1 samplesChecked=11)
  package-boundary:     PASS  (packagesDeclared=2 packagesDiscovered=2)
  context-staleness:    PASS  (records=4 ACTIVE=3 STALE=0 INVALID=0 NOT_REQUIRED=1)
  package-exports:      PASS  (packagesTested=1)
  repository-policy:    PASS  (requiredDirectories=11 requiredFiles=13 adapterDocuments=3)

NEGATIVE FIXTURES:
  Fixture suite (18 adversarial tests, all REJECTED as expected):
    package-boundary   — inward dependency                    REJECTED
    package-boundary   — node: import in neutral package      REJECTED
    package-boundary   — relative import missing .js          REJECTED
    package-boundary   — vendor SDK below adapters layer      REJECTED
    package-boundary   — package on disk, unregistered        REJECTED
    context-staleness  — source changed after compilation     REJECTED
    context-staleness  — source deleted                       REJECTED
    context-staleness  — record missing hash/timestamp        REJECTED
    context-staleness  — freshness outside the four states    REJECTED
    repository-policy  — adapter repeats canonical heading    REJECTED
    repository-policy  — adapter restates canonical prose     REJECTED
    repository-policy  — package outside org namespace        REJECTED
    repository-policy  — missing required structure           REJECTED
    schema-contract    — projection more permissive than schema REJECTED
    schema-contract    — contract with no conformance samples REJECTED
    schema-contract    — non-semver schema version            REJECTED
    package-exports    — published package, no smoke decl     REJECTED
    package-exports    — published package never built        REJECTED

  Live repository probes (each failed, then reverted to green):
    1. node:fs import added to @lablaunchpad/contracts
       → boundary/node-import-in-neutral-package, exit 1 → reverted, exit 0
    2. AGENTS.md edited without refreshing its cache record
       → context/stale-record, exit 1; NOT_REQUIRED entry unaffected;
         context refresh cleared it → exit 0
    3. `.js` extension dropped from a relative import
       → import-x/extensions (lint, exit 1)
       → boundary/missing-esm-extension
       → tsc BUILT IT WITHOUT ERROR, then the clean consumer failed with
         ERR_MODULE_NOT_FOUND — the exact failure class ADR-0002 exists to
         prevent → reverted, exit 0
    4. exports-map target removed from `files`
       → exports/target-not-packed + exports/execution-failed, exit 1 → reverted
    5. inward dependency contracts(layer 0) → repo-tools(layer 99)
       → boundary/inward-dependency, exit 1 → reverted, exit 0

BUILD:
  pnpm build (tsc, 2 packages) — PASS
  Emitted ESM preserves explicit .js specifiers and loads directly under Node.

TESTS:
  unit:          7 passed / 7
  contract:      7 passed / 7
  integration:   n/a — no cross-package behaviour exists yet (Phase 3)
  adversarial:  18 passed / 18
  portability:   n/a — requires a runtime adapter (Phase 17)
  total:        32 passed / 32, 4 files

LINT:
  eslint . — 0 errors, 0 warnings (type-aware, strictTypeChecked +
  stylisticTypeChecked)

FORMAT:
  prettier --check . — all matched files conform

EXPORT / PACKAGE SMOKE TEST:
  packed files:               17 — dist/** and package.json only.
                              No source, no tests, no tsconfig, no dev files.
  clean install:              PASS (tarball installed into a fresh consumer)
  import by public name:      PASS (`@lablaunchpad/contracts`)
  exported function executed: PASS (scaffoldEcho('smoke') → '@lablaunchpad/contracts:smoke')
  declarations resolve:       PASS (dist/index.d.ts present in installed package)

BENCHMARK:
  baseline:      none recorded
  current:       n/a
  delta:         n/a
  There is no behaviour to measure until Phase 3. No performance target is
  asserted, per the benchmark-first rule.

RESOURCE:
  tokens:        not measured
  latency:       full `pnpm verify` completes in ~30s locally, dominated by the
                 publication smoke test (npm pack + clean install)
  CPU / memory:  not measured

CONTEXT CACHE:
  updated:  yes
  entries:  4 records — ACTIVE 3, STALE 0, INVALID 0, NOT_REQUIRED 1

CI:
  .github/workflows/ci.yml — GREEN on run #2 (commit 8b5ca81), PR #1.

  Run #1 (commit 40a08be) FAILED, and correctly so. A blanket `dist/` rule in
  .gitignore had silently excluded a package-exports fixture, so the suite
  passed locally against a file git had never seen and failed in CI where it
  did not exist. Fixed by negating the ignore for tests/fixtures/**/dist/ only,
  and guarded by fixtures-tracked.unit.test.ts, which was confirmed to fail
  when the fix is reverted. Tests 30 -> 32.

  Recorded rather than quietly amended: the first CI run caught a real defect
  that local verification structurally could not, which is the argument for
  the CI gate existing at all.

EVIDENCE:
  - TypeScript 7 is unusable here ← npm registry query: typescript-eslint
    8.65.0/8.66.0/8.67.0 all declare `typescript: ">=4.8.4 <6.1.0"` (ADR-0003)
  - nodenext is required, not preferred ← live probe 3: tsc emitted an
    extensionless specifier without error and the clean consumer threw
    ERR_MODULE_NOT_FOUND
  - Cache staleness detection works on real files ← Prettier reformatted
    AGENTS.md and ADR-0003 mid-build; the validator caught both as STALE before
    any human noticed
  - Contract canonicalization is not cosmetic ← the first contract test failed
    because reordering two schema properties changed the contract hash
  - The tarball ships only build output ← npm pack file list, 17 entries

RISKS:
  - TypeScript pinned below latest; drift accrues — mitigated by the
    TYPESCRIPT_7_REVISIT gate, checked at each phase boundary. Overrides are
    prohibited.
  - A cache summary can be fresh and still wrong. Hash freshness proves the
    source has not changed, not that the summary was ever correct. Mitigated
    only by the discipline of never citing .context as evidence — stated
    explicitly in ADR-0005 as a discipline, not a mechanism.
  - CI has not executed yet. Local equivalence is strong evidence, not proof.

UNKNOWN:
  - Behaviour of the emitted packages under workerd. Deferred to Phase 17; the
    static node: import ban is a proxy, not a substitute.
  - Whether the 12-word n-gram threshold for adapter-document duplication is
    correctly calibrated. It currently passes with no false positives, but it
    has only three documents to judge from.
  - Real token cost of the .context retrieval path versus reading sources
    directly. Unmeasured; the efficiency claim is architectural, not empirical.

DRIFT:
  none

DECISIONS:
  - ADR-0001 — TypeScript canonical; contracts language-neutral
  - ADR-0002 — nodenext module resolution; no bundler in core
  - ADR-0003 — TypeScript pinned 6.0.3 with TYPESCRIPT_7_REVISIT gate
  - ADR-0004 — @lablaunchpad/* namespace
  - ADR-0005 — .context is a compiled cache, never canonical
  - ADR-0006 — persistence interfaces specified now, implemented Phases 4/7

  Smaller calls recorded in docs/agent/DECISIONS.md, including: materialize only
  @lablaunchpad/contracts; prove the boundary checker against synthetic fixtures
  rather than creating speculative packages; report coverage without gating it.

LEARNINGS:
  - L001 — Toolchain compatibility must be checked against the live registry,
    not inferred from release recency.                        status: validated
  - L002 — A dist-only import test does not prove a package is publishable.
    Demonstrated twice by live probes 3 and 4.                status: validated
  - L003 — Machine-written files and the formatter will fight unless the writer
    preserves existing formatting. `context refresh` now patches envelope values
    in place rather than reserializing.                       status: validated

  None promoted to a permanent rule beyond what is already mechanically
  enforced.

NEXT GATE:
  P01 — Research Grounding.
  Entry condition: this receipt reads PASS, all exit criteria met, and CI green
  on the pull request.

  Phase 1 has NOT started. research/ is empty by design.
============================================================
```

## Exit criteria

| #   | Criterion                                        | Result                        |
| --- | ------------------------------------------------ | ----------------------------- |
| 1   | Clean install reproducible with frozen lockfile  | PASS                          |
| 2   | Node 24.19.0 baseline verified                   | PASS                          |
| 3   | TypeScript 6.0.3 pinned and verified             | PASS                          |
| 4   | `tsc` builds all buildable packages              | PASS                          |
| 5   | Lint clean                                       | PASS                          |
| 6   | Format check clean                               | PASS                          |
| 7   | Vitest passes                                    | PASS                          |
| 8   | Modern Vitest `projects` configuration validated | PASS                          |
| 9   | Schema/contract harness passes                   | PASS                          |
| 10  | All 5 validators pass                            | PASS                          |
| 11  | All 5 provably reject negative fixtures          | PASS                          |
| 12  | `.context` operational                           | PASS                          |
| 13  | Staleness detection works                        | PASS                          |
| 14  | Stale required cache causes non-zero exit        | PASS                          |
| 15  | `AGENTS.md` is canonical                         | PASS                          |
| 16  | Adapters do not duplicate canonical architecture | PASS                          |
| 17  | Package dependency direction enforced            | PASS                          |
| 18  | Namespace is `@lablaunchpad/*`                   | PASS                          |
| 19  | dist ESM loads directly under Node               | PASS                          |
| 20  | Exports map works from a clean consumer          | PASS                          |
| 21  | Packed tarball works                             | PASS                          |
| 22  | Declaration files resolve                        | PASS                          |
| 23  | No Agent SDK product logic exists                | PASS                          |
| 24  | CI green                                         | PASS — run #2, commit 8b5ca81 |
| 25  | Phase 0 receipt generated                        | PASS                          |

**STOP after Phase 0.** Do not automatically continue to Phase 1.
