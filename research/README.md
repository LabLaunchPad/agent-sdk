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

**Partial.** Research began in Phase 1A Workstream B (gap audit) and covers
4 of the ~17 sources named in the research brief so far — see
`local-first/SCORECARD.md`'s coverage note and `.context/research/gaps.json`
for exactly what remains. An unresearched framework is recorded as
`UNKNOWN`, never silently assumed.
