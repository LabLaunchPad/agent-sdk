# Agent SDK Context Index

> **This index is a compiled cache, not canonical truth.** Verify any material
> claim against the source file, spec or test. See
> [`docs/architecture/SOURCE-OF-TRUTH.md`](../docs/architecture/SOURCE-OF-TRUTH.md).

## Current phase

**P00 — Foundation + Working Toolchain Only**

Phase 0 proves the engineering environment. Phase 1 proves the architecture.
Only Phase 2+ implements it.

## Current objective

Establish the engineering substrate and anti-drift machinery, prove the
red/green loop on a placeholder package, then stop. No Agent SDK product
behaviour.

## Canonical documents

| Purpose                    | Path                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| Operating contract         | [`AGENTS.md`](../AGENTS.md)                                                                 |
| Source-of-truth precedence | [`docs/architecture/SOURCE-OF-TRUTH.md`](../docs/architecture/SOURCE-OF-TRUTH.md)           |
| Dependency direction       | [`docs/architecture/DEPENDENCY-DIRECTION.md`](../docs/architecture/DEPENDENCY-DIRECTION.md) |
| Package map                | [`docs/architecture/PACKAGE-MAP.md`](../docs/architecture/PACKAGE-MAP.md)                   |
| Test taxonomy              | [`docs/architecture/TEST-TAXONOMY.md`](../docs/architecture/TEST-TAXONOMY.md)               |
| Decisions                  | [`ADR/`](../ADR/)                                                                           |

## Current state

| What             | Where                                                    |
| ---------------- | -------------------------------------------------------- |
| Project state    | [`state/project.json`](state/project.json)               |
| Runtime baseline | [`state/runtime.json`](state/runtime.json)               |
| Active task      | [`state/active-task.json`](state/active-task.json)       |
| Last checkpoint  | [`state/checkpoint.json`](state/checkpoint.json)         |
| Active specs     | [`specs/active.json`](specs/active.json)                 |
| Dependency map   | [`specs/dependency-map.json`](specs/dependency-map.json) |

## Active decisions

ADR-0001 TypeScript canonical · ADR-0002 nodenext, no bundler ·
ADR-0003 TypeScript pinned 6.0.3 · ADR-0004 `@lablaunchpad/*` namespace ·
ADR-0005 `.context` is compiled cache · ADR-0006 persistence interfaces deferred.

## Active risks

1. TypeScript 6.0.3 sits below `latest` (7.0.2) because typescript-eslint caps
   at `<6.1.0`. Drift accrues until the `TYPESCRIPT_7_REVISIT` gate opens.
2. Node 24.19.0 is the only admissible baseline; container defaults differ.
3. `.context` decays into a second source of truth if the staleness validator
   ever becomes advisory.

## Known failures

None recorded. See [`docs/agent/FAILURES.md`](../docs/agent/FAILURES.md).

## Current benchmark baseline

None recorded. There is no behaviour to measure until Phase 3.

## Relevant packages

| Package                    | Layer     | Role                              |
| -------------------------- | --------- | --------------------------------- |
| `@lablaunchpad/contracts`  | contracts | Placeholder — schema harness only |
| `@lablaunchpad/repo-tools` | tooling   | The five validators               |

## Recent changes

Phase 0 initial build-out: structure, governance, cache, toolchain, validators,
templates, CI.

## Stale context

None. Verify with `pnpm context:check`.

## Next action

Phase 0 exit criteria met and the receipt is emitted
([`docs/agent/RECEIPT-P00.md`](../docs/agent/RECEIPT-P00.md)). Confirm CI green on
the pull request, then stop. Do not begin Phase 1.

## Rules

Never treat this index as canonical truth. Verify claims against source files,
specs and tests when material. Start here, read the active task and its direct
dependencies, and expand context only when evidence shows it is necessary.
