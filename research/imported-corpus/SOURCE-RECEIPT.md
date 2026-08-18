---
type: Research Receipt
title: Expanded Agent SDK Research Receipt (Imported Corpus)
description: Original receipt for the user-supplied 5-framework research pass (OpenHands, Letta, Google ADK, Browser Use, CrewAI), imported verbatim as provenance documentation
sources:
  - resource: /research/frameworks/openhands/overview.md
    id: openhands
  - resource: /research/frameworks/letta/overview.md
    id: letta
  - resource: /research/frameworks/google-adk/overview.md
    id: google-adk
  - resource: /research/frameworks/browser-use/overview.md
    id: browser-use
  - resource: /research/frameworks/crewai/overview.md
    id: crewai
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: this receipt was authored in a prior, external research pass and is imported verbatim below (unmodified except for this frontmatter block) as the provenance record for research/frameworks/{openhands,letta,google-adk,browser-use,crewai}/ and research/comparison/
---

# LabLaunchPad — Expanded Agent SDK Reverse-Engineering Research Receipt

**STATUS:** Research pass complete for five additional ecosystems. No production implementation and no architecture rewrite.

## 5 additional sources audited

1. OpenHands Software Agent SDK
2. Letta Agent SDK / Letta
3. Google Agent Development Kit (ADK)
4. Browser Use
5. CrewAI

## Most important patterns

- **Workspace/Sandbox contracts:** OpenHands makes workspace/runtime boundaries explicit; this should become a LabLaunchPad-neutral contract.
- **Durable state != memory:** Letta provides strong evidence for treating persistent AgentState, Memory, Session and Knowledge as different things.
- **Context as a managed subsystem:** ADK explicitly describes filtering, summarization, lazy-loading and token tracking; Browser Use documents skill prompt cost.
- **Thin core loop:** Browser Use is the counterexample showing that a small task+environment abstraction can outperform conceptual complexity for narrow domains.
- **Action-boundary security:** OpenHands demonstrates layered deterministic + LLM analysis plus confirmation; its own docs state this is not a complete prompt-injection solution.
- **Autonomy vs control:** CrewAI separates autonomous Crews from structured Flows; ADK similarly composes deterministic workflow with model reasoning.

## Most important counterexamples

- More abstractions do not automatically mean more capability; Browser Use is a deliberate minimalism counterexample.
- Durable memory is not automatically beneficial; it creates poisoning, staleness and context-tax failure modes.
- Multi-agent is not automatically more effective; manager/coordination calls have a measurable opportunity cost.
- More context is not automatically better; ADK/Letta/Browser Use all provide different evidence for structured or selective context.

## Local-first findings

All five ecosystems can participate in local or self-hosted execution in at least some form, but managed offerings differ materially. Therefore LabLaunchPad should define a portable RuntimeContract and SandboxContract rather than a single deployment architecture.

## Built-in capability findings

OpenHands is strongest for software tooling; Browser Use is strongest for browser-native execution; Letta for durable state/memory; ADK for lifecycle/workflow/evaluation; CrewAI for role/task collaboration. Capability ownership should remain modular in LabLaunchPad.

## Memory / state findings

Keep the conceptual split:

`State` = machine/runtime state required to resume/recreate.

`Memory` = durable semantic information retained for future behavior.

`Context` = selected material assembled for the current model invocation.

`Knowledge` = external/reference material available for retrieval.

`Evidence` = provenance-bearing observations/results used to justify decisions.

`Transcript` = chronological interaction/event record.

## Context / token findings

A new research signal is **CodeGrep**, published August 6, 2026. It reports substantial repository-exploration overhead for coding agents and shows lower rounds/tokens when a specialized retrieval agent preselects relevant files. **SWE-Explore** separately benchmarks repository exploration using ranked line-level context under a fixed budget. These results support adding a LabLaunchPad repository-context efficiency benchmark, but they do not prove the exact effect size will transfer to LabLaunchPad.

## DX / AX / OX / UX / PX findings

The strongest shared pattern is progressive complexity: make one simple path excellent, then expose governance/orchestration layers only when needed. Machine-readable docs/skills are increasingly part of the agent developer experience. Operational UX should expose run state, current action, evidence, approvals, errors, recovery and resource usage.

## Security findings

LabLaunchPad should not rely on an LLM's own security judgement. Use deterministic action-boundary policy rails, sandbox isolation, credential scoping, approval state transitions, idempotency and audit logs. Treat MCP, browser profiles and workspace mounts as distinct trust boundaries.

## Methodology findings

Recommended smallest stack:

**Specification-Driven Development + TDD + Contract Testing + Property-Based Testing + Golden/Fixture Testing + Adversarial Testing + Evaluation-Driven Development.**

Add Benchmark-Driven Development for efficiency-sensitive systems and Chaos/Recovery Testing for durable runtimes. Defer mutation testing to deterministic core modules until the test suite is mature.

## Licensing findings

Reviewed repositories: OpenHands SDK MIT; Letta Apache-2.0; Google ADK Python/Go Apache-2.0; Browser Use MIT; CrewAI MIT. This is repository-license evidence, not a complete dependency or documentation-license clearance. Trademark/brand assets and dependencies remain separate legal surfaces.

## 5+ contradictions

1. Minimal framework vs rich framework.
2. Persistent memory vs memory poisoning/staleness.
3. Multi-agent coordination vs coordination overhead.
4. More context vs context distraction/cost.
5. More abstraction vs maintainability.
6. Local-first vs managed infrastructure.
7. LLM security judgement vs deterministic security enforcement.

## New LabLaunchPad requirements

- `RuntimeContract`
- `SandboxContract`
- `CapabilityContract` with risk/provenance/approval
- `DurableAgentState` distinct from `Memory`
- `ContextBroker` with progressive disclosure and token budgets
- `Evidence` + `Trace` + `Proof` + `Replay` + `Audit` contracts
- Tool-trajectory evaluation
- Repository-context efficiency benchmark
- Idempotency and duplicate-side-effect protection
- Memory provenance, scope, TTL/review and poisoning tests
- Semantic compatibility adapters rather than API cloning

## Requirements to delete

No existing LabLaunchPad requirement was silently deleted in this pass. Candidate deletions should be raised as ADR-CANDIDATE entries after comparing against the existing locked architecture.

## Requirements to defer

- Default multi-agent hierarchy
- Cloud-specific control-plane cloning
- Automatic self-modifying memory evolution
- Multi-language parity at the semantic-core level
- Full browser automation platform before capability security is mature

## Benchmarks to add

1. Repository Context Efficiency
2. Tool Trajectory Correctness
3. Verified Outcome / Total Cost
4. Memory Write Precision + Poisoning Resistance
5. Sandbox Escape / Credential Exfiltration Resistance
6. Multi-agent Break-even
7. Resume/Recovery correctness
8. Duplicate Side-effect Rate
9. Context Distraction under fixed token budget
10. Time-to-first-useful-result and information discovery cost

## TDD / BDD / SDD / Contract recommendation

Use SDD for contracts, TDD for deterministic implementations, BDD for user/operator acceptance flows, contract testing for replaceable subsystems, property tests for state/event/policy invariants, adversarial testing for trust boundaries, and eval-driven tests for probabilistic behavior.

Every proposed capability should eventually map:

`BEHAVIOR -> ACCEPTANCE -> NEGATIVE CASES -> CONTRACT -> UNIT -> INTEGRATION -> ADVERSARIAL -> BENCHMARK -> PORTABILITY -> REGRESSION`

## ADR candidates

- ADR-CANDIDATE: separate Runtime from Agent semantics.
- ADR-CANDIDATE: formalize State/Memory/Context/Knowledge/Evidence/Transcript.
- ADR-CANDIDATE: introduce ContextBroker.
- ADR-CANDIDATE: make action-boundary policy mandatory for dangerous capabilities.
- ADR-CANDIDATE: make multi-agent orchestration opt-in.
- ADR-CANDIDATE: define semantic adapter policy for external agent frameworks.

## Research gaps

No E5 reproduction was performed in this pass. Exact release-specific behavior, dependency licenses, documentation licenses, and empirical performance on a common LabLaunchPad benchmark suite remain research gaps.

## Next research installment

Run E5 reproduction across identical tasks for the five frameworks plus the existing corpus, using the same model/provider tiers, fixed token budgets, identical workspace tasks, security attacks, recovery faults and evaluation harness.

**STOP — NO PRODUCTION IMPLEMENTATION.**
