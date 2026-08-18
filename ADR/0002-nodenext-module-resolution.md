---
type: Architecture Decision
title: Nodenext Module Resolution
description: nodenext module resolution is required for all packages; no bundler in the SDK core.
generated:
  by: process:claude-code-session
  at: 2026-08-16T00:00:00Z
status: stable
---

# ADR-0002 — `nodenext` module resolution; no bundler in the core

| Field | Value |
| ----- | ----- |
| Phase | P00   |

## Context

The SDK is a published ESM library consumed directly by Node and worker-like
runtimes, built with plain `tsc`.

`moduleResolution: bundler` models an environment where a bundler resolves
specifiers. It permits extensionless relative imports (`./task`), and `tsc` does
not rewrite them. The emitted package then type-checks cleanly and fails at
runtime under Node's ESM loader, which requires explicit extensions on relative
specifiers.

This failure is invisible to unit tests that import from source, and to any test
that runs through a bundler. It surfaces at the consumer.

## Decision

All packages use:

- `"type": "module"`
- `"module": "nodenext"`
- `"moduleResolution": "nodenext"`
- `"verbatimModuleSyntax": true`
- plain `tsc` builds

Relative imports in source carry explicit `.js` extensions.

**No bundler in the core, and no post-processing step that rewrites imports.**
Bundlers are permitted in `examples/` and future UI packages only.

A single module-resolution model applies to production code and tests alike.
Tests must validate production semantics, never a more permissive variant —
otherwise they conceal the defect they exist to catch.

## Adversarial review

**Attack:** requiring `.js` extensions on `.ts` files is unintuitive and will be
forgotten constantly.

**Failure modes:** contributors omit extensions; a dependency ships broken ESM;
a future runtime needs different resolution semantics.

**Falsifying experiment:** drop a `.js` extension and observe whether the
repository catches it. Both the lint rule and the packed-tarball smoke test must
fail. This is negative test 4 of the Phase 0 verification.

## Alternatives considered

| Alternative                                | Why rejected                                                                           |
| ------------------------------------------ | -------------------------------------------------------------------------------------- |
| `moduleResolution: bundler`                | Produces invalid Node ESM; requires a bundler the core must not have                   |
| `bundler` for tests, `nodenext` for builds | Two resolution realities in one repository; code passes tests and fails when published |
| Add a bundler to the core                  | Contradicts the runtime-neutral, dependency-minimal goal                               |

## Consequences

Easier: emitted output runs unmodified under Node and workerd; no build-time
rewriting to reason about.

Harder: authors must write `.js` when importing `.ts`. Enforced mechanically by
`import-x/extensions` and by `package-boundary-validator`, so it is a caught
error rather than a remembered rule.

## Revisit trigger

Reopen if Node's ESM resolution changes such that extensionless relative
specifiers become valid, or if a required runtime cannot load `nodenext` output.

## Evidence

Verified 2026-08-16: `packages/contracts/dist/**` emits `./harness/*.js`
specifiers and loads directly under Node 24.19.0. The lint rule was confirmed to
fire on a deliberately removed extension.
