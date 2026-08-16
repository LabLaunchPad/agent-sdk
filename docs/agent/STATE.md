# STATE

Durable working state across phases. Refreshed at every phase boundary.

Structured equivalent: [`.context/state/`](../../.context/state/).
When this file and the JSON disagree, the JSON is the machine-readable record
and this file is the human summary — reconcile both before proceeding.

## Repository

| Field                 | Value                                |
| --------------------- | ------------------------------------ |
| Repository            | `LabLaunchPad/agent-sdk`             |
| npm namespace         | `@lablaunchpad/*`                    |
| Current phase         | P00 — Foundation + Working Toolchain |
| Phase status          | PASS — receipt emitted, awaiting CI  |
| Canonical language    | TypeScript                           |
| Canonical wire format | JSON Schema                          |

## Toolchain baseline

| Component         | Pin                          |
| ----------------- | ---------------------------- |
| Node              | 24.19.0 (LTS Krypton)        |
| pnpm              | 10.33.0                      |
| TypeScript        | 6.0.3 (exact — see ADR-0003) |
| Vitest            | 4.1.10                       |
| ESLint            | 10.8.1                       |
| typescript-eslint | 8.67.0                       |
| Prettier          | 3.9.6                        |
| Zod               | 4.4.3                        |
| Ajv               | 8.20.0                       |
| Changesets        | 3.0.0                        |

## Materialized packages

| Package                    | Purpose                                               |
| -------------------------- | ----------------------------------------------------- |
| `@lablaunchpad/contracts`  | Placeholder. Schema harness only, no agent contracts. |
| `@lablaunchpad/repo-tools` | Private. The five repository validators.              |

## Open commitments

- Phase 0 exit criteria must all pass before Phase 1 may begin.
- `TYPESCRIPT_7_REVISIT` gate is open — see ADR-0003.
- workerd portability proof deferred to Phase 17 — see [`NEXT.md`](NEXT.md).
