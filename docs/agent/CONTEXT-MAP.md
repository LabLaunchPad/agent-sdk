# CONTEXT MAP

Where to look for what, and what it costs to look. Use this to decide what
_not_ to read.

## Entry points by question

| Question                     | Read                                                           | Do not read                      |
| ---------------------------- | -------------------------------------------------------------- | -------------------------------- |
| How do I operate here?       | `AGENTS.md`                                                    | The whole `docs/` tree           |
| What am I working on?        | `.context/state/active-task.json`, `docs/agent/NOW.md`         | Git history                      |
| What phase are we in?        | `.context/state/project.json`                                  | The roadmap in the issue tracker |
| Why is it built this way?    | The specific `ADR/NNNN-*.md`                                   | All ADRs                         |
| What must this behave like?  | The governing file in `specs/`                                 | Implementation source            |
| What is the package surface? | `docs/architecture/PACKAGE-MAP.md`                             | Every `package.json`             |
| May A depend on B?           | `docs/architecture/DEPENDENCY-DIRECTION.md`, `boundaries.json` | The import graph                 |
| Which artifact wins?         | `docs/architecture/SOURCE-OF-TRUTH.md`                         | —                                |
| What broke before?           | `docs/agent/FAILURES.md`                                       | CI history                       |
| What is the perf baseline?   | `benchmarks/<family>/baseline.json`                            | Old benchmark runs               |

## Reading order for a new task

```
.context/index.md
  → .context/state/active-task.json
    → governing spec (one file)
      → affected package source (targeted ranges)
        → its tests
          → known failures for that area
```

Stop as soon as you can act. Each additional hop must be justified by evidence
that the previous one was insufficient.

## Cost classes

| Class                 | Examples                                                       | Guidance                     |
| --------------------- | -------------------------------------------------------------- | ---------------------------- |
| Cheap                 | `.context/**` JSON, `NOW.md`, `INDEX.md`                       | Read freely                  |
| Moderate              | A single spec, a single ADR, one package's `src/`              | Read when relevant           |
| Expensive             | Full package trees, all specs, all ADRs, lockfiles             | Requires a specific reason   |
| Prohibited by default | Whole-repository sweeps, full logs, complete benchmark history | Only on explicit instruction |

## Anti-patterns

- Reading the repository "to get oriented" — the index exists for this
- Re-deriving a fact already in `.context/state/`
- Reading implementation to learn intended behaviour; that is what specs are for
- Loading all ADRs to find one decision
