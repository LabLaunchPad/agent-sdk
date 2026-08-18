# Dependency direction

Enforced by `package-boundary-validator` against [`boundaries.json`](../../boundaries.json).

## Layers

Dependencies point **outward only**. A package may depend on packages in a
lower-numbered layer, and never on a higher-numbered one.

| Layer | Name          | Contents                                                                                     |
| ----- | ------------- | -------------------------------------------------------------------------------------------- |
| 0     | `contracts`   | Schemas, wire formats, versioning. Depends on nothing internal.                              |
| 1     | `core`        | Task, identity, state, intention, awareness, context, memory, capability, policy primitives. |
| 2     | `composition` | Agent, harness, workflow, planner, fast-path.                                                |
| 3     | `runtime`     | Runtime cores and execution surfaces.                                                        |
| 4     | `adapters`    | Model providers, runtimes, protocols (MCP/A2A/Skills), tools (browser/sandbox).              |
| —     | `tooling`     | Repository tooling. Not published, exempt from runtime neutrality.                           |

```
contracts → core → composition → agent/harness/workflow → runtime → adapters
```

## Hard rules

1. **No inward dependencies.** Layer _n_ must not import layer _n+1_ or higher.
2. **No cycles.** Not between packages, and not between layers.
3. **Core is vendor-free.** No package below layer 4 may depend on a model
   vendor SDK, cloud SDK, runtime-specific implementation, or AgencyOS Platform.
4. **Runtime neutrality.** Packages flagged `runtimeNeutral: true` must not
   import `node:*` builtins or rely on Node-only globals (`process`,
   `__dirname`, `Buffer`, `require`). Use web-standard APIs — `AbortSignal`,
   `Request`/`Response`, `URL`, `ReadableStream`, `crypto.subtle`,
   `structuredClone` — and put runtime-specific behaviour behind an adapter.

## Why this direction

A provider must never be able to define canonical state. If `core` could import
an adapter, one vendor's model of a task would silently become _the_ model of a
task, and provider portability would be lost at the type level before anyone
noticed at the behaviour level.

## Adding a package

A new package requires a proven boundary: an independent version cadence, a
genuine dependency cut, or a portability requirement. Roadmap entries in
[`PACKAGE-MAP.md`](PACKAGE-MAP.md) are not sufficient reason on their own.

Register it in `boundaries.json` with its layer and `runtimeNeutral` flag in the
same commit that creates it, or the validator will reject the package as
unregistered.
