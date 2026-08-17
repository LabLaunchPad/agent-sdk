# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository status

This repository is at its initial state: the only tracked file is `README.md`. There is no source code, build configuration, dependency manifest, or test suite yet, and therefore no build/lint/test commands to document.

Whoever adds the first real code should replace this section with the actual commands (build, lint, test, run a single test) and an architecture overview.

## Project intent

From `README.md`:

> Next-generation, local-first AI Agent SDK for efficient, stateful, long-running, policy-aware and verifiable agents and workflows.

The named design goals are the load-bearing part of that sentence, and new code should be checked against them:

- **local-first** — the SDK should function without a required remote service; remote components are optional, not assumed.
- **stateful / long-running** — agent state is expected to outlive a single process invocation, so persistence and resumability are core concerns rather than add-ons.
- **policy-aware** — agent actions are expected to be subject to enforceable policy, so permission/policy checks belong on the execution path, not in caller-side conventions.
- **verifiable** — agent runs should produce an auditable record of what happened.

## Architecture

See `docs/architecture/l0-l3-blueprint.md` for the approved product/platform/module blueprint and the deep-dive plans for the first two SDKs to be built: **Kernel** (execution/state/durability substrate) and **Tool Runtime + Security** (governed tool/MCP execution). Everything else in the platform's candidate module list is intentionally deferred until its dependency is stable and its standalone value is evidenced — do not add new top-level packages without checking that document first.

Key decisions already made there (see the doc for full reasoning and confidence levels):
- Language is decided **per component**, not globally. Orchestration/control-plane code in both SDKs is TypeScript/Node. The Tool Runtime's sandbox/isolation boundary is a **wrap-existing** decision (reuse OS/container-level isolation), not a build-a-custom-sandbox decision, and is still EXPERIMENTAL pending a small prototype (Tier 1 subprocess+OS-permissions vs. Tier 2 container/microVM).
- Kernel durability ships as **interim checkpoint/restore** for the MVP (not full event-sourced replay) — see ADR-B for the upgrade path to V1.
- The Graph/State/Context/Event-bus concerns live inside the Kernel SDK as internally namespaced modules, not as separate packages.
- A hosted Control Plane is deferred (Horizon 3+); nothing before that should assume a required remote service, consistent with local-first.

**Horizon 1 (actual Kernel/Tool Runtime code) is gated, not started.** The blueprint's module boundaries, priority-SDK selection, orchestration-layer language choice, MVP durability contract, and Control Plane sequencing are frozen — but the Tool Runtime sandbox substrate (Tier 1 vs Tier 2, which existing isolation runtime to wrap) is still EXPERIMENTAL pending a prototype. Do not create a `packages/` directory or scaffold `packages/kernel` / `packages/tool-runtime` until that row is also frozen (see "Horizon 1 gate" in the blueprint doc) — and even then, confirm with the user first, since package-manager/build/test tooling remain open per the section below.

## Conventions to establish

Beyond the above, package manager, monorepo tooling, build system, linter, and test framework are still unfixed. Before adding those, confirm with the user rather than inferring — the first commit that adds tooling sets that choice for everything after it.
