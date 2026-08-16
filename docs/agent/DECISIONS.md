# DECISIONS

Running index of decisions. Architectural decisions get a full ADR; this file
is the index and the home for smaller calls that do not warrant one.

Full records: [`ADR/`](../../ADR/).

## Architectural (ADR-backed)

| ID                                                        | Decision                                                                               | Status   |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------- |
| [0001](../../ADR/0001-typescript-canonical-language.md)   | TypeScript is the canonical implementation; contracts are language-neutral JSON Schema | Accepted |
| [0002](../../ADR/0002-nodenext-module-resolution.md)      | `nodenext` module resolution; no bundler in core                                       | Accepted |
| [0003](../../ADR/0003-typescript-version-pin.md)          | TypeScript pinned to 6.0.3; `TYPESCRIPT_7_REVISIT` gate                                | Accepted |
| [0004](../../ADR/0004-lablaunchpad-namespace.md)          | `@lablaunchpad/*` npm namespace                                                        | Accepted |
| [0005](../../ADR/0005-context-is-compiled-cache.md)       | `.context/` is a compiled cache, never canonical truth                                 | Accepted |
| [0006](../../ADR/0006-persistence-interfaces-deferred.md) | Store interfaces specified in Phase 0, implemented in Phases 4/7                       | Accepted |

## Smaller calls

| Date       | Decision                                                                      | Rationale                                                                  |
| ---------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 2026-08-16 | Only `@lablaunchpad/contracts` materialized in Phase 0                        | Package creation requires a proven boundary; roadmap membership is not one |
| 2026-08-16 | Boundary validator proven against synthetic fixtures, not empty real packages | Avoids creating speculative packages purely to exercise a checker          |
| 2026-08-16 | `repo-tools` built by `tsc` and run from `dist/`                              | Makes the tooling package itself proof that the build emits loadable ESM   |
| 2026-08-16 | Coverage reported, not gated, in Phase 0                                      | A threshold over a placeholder package measures nothing                    |
