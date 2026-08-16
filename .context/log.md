# Log

Flat, newest-first history of durable changes to the compiled cache. OKF
reserved file — see [SPEC.md §Log Files](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md).

## 2026-08-16

- **Migration**: `.context/` migrated from bespoke JSON envelopes to OKF v0.2
  markdown concepts. `sha256`/`generated_at`/`freshness` (stored) replaced by
  `x_source_sha256`/`generated.at`/derived freshness. `.context/state/*.json`
  and `.context/specs/active.json` intentionally kept as plain JSON — they are
  runtime state and navigational pointers, not knowledge concepts, and OKF
  conformance governs `.md` files only. See [ADR-0007](../ADR/0007-adopt-okf-v0-2.md).
- **Creation**: Phase 0 foundation. `.context/` cache established with four
  cache records (JSON envelope, four-state freshness). See
  [`docs/agent/RECEIPT-P00.md`](../docs/agent/RECEIPT-P00.md).
