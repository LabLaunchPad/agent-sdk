# Bootstrap

What an AI coding agent does in its first five minutes in this repository.

## 1. Establish the toolchain baseline

```bash
nvm install "$(cat .nvmrc)" && nvm use "$(cat .nvmrc)"
corepack enable && corepack prepare pnpm@10.33.0 --activate
node -v && pnpm -v          # must read v24.19.0 and 10.33.0
pnpm install --frozen-lockfile
```

A green run on a different Node version is not evidence. Check `node -v` before
trusting any result.

> This container's default `node` is 22.x on `PATH` ahead of nvm. Prefix
> commands with `export PATH="$HOME/.nvm/versions/node/v24.19.0/bin:$PATH"` or
> re-run `nvm use` in each shell.

## 2. Read the contract, then the state

In this order, and stop when you have enough:

1. [`AGENTS.md`](../../AGENTS.md) — the canonical operating contract
2. [`.context/INDEX.md`](../../.context/INDEX.md) — navigation layer
3. [`.context/state/active-task.json`](../../.context/state/active-task.json) — what is actually in flight
4. [`NOW.md`](NOW.md) — current gate, in prose
5. The governing spec for your task, and only that spec

Do not read the whole repository. Do not read packages your task does not
touch. The cache rules in the canonical contract exist because rediscovery is
the single largest avoidable token cost in this project.

## 3. Confirm the gate

Check the current phase in `.context/state/project.json`. Confirm your task
belongs to that phase. If it belongs to a later phase, stop — implementing
ahead of the gate is prohibited regardless of how small the change looks.

## 4. Verify before you claim

```bash
pnpm verify
```

This runs build, typecheck, lint, format check, tests, all five validators and
the publication smoke test. Anything you assert about the repository working
must be backed by its output, quoted rather than paraphrased.

## 5. Close the loop

Before ending a phase:

- Refresh the cache: `pnpm context:refresh`, then `pnpm validate` to confirm
- Update [`STATE.md`](STATE.md), [`NOW.md`](NOW.md), [`NEXT.md`](NEXT.md)
- Record new decisions in [`DECISIONS.md`](DECISIONS.md) and, if architectural,
  an ADR
- Record anything that broke in [`FAILURES.md`](FAILURES.md)
- Emit the receipt using [`TEMPLATE-PHASE-RECEIPT.md`](TEMPLATE-PHASE-RECEIPT.md)

## Common mistakes

| Mistake                                             | Consequence                                          |
| --------------------------------------------------- | ---------------------------------------------------- |
| Running on Node 22 because it was on `PATH`         | Every result is inadmissible                         |
| Reading the repository to "get oriented"            | Burns the context budget the cache exists to protect |
| Treating `.context/` as truth                       | Acts on stale facts; see the source-of-truth rules   |
| Claiming green from a passing build                 | Compilation is not completion                        |
| Starting the next phase because this one looks done | Skips the exit criteria that define "done"           |
