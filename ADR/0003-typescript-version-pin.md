# ADR-0003 — Pin TypeScript to 6.0.3; gate the TypeScript 7 upgrade

| Field  | Value      |
| ------ | ---------- |
| Status | Accepted   |
| Date   | 2026-08-16 |
| Phase  | P00        |

## Context

`typescript@latest` is **7.0.2** (published 2026-07-08). The obvious choice for
a greenfield repository is the latest stable compiler.

It is not available to us. Querying the registry on 2026-08-16:

| Package                             | Declared peer range for `typescript` |
| ----------------------------------- | ------------------------------------ |
| `typescript-eslint@8.65.0`          | `>=4.8.4 <6.1.0`                     |
| `typescript-eslint@8.66.0`          | `>=4.8.4 <6.1.0`                     |
| `typescript-eslint@8.67.0` (latest) | `>=4.8.4 <6.1.0`                     |

The range is identical across all three; the most recent release has not
widened it. TypeScript 7 is outside it, and the 8.65.0 release added a warning
when TS 7 is detected rather than support for it.

This repository requires type-aware linting: `strictTypeChecked` rules are what
catch the unsafe-`any` and unnecessary-condition classes that a placeholder
package would otherwise hide. Losing type-aware lint to gain a newer compiler is
a bad trade at Phase 0, when the lint configuration is one of the few things
actually being proven.

TypeScript 6.0.3 is the newest stable release inside the supported range.
(6.0.2 and 6.0.3 are the only stable 6.x releases; 6.0.0 shipped as beta only.)

## Decision

Pin `typescript` to **exactly `6.0.3`**. Pin `typescript-eslint` to **8.67.0** —
the same peer gate as 8.65.x, with newer fixes.

**Do not use dependency overrides, resolutions, or peer-dependency suppression
to force TypeScript 7.** Silencing the constraint does not make type-aware
linting work; it makes its failure silent.

Record the exact resolved versions in every phase receipt. A green run on an
unpinned toolchain is not evidence.

## `TYPESCRIPT_7_REVISIT` gate

Upgrade only when **all** of the following hold:

1. `typescript-eslint` officially supports the target TypeScript 7 version — its
   declared peer range admits it, not merely "it seems to work".
2. `pnpm lint` passes with type-aware rules enabled.
3. `pnpm build` passes for every package.
4. Contract tests pass.
5. The package publication smoke test passes.
6. CI passes on the pinned Node baseline.

Partial satisfaction is not satisfaction. Check the gate by re-querying the
registry, not from memory.

## Adversarial review

**Attack:** pinning a major version below `latest` accrues drift. Every month on
6.0.3 makes the eventual TS 7 migration larger, and TS 7 is a compiler rewrite —
the migration may be substantial regardless.

**Failure modes:** the gate is never checked and the pin silently becomes
permanent; a security fix lands only in TS 7; the 6.x line reaches end of life;
`typescript-eslint` never widens its range, forcing a choice between the
compiler and type-aware linting.

**Falsifying experiment:** re-query `npm view typescript-eslint@latest
peerDependencies` at each phase boundary. If the range admits TS 7, run the gate
checklist. If it still does not after several phases, that itself is evidence
worth acting on — reassess whether type-aware linting is worth the pin.

## Alternatives considered

| Alternative                               | Why rejected                                                                                                           |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| TypeScript 7.0.2 with overrides           | Forces an unsupported combination; type-aware linting breaks or misbehaves silently, which is worse than not having it |
| TypeScript 7.0.2, drop type-aware linting | Surrenders the rule classes that make a strict TypeScript repository worth the strictness                              |
| TypeScript 5.x                            | Strictly worse than 6.0.3 with no compensating benefit                                                                 |

## Consequences

Easier: the toolchain is internally consistent, and every tool supports every
other tool.

Harder: the repository sits one major behind the compiler. Accepted knowingly,
with a written trigger, rather than discovered later as unexplained staleness.

## Revisit trigger

Any change to `typescript-eslint`'s declared `typescript` peer range. Checked at
each phase boundary.

## Evidence

npm registry queries, 2026-08-16:

- `npm view typescript dist-tags` → `latest: 7.0.2`, `beta: 6.0.0-beta`
- stable 6.x/7.x releases → `6.0.2`, `6.0.3`, `7.0.2`
- `npm view typescript-eslint@{8.65.0,8.66.0,8.67.0} peerDependencies` →
  `typescript: ">=4.8.4 <6.1.0"` in all three

Recorded in `.context/evidence/toolchain-pin.json`.
