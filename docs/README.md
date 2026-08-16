# docs/

- `agent/` — operating state for AI coding agents (BOOTSTRAP, STATE, NOW, NEXT,
  DECISIONS, FAILURES, LEARNINGS, CONTEXT-MAP) and the phase receipt template.
- `architecture/` — repository conventions: package map, dependency direction,
  source-of-truth rules, naming, versioning, test and benchmark taxonomies.

**Source-of-truth status: CANONICAL** for conventions; `agent/` state files are
working state, refreshed each phase.

The canonical cross-agent operating contract is [`AGENTS.md`](../AGENTS.md) at
the repository root, not a file in this directory.
