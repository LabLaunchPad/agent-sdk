# FAILURES

Known failures and their status. A failure is recorded here the moment it is
observed, not once it is fixed.

Never delete an entry. Resolved failures move to Resolved and keep their
regression test reference — the record is what stops the same failure
recurring.

## Open

| ID  | Observed | Failure       | Severity | Status | Regression test |
| --- | -------- | ------------- | -------- | ------ | --------------- |
| —   | —        | none recorded | —        | —      | —               |

## Resolved

| ID  | Observed | Failure       | Root cause | Regression test |
| --- | -------- | ------------- | ---------- | --------------- |
| —   | —        | none recorded | —          | —               |

## Recording rules

1. Record on observation, with the actual error output — not a paraphrase.
2. Every resolved failure carries a regression test. No test, not resolved.
3. "Flaky" is not a root cause. A job that died before any test body ran
   (checkout, dependency install, lost runner) may be re-run and noted as such;
   everything else gets diagnosed.
4. Disabling, skipping or quarantining a test to reach green is prohibited.
