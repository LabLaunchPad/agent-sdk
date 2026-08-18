# scripts/

Repository tooling.

**Source-of-truth status: CANONICAL** (enforcement).

`repo-tools/` is the private `@lablaunchpad/repo-tools` package containing the
five mandatory Phase 0 validators. It is written in TypeScript, built with
`tsc`, and executed from `dist/` — which makes it live proof that the build
pipeline emits ESM that Node can actually load.

Tooling is exempt from the runtime-neutrality rule: it targets Node by design
and is never published.
