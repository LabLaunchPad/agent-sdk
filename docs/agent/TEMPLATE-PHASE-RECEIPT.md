# Phase receipt template

Copy this block verbatim and fill it in. Keep entries terse and factual — a
receipt is a record, not a narrative. `UNKNOWN` is a valid value everywhere.

```
============================================================
AGENT SDK PHASE RECEIPT
============================================================
PHASE:
  P<NN> — <name>

STATUS:
  PASS | PARTIAL | FAIL | BLOCKED

OUTCOME:
  <one paragraph: what is now true that was not before>

TOOLCHAIN:
  node:          <exact version as reported by `node -v`>
  pnpm:          <exact>
  typescript:    <exact>
  vitest:        <exact>
  eslint:        <exact>
  <others as pinned>

IMPLEMENTED:
  - <artifact> — <what it does>

SPEC:
  governing:     <paths>
  satisfied:     yes | partial | no
  drift:         none | <description>

FILES CREATED:
  <count> files; notable: <paths>

VALIDATORS:
  schema-contract:      PASS | FAIL
  package-boundary:     PASS | FAIL
  context-staleness:    PASS | FAIL
  package-exports:      PASS | FAIL
  repository-policy:    PASS | FAIL

NEGATIVE FIXTURES:
  <validator> — <fixture> — REJECTED as expected | NOT REJECTED (defect)
  (every validator must appear; "validator runs" is not evidence)

BUILD:
  <command> — <result>

TESTS:
  unit:          <n passed / n total>
  contract:      <n passed / n total>
  integration:   <n passed / n total | n/a>
  adversarial:   <n passed / n total | n/a>
  portability:   <n passed / n total | n/a>

LINT:
  <result, error and warning counts>

FORMAT:
  <format:check result>

EXPORT / PACKAGE SMOKE TEST:
  packed files:  <count, and confirmation no source or dev files included>
  clean install: PASS | FAIL
  import by public name: PASS | FAIL
  exported function executed: PASS | FAIL
  declarations resolve: PASS | FAIL

BENCHMARK:
  baseline:      <values or "none recorded">
  current:       <values>
  delta:         <values or n/a>

RESOURCE:
  tokens:        <if measured>
  latency:       <if measured>
  CPU / memory:  <if measured>

CONTEXT CACHE:
  updated:       yes | no
  entries:       <count by freshness: ACTIVE / STALE / INVALID / NOT_REQUIRED>

CI:
  <workflow> — <green | red | not yet run>

EVIDENCE:
  - <claim> ← <where it is demonstrated>

RISKS:
  - <risk> — <mitigation or "unmitigated">

UNKNOWN:
  - <what was not determined, and what it would take to determine it>

DRIFT:
  none | <implementation vs spec divergence, likely cause, safest correction>

DECISIONS:
  - <ADR id> — <decision>

LEARNINGS:
  - <candidate> — <status: candidate | validated | promoted>
  (nothing is promoted to a permanent rule without validation)

NEXT GATE:
  <phase and its entry condition>
  Phase <N+1> has NOT started.
============================================================
```

## Rules

- Fill every section. Delete none. An empty section reads `none` or `n/a`.
- Never report `PASS` with a failing sub-check.
- Never report a test count you did not run in this phase.
- The receipt is written **after** verification, from its actual output.
