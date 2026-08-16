# packages/

Published `@lablaunchpad/*` packages that make up the Agent SDK.

**Source-of-truth status: CANONICAL** (implementation).

## Rules

- Every package is `@lablaunchpad/*`. No other namespace.
- Packages are created only when a real architectural boundary requires one.
  Roadmap packages live in [`docs/architecture/PACKAGE-MAP.md`](../docs/architecture/PACKAGE-MAP.md)
  until that boundary is proven.
- Dependency direction is enforced by `package-boundary-validator`. See
  [`docs/architecture/DEPENDENCY-DIRECTION.md`](../docs/architecture/DEPENDENCY-DIRECTION.md).
- Packages marked `runtimeNeutral` in `boundaries.json` must not import
  `node:*` builtins or rely on Node-only globals.

## Phase 0 contents

Only `contracts/` exists. It is a placeholder proving the toolchain, not an
implementation of the SDK.
