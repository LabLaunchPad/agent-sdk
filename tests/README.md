# tests/

Cross-package tests and shared fixtures.

**Source-of-truth status: CANONICAL** (verification).

Per-package tests live beside their package. This directory holds tests that
span packages, plus the fixtures the repository validators run against.

Test layers and file-naming conventions:
[`docs/architecture/TEST-TAXONOMY.md`](../docs/architecture/TEST-TAXONOMY.md).

## fixtures/

Positive and **negative** fixtures for the five repository validators. Every
validator must prove it _rejects_ its negative fixture — "the validator ran"
is not evidence.
