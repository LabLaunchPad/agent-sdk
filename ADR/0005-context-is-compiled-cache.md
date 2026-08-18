---
type: Architecture Decision
title: Context Is a Compiled Cache
description: .context/ is a compiled AI working cache and never canonical truth.
generated:
  by: process:claude-code-session
  at: 2026-08-16T00:00:00Z
status: stable
---

# ADR-0005 — `.context/` is a compiled cache, never canonical truth

| Field | Value |
| ----- | ----- |
| Phase | P00   |

## Context

Rediscovery is the largest avoidable token cost in an AI-agent-driven codebase.
An agent that re-reads the repository on every task pays for the same
understanding repeatedly, and still risks reading the wrong parts.

A compiled cache fixes the cost problem and introduces a worse one: a second
place where facts live. Documentation that duplicates source drifts, and drifted
documentation is more dangerous than absent documentation, because it is
confidently wrong.

## Decision

`.context/` is a **compiled working cache** optimized for AI retrieval. It is
never canonical truth. Canonical truth lives in `ADR/`, `specs/`, tests,
`packages/`, and recorded benchmark results.

Every cache record carries the envelope:

```json
{
  "source": "<repo-relative path>",
  "version": "<semver>",
  "sha256": "<hash of source at compile time>",
  "generated_at": "<ISO-8601>",
  "freshness": "ACTIVE | STALE | INVALID | NOT_REQUIRED",
  "summary": {}
}
```

Freshness semantics:

| State          | Meaning                          | CI        |
| -------------- | -------------------------------- | --------- |
| `ACTIVE`       | Hash matches the source          | passes    |
| `STALE`        | Source changed since compilation | **fails** |
| `INVALID`      | Malformed, or source missing     | **fails** |
| `NOT_REQUIRED` | Deliberately not maintained      | passes    |

`NOT_REQUIRED` exists so that a genuinely unmaintained entry can stay visible in
the inventory without being quietly deleted or falsely marked fresh.

Enforced by `context-staleness-validator`, which is **mandatory in CI and never
advisory**. `pnpm context:refresh` rewrites hashes and never runs in CI —
auto-refreshing would make the check unfalsifiable by rubber-stamping whatever
drift had accumulated.

Summaries record structured facts, not prose, and never inline large source
excerpts.

## Adversarial review

**Attack:** agents will read the summary and act on it without verifying, so a
subtly wrong-but-fresh summary is more dangerous than no summary. Hash freshness
proves the source has not changed since compilation — it does not prove the
summary was ever correct.

**Failure modes:** a summary is wrong at compile time and stays `ACTIVE`
forever; `NOT_REQUIRED` is used to silence inconvenient staleness; refresh is
run reflexively to clear a failure without re-reading the source.

**Falsifying experiment:** edit a source file without refreshing and confirm CI
fails; confirm a `NOT_REQUIRED` entry does not. Both are Phase 0 negative test 3.

The residual risk — a fresh but incorrect summary — is mitigated only by the
source-of-truth rule: never cite `.context/` as evidence for a material claim.
That is a discipline, not a mechanism, and it is stated as such.

## Consequences

Easier: cheap navigation; drift is detected rather than discovered.

Harder: cache maintenance is real work at every phase boundary. That cost is the
point — an unmaintained cache is the failure mode being prevented.

## Revisit trigger

Evidence that agents act on stale or wrong cache despite the validator, or that
maintenance cost exceeds the retrieval saving.
