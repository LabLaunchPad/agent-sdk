# Test taxonomy

Vitest is configured with **`projects`** (the model that replaced the removed
`workspace` configuration in Vitest 3.2). Legacy workspace terminology and
`vitest.workspace.*` files are prohibited in this repository.

## Layers

| Layer       | Filename suffix         | Answers                                                                                                     | Active from |
| ----------- | ----------------------- | ----------------------------------------------------------------------------------------------------------- | ----------- |
| Unit        | `*.unit.test.ts`        | Does this function do what it claims in isolation?                                                          | Phase 0     |
| Contract    | `*.contract.test.ts`    | Does this schema/type honour its published contract, including invalid input, versioning and serialization? | Phase 0     |
| Integration | `*.integration.test.ts` | Do these packages compose correctly across a real boundary?                                                 | Phase 3     |
| Adversarial | `*.adversarial.test.ts` | Does this hold up under attack — injection, poisoning, escalation, drift, exhaustion?                       | Phase 3     |
| Portability | `*.portability.test.ts` | Same task, same contract, different runtime or provider — same semantics?                                   | Phase 17    |

Run a single layer with `pnpm test --project <layer>`.

## Phase 0 scope

Only **unit** and **contract** layers are active, plus the validator tests. No
E2E or agent-behaviour tests exist, because no agent exists. Adding them early
would produce tests that assert nothing.

## Rules

1. **Negative fixtures are mandatory.** Every validator and every contract must
   prove it _rejects_ invalid input. A test suite that only exercises the happy
   path is evidence of nothing.
2. **Tests validate production semantics.** They must not run under a different
   module resolution, a different Node version, or against sources that the
   published package would not ship. A test that passes against `src/` while
   the packed tarball fails is a test that conceals the bug it should catch.
3. **A failing test is never disabled to get green.** Skipping, quarantining or
   deleting a failing test is prohibited; root-cause it or record it in
   `docs/agent/FAILURES.md` with an owner.
4. **Determinism.** No wall-clock dependence, no network, no ordering
   assumptions across files. Seed anything random and record the seed.
5. **Flake is a diagnosis, not an excuse.** Re-running is a valid response only
   when the job died before any test body ran. Everything else gets root-caused.

## Coverage

Coverage is measured with `@vitest/coverage-v8` and reported, not gated, in
Phase 0 — there is too little code for a threshold to mean anything. A
threshold is set once Phase 3 lands real contracts, and it is derived from a
measured baseline rather than chosen aspirationally.
