# research/

Ecosystem research, extracted patterns and the claims they support.

**Source-of-truth status: DERIVED** — research informs decisions; it does not
override specs or ADRs.

- `frameworks/<name>/` — per-framework research (overview, local-first,
  capabilities, licensing; other dimensions added incrementally)
- `local-first/`, `built-in-capabilities/`, `licensing/` — cross-framework
  matrices
- `contradictions/` — counterexamples to proposed LabLaunchPad claims
- `patterns/`, `claims/`, `decisions/` — reusable architectural patterns,
  sourced claims, adopt/adapt/reject outcomes feeding into ADRs

Every concept file here is an [OKF v0.2](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
document — see [ADR-0007](../ADR/0007-adopt-okf-v0-2.md).

## Coverage status

**Partial.** Research began in Phase 1A Workstream B (gap audit). 9 of the
~17 sources named in the original research brief are live-researched
(evidence level E3/E4); 3 remain fully `UNKNOWN` (Volcengine AgentKit,
Baidu AppBuilder SDK, Agent Skills) — see `local-first/SCORECARD.md`'s
coverage note and `.context/research/gaps.json` for exactly what remains.
An unresearched framework is recorded as `UNKNOWN`, never silently assumed.

Beyond the original brief, 5 supplementary research/governance corpora have
been imported (14 more frameworks, 5 cross-cutting topics, 1 post-commit
operations governance bundle) — real, URL-cited evidence but
`DOCUMENTED_NOT_REPRODUCED` (not independently re-verified this session).
See `imported-corpus/SOURCE-RECEIPT*.md` for provenance on each batch, and
`canonical/index.md` for a cross-corpus consolidation of all of the above,
including contradiction and version-drift detection.
