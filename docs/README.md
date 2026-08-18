# docs/

- `agent/` — operating state for AI coding agents (BOOTSTRAP, STATE, NOW, NEXT,
  DECISIONS, FAILURES, LEARNINGS, CONTEXT-MAP) and the phase receipt template.
- `architecture/` — repository conventions: package map, dependency direction,
  source-of-truth rules, naming, versioning, test and benchmark taxonomies.
- `operations/` — imported, **CANDIDATE, not-yet-adopted** operational
  protocol proposals (currently: a post-commit git/PR/CI/deploy lifecycle
  bundle). Not part of the canonical operating contract until an explicit
  ADR adopts some or all of it — see `docs/agent/DECISIONS.md`.

**Source-of-truth status: CANONICAL** for conventions; `agent/` state files are
working state, refreshed each phase; `operations/` is reference material
pending an adoption decision, not canonical.

The canonical cross-agent operating contract is [`AGENTS.md`](../AGENTS.md) at
the repository root, not a file in this directory.
