# Package map

The planned package surface and its owning layer. **Declaration here is not
permission to create the package** — see the creation rule below.

## Materialized (Phase 0)

| Package                    | Layer         | Runtime-neutral | Status                                         |
| -------------------------- | ------------- | --------------- | ---------------------------------------------- |
| `@lablaunchpad/contracts`  | 0 · contracts | yes             | Placeholder. Harness only, no agent contracts. |
| `@lablaunchpad/repo-tools` | — · tooling   | no (by design)  | Private. The five validators.                  |

## Planned

Declared so dependency direction can be reasoned about ahead of time. Each is
created only when its boundary is proven.

| Package                       | Layer | Runtime-neutral | Earliest phase |
| ----------------------------- | ----- | --------------- | -------------- |
| `@lablaunchpad/core`          | 1     | yes             | 3              |
| `@lablaunchpad/task`          | 1     | yes             | 3              |
| `@lablaunchpad/state`         | 1     | yes             | 4              |
| `@lablaunchpad/context`       | 1     | yes             | 6              |
| `@lablaunchpad/memory`        | 1     | yes             | 7              |
| `@lablaunchpad/capabilities`  | 1     | yes             | 8              |
| `@lablaunchpad/policy`        | 1     | yes             | 9              |
| `@lablaunchpad/evidence`      | 1     | yes             | 20             |
| `@lablaunchpad/validation`    | 1     | yes             | 20             |
| `@lablaunchpad/agent`         | 2     | yes             | 10             |
| `@lablaunchpad/harness`       | 2     | yes             | 11             |
| `@lablaunchpad/workflow`      | 2     | yes             | 12             |
| `@lablaunchpad/runtime-core`  | 3     | yes             | 17             |
| `@lablaunchpad/observability` | 3     | yes             | 20             |
| `@lablaunchpad/evaluation`    | 3     | no              | 21             |
| `@lablaunchpad/agent-sdk`     | 4     | yes             | umbrella, last |

Adapters live under `adapters/` (models, runtimes, protocols, tools) and are all
layer 4.

### Contract additions bound by ADR (Phase 1B)

Three candidate boundaries surfaced by research (`WorkspaceEngine`,
`SandboxEngine`, `SideEffectEngine`) were resolved as contract additions to
existing planned packages, not new packages — each failed the creation
rule below on its own. `@lablaunchpad/capabilities` carries the Workspace
contract (policy-gated filesystem/command/search/skills, per-tool approval
— [ADR-0012](../../ADR/0012-workspace-sandbox-boundaries.md));
`adapters/tools/sandbox` carries the elaborated Sandbox contract (isolation
mechanism, same ADR); `@lablaunchpad/task`/`@lablaunchpad/state` carry the
`UNKNOWN_OUTCOME` side-effect contract
([ADR-0011](../../ADR/0011-unknown-outcome-side-effect-state.md)). See
`research/reconciliation/BOUNDARY-RECONCILIATION.md` for the full
disposition of every candidate boundary considered.

## Creation rule

Do not create a package because it appears in this table. Create it when one of
these is true, and record which one in the commit message:

1. A real dependency cut exists — something must depend on part of a package
   without depending on the rest.
2. It needs an independent version cadence.
3. Portability requires it — the code is runtime- or vendor-specific and must
   be swappable.

Premature packages cost lockfile churn, cross-package type friction and
navigation overhead for every future agent, and they encode boundaries before
those boundaries are understood.

## Umbrella package

`@lablaunchpad/agent-sdk` is the public entry point most consumers install. It
re-exports curated surfaces from lower layers and adds no logic of its own. It
is created last, once the surfaces it would re-export are stable.
