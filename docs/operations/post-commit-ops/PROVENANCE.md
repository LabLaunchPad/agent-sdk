---
type: Provenance Record
title: Post-Commit Ops Bundle Provenance
description: Integrity verification, applied fixes, and adoption status for the imported post-commit operations bundle
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
---

# Provenance: `docs/operations/post-commit-ops/`

## Source

User-supplied ZIP,
`LabLaunchPadAIAgentNativePostCommitOperationsOKF20260817.zip`, 28 files
under `lablaunchpad-agent-native-post-commit-ops/`.

## Integrity verification (performed this session)

- Outer ZIP SHA-256 matched the hash the user provided
  (`078f5910...661fd0e`) before extraction.
- Every per-file SHA-256 in the bundle's own `MANIFEST.json` was
  recomputed and matched against the extracted files before any edit was
  made — confirmed the delivered content was not corrupted or tampered
  with in transit.
- `MANIFEST.json`'s hashes now describe the **original, unmodified**
  bundle — they will not match the copies below after the one fix
  described next. This is expected and intentional, not a integrity
  failure; `MANIFEST.json` is kept as-is (not regenerated) precisely so
  it remains a faithful record of what was actually delivered and
  verified.

## Fix applied

Every non-reserved markdown file in the source bundle used
`verified: documented` in its YAML frontmatter. This repository's own
`okf-conformance` validator (`scripts/repo-tools/src/validators/okf-conformance.ts`)
requires the `verified` field, when present, to be a mapping or list of
mappings with `by`/`at` — a bare string fails as `okf/invalid-verified`.
`docs/` is not currently in `okf.json`'s validated `scopes`, so this
would not have failed CI as delivered, but the field was renamed to
`x_verification_state: documented` across all 24 affected files anyway,
for consistency with the rest of this repository's OKF-conformant
knowledge and in case `docs/` is ever added to the validated scopes.
No other content was altered.

## Adoption status — CANDIDATE, not adopted

This bundle is a **proposed** post-commit operating protocol (lifecycle
state machine, merge/release gates, AI code-review protocol, CI
failure/verification runbooks, security gates, no-bypass policy,
evidence ledger, recovery protocols, agent instructions, templates, and
machine-readable contracts). It is stored here for reference and future
evaluation. It has **not** been wired into `AGENTS.md` (this
repository's canonical operating contract), CI, or any enforcement
mechanism — per this repository's own rule against silently replacing an
architectural or governance decision. Adopting any part of it requires an
explicit decision, recorded as an ADR, not a silent merge of this bundle
into the canonical contract. See
`.context/research/decisions.json`'s `post-commit-ops-bundle-*` entries
for the tracked candidate status.

## Sources cited by the bundle itself

See `references/sources.md` in this directory — primarily official
GitHub documentation (rulesets, required checks, merge queues,
deployments/environments, Actions security hardening) and Google's
published code-review guidance, plus the OKF v0.2 spec and the
`AGENTS.md` ecosystem reference. This session did not independently
re-verify those citations.
