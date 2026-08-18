# agent-sdk

Next-generation, local-first AI Agent SDK for efficient, stateful, long-running,
policy-aware and verifiable agents and workflows.

> **Status: Phase 0 — foundation only.** This repository currently contains the
> engineering substrate and its enforcement machinery. **No Agent SDK behaviour
> is implemented yet**, and none should be added ahead of its gate.

## What this is

A standalone SDK, not a platform. `LabLaunchPad/agent-sdk` publishes
`@lablaunchpad/*`; AgencyOS Platform is a separate repository that consumes it.
The SDK must stay usable without it.

## Getting started

```bash
nvm install "$(cat .nvmrc)" && nvm use "$(cat .nvmrc)"   # Node 24.19.0
corepack enable
pnpm install --frozen-lockfile
pnpm verify
```

`pnpm verify` runs build, typecheck, lint, format check, tests, all seven
repository validators and the publication smoke test.

## Working here

Read **[`AGENTS.md`](AGENTS.md)** — the canonical operating contract for humans
and AI coding agents alike. `CLAUDE.md`, `OPENCODE.md` and `CODEX.md` are thin
tool-specific adapters that intentionally repeat nothing from it.

Then start at [`.context/index.md`](.context/index.md) rather than reading the
repository. New here? [`docs/agent/BOOTSTRAP.md`](docs/agent/BOOTSTRAP.md).

## Layout

| Path                  | Contents                                         |
| --------------------- | ------------------------------------------------ |
| `packages/`           | Published `@lablaunchpad/*` packages             |
| `specs/`              | Behaviour specifications — canonical             |
| `ADR/`                | Architecture decisions — canonical               |
| `tests/`              | Cross-package tests and validator fixtures       |
| `benchmarks/`         | Benchmark suites and recorded baselines          |
| `scripts/repo-tools/` | The seven repository validators                  |
| `.context/`           | Compiled AI working cache — **never** canonical  |
| `docs/`               | Agent operating state and repository conventions |

## Toolchain

TypeScript 6.0.3 · Node 24.19.0 LTS · pnpm 10.33.0 · strict ESM (`nodenext`,
plain `tsc`, no bundler) · Vitest 4 · ESLint 10 · JSON Schema as the canonical
wire format, Zod as its TypeScript runtime representation.

TypeScript is pinned below `latest` deliberately —
see [ADR-0003](ADR/0003-typescript-version-pin.md).

## License

Apache-2.0
