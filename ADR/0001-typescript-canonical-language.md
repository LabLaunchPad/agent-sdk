# ADR-0001 — TypeScript is the canonical implementation; contracts are language-neutral

| Field  | Value      |
| ------ | ---------- |
| Status | Accepted   |
| Date   | 2026-08-16 |
| Phase  | P00        |

## Context

The SDK must reach an unusually wide runtime surface: local desktop, browser,
Node, edge/worker runtimes, MCP, A2A, CLI tooling and the JS application
ecosystem. The dominant question is not "which language is best for AI" — the
core problem here is agent runtime, state, workflow, protocol and tooling, not
machine learning.

Python is strategically important to the broader AI ecosystem, but making it a
co-equal core would double API maintenance, the test matrix, the release
process, documentation, the bug surface, the compatibility burden and the
context an AI coding agent must hold — while the architecture is still being
discovered.

## Decision

TypeScript is the **canonical implementation** language.

JSON Schema is the **canonical contract**. TypeScript (via Zod) is one runtime
representation of that contract, never its definition.

```
        LANGUAGE-NEUTRAL CONTRACTS (JSON Schema / wire format)
                              │
        ┌─────────────────────┼─────────────────────┐
   TypeScript              Python                  Go
   canonical               future                  future
```

Additional languages arrive later as **bindings validated against the same
contracts and conformance suite** — never as parallel implementations of the
architecture.

## Adversarial review

**Attack:** Python has the stronger AI ecosystem; choosing TypeScript cuts the
SDK off from the community most likely to adopt it.

**Failure modes:** adoption stalls among Python-first teams; a capability
emerges that is materially better in Python; a target runtime cannot be reached
from TypeScript at all.

**Falsifying experiment:** track adoption and capability requests by language.
If Python-native capabilities measurably outperform, or a required runtime is
unreachable, the binding strategy activates earlier than planned.

## Alternatives considered

| Alternative                        | Why rejected                                                                                               |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Python canonical                   | Weaker story for edge, browser and worker runtimes, which are core requirements                            |
| TypeScript + Python co-equal cores | Doubles every maintenance axis while the architecture is still unsettled                                   |
| Polyglot from day one              | Raises the maintenance ceiling, not the capability ceiling, at the exact moment the design is least stable |

## Consequences

Easier: one language across the full deployment surface; a single test matrix;
lower context cost per agent task.

Harder: Python users wait for a binding. Mitigated by keeping contracts
language-neutral from the first commit, so a binding is a port of the contract
rather than a fork of the architecture.

Foreclosed: nothing permanently. The contract-first structure is what keeps the
door open.

## Revisit trigger

Reopen when any of the following is observed: Python users are a demonstrated
adoption segment; Python-native capabilities materially outperform; a vertical
requires Python ecosystem tooling; or a required runtime cannot practically be
exposed through TypeScript.

Go or Rust components are considered **only after profiling identifies a hot
path**, never for anticipated scalability.

## Evidence

Registry and ecosystem review, 2026-08-16. Runtime-surface requirements are
recorded in `docs/architecture/DEPENDENCY-DIRECTION.md`.
