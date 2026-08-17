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

## Conventions to establish

Nothing in the repo fixes a language, package manager, or layout yet. Before starting a substantial change, confirm with the user which stack the SDK targets rather than inferring one — the first commit that adds tooling sets that choice for everything after it.
