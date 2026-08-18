---
type: Architecture Decision
title: Cache Trust Tiers via Verified
description: Derive unverified/machine-confirmed/human-reviewed trust tiers from OKF verified entries; amends the ADR-0005 residual risk
generated:
  by: process:claude-code-session
  at: 2026-08-16T00:00:00Z
status: stable
---

# ADR-0008 — Cache trust tiers via `verified`

| Field      | Value               |
| ---------- | ------------------- |
| Phase      | P1A                 |
| Supersedes | — (amends ADR-0005) |

## Context

ADR-0005 established `.context/` as a compiled cache and named its own
limitation directly: hash-based freshness proves a source hasn't changed
_since compilation_ — it says nothing about whether the summary was ever
accurate in the first place. The mitigation on record was procedural: "never
cite `.context` as evidence for a material claim." A discipline that must be
remembered on every read is weaker than a mechanism that can be checked.

OKF v0.2's `verified: [{by, at}]` field, adopted in ADR-0007, is that
mechanism.

## Decision

Every `.context/` OKF concept exposes a **derived** trust tier — never
stored, always computed from `verified`:

| Tier                | Condition                                                          |
| ------------------- | ------------------------------------------------------------------ |
| `unverified`        | no `verified` field present                                        |
| `machine-confirmed` | `verified` present, every entry's `by` is a non-human actor        |
| `human-reviewed`    | `verified` present, at least one entry's `by` starts with `human:` |

`context-staleness-validator` computes and reports this tier for every
`.context/` record on every run (`pnpm validate` / `pnpm context:check`).

**`pnpm context:refresh` never writes `verified`.** Refresh is a mechanical
hash update; verification is a judgment call about correctness, and
conflating the two would let a script silently promote its own hash-fix to
"reviewed." Adding a `verified` entry is always a deliberate, separate edit
— by a human (`human:<id>`) or by an explicit review process
(`process:<review-id>`), never by the refresh tool.

At the moment this ADR is accepted, every `.context/` record is
`unverified` — a truthful starting state. `.context/index.md` records this
per-entry so an agent reading the index sees the trust tier before trusting
the content, not after.

## Adversarial review

**Attack:** trust tiers create the appearance of rigor without requiring
anyone to actually verify anything. A repository can carry `unverified`
entries forever, and nothing forces re-verification.

**Failure modes:** entries stay `unverified` indefinitely and the tier
becomes decorative; someone marks something `human-reviewed` without doing a
real review, since nothing checks the reviewer actually read the source;
`machine-confirmed` is treated as equivalent to `human-reviewed` by a reader
who doesn't understand the distinction.

**Falsifying experiment:** track the fraction of required `.context/`
records that remain `unverified` past their `stale_after` date. A
persistently 100% `unverified` cache after several phases means the
mechanism is unused, not that it doesn't exist — worth surfacing in
`docs/agent/NEXT.md` as an operational finding, not a design failure. This
ADR does not claim verification will happen; it claims the mechanism exists
for it to happen, which ADR-0005's discipline-only approach could not offer
at all.

The "did the reviewer actually read the source" problem is real and
unsolved by this decision — OKF gives no cryptographic or process guarantee
of review quality, only a declared actor and timestamp. This is recorded as
an open limitation, not glossed over.

## Alternatives considered

| Alternative                                                                  | Why rejected                                                                                                                                              |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keep ADR-0005's discipline-only mitigation                                   | Already shown insufficient — it's what created the gap this ADR closes                                                                                    |
| Require every `.context/` record to be `human-reviewed` before merge         | Would make the cache prohibitively expensive to maintain at Phase 0/1A scale, for content whose main job is fast agent retrieval, not audited correctness |
| Build a custom verification workflow instead of using OKF's `verified` field | Duplicates a mechanism the adopted spec already provides; see ADR-0007                                                                                    |

## Consequences

Easier: an agent reading `.context/index.md` can see, per entry, whether
anyone has ever checked it — a strictly better starting point than Phase
0's silent assumption that every cache entry deserved equal trust.

Harder: nothing mechanically forces verification to happen. The gap this
closes is "there was no mechanism"; it does not close "nobody used the
mechanism." That remains an operational discipline, tracked in
`docs/agent/NEXT.md`.

## Revisit trigger

If, after several phases, the `unverified` fraction of required
`.context/` records has not decreased, revisit whether verification should
be a phase-receipt requirement rather than optional.

## Evidence

OKF v0.2 SPEC.md, `verified` field and trust-tier derivation, fetched
2026-08-16 — same source as ADR-0007. `context-staleness-validator`'s
`unverified: 4, machine-confirmed: 0, human-reviewed: 0` output on this
repository's own cache immediately after migration is recorded in the
Workstream A sub-receipt as the honest starting measurement.
