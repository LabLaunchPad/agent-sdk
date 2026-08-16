# AGENTS.md — Canonical Operating Contract

This is the **single canonical operating contract** for every AI coding agent
working in this repository: Claude Code, OpenCode, Codex, or any other.

`CLAUDE.md`, `OPENCODE.md` and `CODEX.md` are **thin adapters**. They carry
tool-specific invocation notes only. They must never duplicate anything in this
file — the `repository-policy-validator` enforces that mechanically.

---

## Mission

Build a standalone, next-generation AI Agent SDK that is efficiency-first,
token-efficient, resource-efficient, local-first, model-agnostic,
runtime-agnostic, provider-agnostic, long-running-task capable, state-aware,
context-efficient, memory-safe, policy-aware, evidence-backed, test-driven,
specification-driven, maintainable by humans and AI coding agents alike, and
portable across models, runtimes and deployment environments.

**Primary KPI:** verified outcome / total AI + compute + tool + human cost.

## Product boundary

This repository is **the standalone Agent SDK**. It must not become the
AgencyOS SaaS platform. AgencyOS Platform is a separate repository that will
consume `@lablaunchpad/*` as a dependency.

Do not add organizations, billing, SaaS administration, employee marketplace,
business dashboards, client tenancy, or vertical-specific business logic
unless an explicit specification requires it.

```
LabLaunchPad/agent-sdk          →  publishes @lablaunchpad/*
LabLaunchPad/agencyos-platform  →  consumes  @lablaunchpad/*
```

## Phase discipline

Work proceeds one gated phase at a time. Never skip a phase, never silently
merge phases, never implement a future phase's features early.

Current phase and objective live in [`.context/index.md`](.context/index.md).

Each phase runs this loop:

```
READ LOCAL CACHE → CHECK CURRENT STATE → READ ONLY RELEVANT SPEC → PLAN
→ RED TEAM → IMPLEMENT → TEST → BENCHMARK → RECONCILE → UPDATE CACHE
→ CHECKPOINT
```

A phase ends with a receipt in the format of
[`docs/agent/TEMPLATE-PHASE-RECEIPT.md`](docs/agent/TEMPLATE-PHASE-RECEIPT.md).
Proceed to the next phase only when the current phase's exit criteria pass.

## Efficiency principle

Always use the least expensive mechanism that satisfies the acceptance
criteria:

```
deterministic function → compiled workflow → local model → normal model
→ frontier model → multi-agent → human
```

Do not invoke an LLM when deterministic execution suffices. Do not invoke a
frontier model when a cheaper model suffices. Do not invoke a multi-agent
workflow when one agent suffices.

**Never optimize tokens at the expense of correctness.** A lower token count
with a missing critical fact is a failure, not a saving.

## Evidence principle

Never claim _verified_, _correct_, _compatible_, _stable_, _secure_ or
_portable_ without evidence. **UNKNOWN is a valid state** and is always
preferable to an unsupported claim.

A passing unit test is not sufficient evidence of completion. Work is complete
only when: the spec is satisfied, behaviour is verified, failure behaviour is
verified, adversarial cases are verified, benchmarks are acceptable, evidence
is recorded, regression coverage is added, and documentation is updated.

Compilation is not completion.

## Adversarial principle

For every important architectural decision: propose → attack the proposal →
identify failure modes → define falsifying experiments → implement → benchmark
→ reconcile → record the decision.

No blind implementation.

## Drift prevention

Before every task, read
[`.context/index.md`](.context/index.md) and
[`.context/state/active-task.json`](.context/state/active-task.json), inspect
actual repository state, then identify the governing spec, relevant ADRs, known
failures, required tests and the current benchmark baseline.

Before changing architecture, find the existing implementation, contract, tests
and previous decisions. Do not duplicate functionality that already exists.

After every task, run targeted tests, contract tests and adversarial tests;
benchmark changed behaviour; inspect the diff; update state, evidence and
learning candidates; refresh the `.context` cache; write a concise receipt.

When implementation conflicts with specification, **do not silently reinterpret
the specification.** Report the drift, its likely cause, the safest correction,
affected tests and migration impact.

### Never

- Silently broaden scope
- Invent requirements
- Create duplicate abstractions
- Rewrite working code without evidence
- Claim completion from compilation alone
- Add dependencies without justification
- Create provider-specific kernel concepts
- Hard-code one runtime into canonical state
- Promote unverified learning into permanent rules

## Context cache rules

`.context/` is a **compiled AI working cache**, never canonical truth.
Canonical truth lives in `specs/`, `packages/`, `tests/`, `ADR/` and recorded
benchmark results. `.context/` knowledge concepts are
[OKF v0.2](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
documents — see [ADR-0007](ADR/0007-adopt-okf-v0-2.md).

| Rule    | Statement                                                                    |
| ------- | ---------------------------------------------------------------------------- |
| **C1**  | Never read the entire repository unless explicitly required.                 |
| **C2**  | Start from `.context/index.md`.                                              |
| **C3**  | Read the active task and its direct dependencies first.                      |
| **C4**  | Expand context only when evidence shows it is necessary.                     |
| **C5**  | Never use stale cache as canonical truth.                                    |
| **C6**  | Every cache entry carries `sources[]`, `generated.at` and `x_source_sha256`. |
| **C7**  | When a source changes, invalidate the affected cache entries.                |
| **C8**  | After completing work, update the cache.                                     |
| **C9**  | Never copy large source files into summaries.                                |
| **C10** | Prefer structured facts over prose.                                          |

Freshness (`ACTIVE`, `STALE`, `INVALID`, `NOT_REQUIRED`) is **derived** from
the hash and `stale_after`, never stored. A stale _required_ entry fails CI.
Refreshing hashes is an explicit command (`pnpm context:refresh`) and never
runs in CI — it never writes `verified`, since refreshing a hash is
mechanical and marking something reviewed is not (see
[ADR-0008](ADR/0008-cache-trust-tiers.md)).

Every entry also carries a derived trust tier — `unverified`,
`machine-confirmed`, or `human-reviewed` — from OKF's `verified` field. A
higher tier means more scrutiny, not permission to skip verification: the
"never cite `.context/` as evidence for a material claim" rule in
[`docs/architecture/SOURCE-OF-TRUTH.md`](docs/architecture/SOURCE-OF-TRUTH.md)
applies at every tier.

## Token efficiency rules

1. Don't rediscover.
2. Don't reload irrelevant context.
3. Don't use LLMs for deterministic work.
4. Don't repeatedly explain architecture.
5. Don't store giant transcripts as memory.
6. Don't pass all tools.
7. Don't replan without a trigger.
8. Don't validate with expensive models when deterministic validation suffices.
9. Don't repeat failed approaches without new evidence.
10. Don't preserve stale cache.
11. Don't make the model infer current state.
12. Don't use a model to answer a question already answered by state or evidence.

Before reading a large file, determine whether a smaller range suffices. Before
asking a model, check deterministic state and cache first. Before calling a
tool, check whether `.context` already holds the answer.

## Repository invariants

These are enforced mechanically by `pnpm validate`:

- **Namespace** — every package is `@lablaunchpad/*`.
- **Dependency direction** — dependencies point outward only:
  `contracts → core → features → agent/harness/workflow → runtime/adapters`.
  No circular dependencies. Core never imports providers, cloud SDKs, model
  vendors, runtime-specific implementations, or AgencyOS Platform.
- **Runtime neutrality** — packages marked `runtimeNeutral` must not import
  `node:*` builtins or depend on Node-only globals. Runtime-specific behaviour
  belongs behind adapters.
- **Module system** — `type: module`, `module`/`moduleResolution: nodenext`,
  built with plain `tsc`. Relative imports carry explicit `.js` extensions. No
  bundler in the core, and no post-processing step to rewrite imports.
- **Publication** — a package is correct only when its packed tarball installs
  into a clean consumer and imports by public package name.

## Stop conditions

Stop and report rather than guessing when:

- Requirements are materially ambiguous
- An architecture contradiction appears
- A security boundary is unclear
- Acceptance criteria are missing
- A state migration is unsafe
- A benchmark regression exceeds the allowed threshold
- Provider behaviour violates a canonical contract
- The work would create an irreversible dependency

Report the ambiguity, the affected decision, the safest assumption and the
information needed. Otherwise, proceed with the smallest reversible
implementation.
