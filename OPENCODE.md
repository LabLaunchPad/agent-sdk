# OPENCODE.md — OpenCode adapter

**Read [`AGENTS.md`](AGENTS.md) first. It is the canonical contract.**
This file adds OpenCode invocation notes only and deliberately repeats
nothing from it.

## Session start

1. Open `.context/index.md`, then `.context/state/active-task.json`.
2. Confirm the gate you are on before touching any file.
3. Use the Node baseline (`.nvmrc`) — a green run on another Node is not proof.

## Tool notes

- Load files on demand; do not pre-load the workspace into the session.
- Keep edits scoped to one package per change set so boundary checks stay
  interpretable.
- When a run spans multiple gates, stop at the gate boundary and emit the
  receipt rather than continuing.

## Verification

Run `pnpm verify` before claiming anything works. Report failing output
verbatim.

## Escalation

Surface material ambiguity to the human operator instead of resolving it by
assumption.
