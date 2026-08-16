# Source of truth

Which artifact wins when two disagree.

## Precedence

| Rank | Artifact                      | Status                         | Notes                                                                                     |
| ---- | ----------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------- |
| 1    | `ADR/`                        | **CANONICAL** — decisions      | An accepted ADR is overridden only by a later ADR that supersedes it.                     |
| 2    | `specs/`                      | **CANONICAL** — behaviour      | Defines required and prohibited behaviour.                                                |
| 3    | `tests/`, `packages/**/test/` | **CANONICAL** — verification   | Encode the spec. A test contradicting a spec is a bug in one of them; resolve explicitly. |
| 4    | `packages/`, `adapters/`      | **CANONICAL** — implementation | What the system actually does.                                                            |
| 5    | `benchmarks/` results         | **CANONICAL** — measurement    | Only measurement establishes performance claims.                                          |
| 6    | `golden-cases/`               | **CANONICAL** — regression     | Changes only by reviewed decision.                                                        |
| 7    | `docs/`                       | **CANONICAL** — conventions    | `docs/agent/` state files are working state, not conventions.                             |
| 8    | `research/`                   | DERIVED                        | Informs decisions; never overrides them.                                                  |
| 9    | `.context/`                   | **COMPILED CACHE**             | Never canonical. See below.                                                               |

## `.context/` is never truth

`.context/` is a compiled working cache that exists to make retrieval cheap for
AI agents. It is a projection of the canonical sources above, expressed as
[OKF v0.2](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
concept documents — see [ADR-0007](../../ADR/0007-adopt-okf-v0-2.md).

- Never cite `.context/` as evidence for a material claim.
- Verify against the source file when the claim matters.
- A cache entry disagreeing with its source is **stale by definition** — the
  source is right and the cache must be refreshed.

This is enforced: `context-staleness-validator` recomputes each entry's source
hash (`x_source_sha256`) and fails CI on a stale required entry.

### Trust tiers are a mechanism, not a substitute for the rule above

Every `.context/` entry also carries a **derived** trust tier —
`unverified` / `machine-confirmed` / `human-reviewed` — computed from OKF's
`verified` field (see [ADR-0008](../../ADR/0008-cache-trust-tiers.md)). This
closes a real gap: hash freshness alone proves a source hasn't changed since
compilation, not that the summary was ever accurate. A `human-reviewed` entry
has been checked by a person; an `unverified` one has not.

**The "never cite `.context/` as evidence" rule still applies to every tier,
including `human-reviewed`.** A trust tier tells you how much scrutiny a
summary has received, not that it is now safe to treat as canonical — verify
against the source when a claim is material, regardless of tier.

## Resolving a conflict

1. Identify which artifacts disagree and their ranks.
2. The higher-ranked artifact wins **as the description of intent**.
3. If implementation (rank 4) contradicts spec (rank 2), that is **drift**.
   Report it — do not silently reinterpret the spec to match the code, and do
   not silently rewrite the code without checking whether the spec was wrong.
4. If the spec turns out to be wrong, change it via an ADR, then change the
   code. Never the reverse order, and never only one of the two.

## Duplication

A fact lives in exactly one canonical place. Anything else references it by
path. Duplicated facts drift silently and cost tokens on every read — this is
why `CLAUDE.md`, `OPENCODE.md` and `CODEX.md` may not restate `AGENTS.md`, and
why cache summaries may not inline large source excerpts.
