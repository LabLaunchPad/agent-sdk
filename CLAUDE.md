# CLAUDE.md — Claude Code adapter

**Read [`AGENTS.md`](AGENTS.md) first. It is the canonical contract.**
This file adds Claude Code invocation notes only and deliberately repeats
nothing from it.

## Session start

1. Open `.context/INDEX.md`, then `.context/state/active-task.json`.
2. Confirm the gate you are on before touching any file.
3. Use the Node baseline (`.nvmrc`) — a green run on another Node is not proof.

## Tool notes

- Prefer `Grep`/`Glob` over shelling out to `grep`/`find`; results are linkable.
- Batch independent reads into one message rather than serial calls.
- Use `Read` with `offset`/`limit` on large files; whole-file reads defeat the
  cache rules in the canonical contract.
- Reach for `Task`/`TaskUpdate` on any multi-step gate so progress is visible.

## Verification

Run `pnpm verify` before claiming anything works. When a check fails, paste the
failing output rather than paraphrasing it.

## Escalation

If a gate's requirements are unclear, use `AskUserQuestion` rather than picking
an interpretation and proceeding silently.
