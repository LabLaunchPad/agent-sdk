# CODEX.md — Codex adapter

**Read [`AGENTS.md`](AGENTS.md) first. It is the canonical contract.**
This file adds Codex invocation notes only and deliberately repeats
nothing from it.

## Session start

1. Open `.context/INDEX.md`, then `.context/state/active-task.json`.
2. Confirm the gate you are on before touching any file.
3. Use the Node baseline (`.nvmrc`) — a green run on another Node is not proof.

## Tool notes

- Work from the compiled cache index rather than crawling directories.
- Apply one coherent change set at a time; avoid interleaving unrelated edits.
- Emitted diffs must be reviewed against the governing specification before
  they are proposed.

## Verification

Run `pnpm verify` before claiming anything works. Report failing output
verbatim.

## Escalation

Stop and ask when requirements are materially unclear; do not infer intent from
surrounding code alone.
