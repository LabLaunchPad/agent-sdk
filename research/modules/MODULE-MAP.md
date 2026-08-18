---
type: Research Consolidation Report
title: Module Map
description: The M01-M20 modular reverse-engineering registry - governed research, not an active backlog. Reopen a module only when a concrete pending decision needs it.
sources:
  - resource: /research/canonical/canonical-research.json
    id: canonical
  - resource: /docs/architecture/KERNEL-CONSTITUTION.md
    id: kernel-constitution
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: module structure and reference lists supplied verbatim by the user (external adjudication + module-map message); status/gating fields and cross-references to this repository's own ADRs/gaps added this session
x_governance_rule: 'GOVERNED means: do not research this module unless one of its recorded research_trigger conditions actually fires. A module being GOVERNED is not a task queued for execution - it is a registered place to look if and when a real decision needs it. See RESEARCH-DEPTH-MODEL below for how deep to go when a trigger does fire.'
---

# Module Map

Twenty modules, each covering one architectural concern this SDK's kernel
or its adapters eventually touch. This is the **research registry**, not
the work queue — see the governance rule in the frontmatter. Modules are
listed in dependency order (M01 first: state semantics are foundational
to everything downstream).

## Research depth model — replaces the flat "5×5×5" rule

The original proposal was 5 reference repositories × 5 official docs × 5
adversarial scenarios × 5 positive/5 negative/5 property tests, applied
uniformly to every module. Applied literally, that is 100+ research
artifacts per module, 2,000+ across all twenty — indistinguishable from
the "broad research wave" this project's whole Phase 1B existed to stop.

Depth is instead proportional to:

```
research_depth = criticality × uncertainty × failure_impact × novelty
```

**Worked examples**, per the adjudication that proposed this model:

- State-transition algebra (M01): criticality very high, uncertainty
  medium, failure impact very high → **deep research** (this is exactly
  why M01 is one of the 7 `ACTIVE_THIS_PHASE` modules below).
- Package naming conventions: criticality low, uncertainty low, impact
  low → **no broad research** — a `docs/architecture/NAMING.md` decision
  suffices, no module needed at all.

A module's own `current_status` and `research_trigger` fields (below and
in `.context/research/modules/module-registry.json`) record this
judgment explicitly, not implicitly.

## Active this phase (7 of 20)

These are in scope for the current Phase 2 kernel-constitution + E5-02
pass, per the one-shot execution spec. Each is scoped only to what the
kernel spec actually needs, not full module depth.

### M01 — State Machine / Statechart Kernel

**Purpose**: the smallest deterministic state-transition algebra the
kernel needs — State, Event, Transition, Guard, Action, Effect, Actor,
Hierarchy, Concurrency, Completion, Cancellation, Failure.

**Reference set (5)**: XState (state machines, statecharts, actors,
deterministic transitions, model-based testing); Temporal TypeScript SDK
(workflow state via durable execution/replay); Restate (stateful
services, durable workflows, actor/state-machine model); DBOS Transact TS
(state/workflow execution backed by database semantics); Effect (typed
effects, concurrency, interruption, composition, runtime semantics).

**Primary invariant**: same state + same event + same deterministic
input ⇒ same transition result.

**Adversarial set**: illegal transition, duplicate event, out-of-order
event, replayed event, concurrent event, cancel during transition,
migration from an old state version, unknown event, malformed persisted
state.

**Dependency order**: 1 (foundational — everything else depends on this).
**ADR targets**: none existing define the transition algebra itself —
closed this phase by `docs/architecture/KERNEL-CONSTITUTION.md` §1
(synthesis, not a new ADR).
**Research trigger for going deeper than this phase's scope**: a real
state-machine implementation (Phase 3+) exposes a contradiction this
phase's Constitution didn't anticipate.

### M02 — Durable Execution

**Purpose**: what LabLaunchPad actually persists — not just `messages[]`,
but run/state/event-log/operation-records/checkpoints/evidence/
policy-decisions/external-outcome-status.

**Reference set (5)**: Temporal (workflow history, checkpoint, replay,
activity, retry, timeout, heartbeat, compensation, resume); Restate;
DBOS; Microsoft Agent Framework (workflow/checkpointing); LangGraph.

**Adversarial set**: `SIGKILL` after checkpoint, `SIGKILL` before
checkpoint, network timeout, duplicate delivery, worker disappears,
database unavailable, resume on another machine, schema-version upgrade,
partial write, clock skew.

**Dependency order**: 2. **ADR targets**: ADR-0010 (already bound, Phase
1B), amended by `KERNEL-CONSTITUTION.md` §3. **Evidence this phase**:
`E5-01` (durable-restart, scope-limited — see `E5-LADDER.md`).
**Research trigger**: `E5-06`/`E5-07` (checkpoint corruption / schema
migration) firing against a real `CheckpointStore`.

### M03 — Operation / Side-Effect Semantics

**Purpose**: likely the module most distinguishing this SDK from typical
agent SDKs. Every side effect gets `OperationID`/`AttemptID`/
`IdempotencyKey`/`InputHash`/`Capability`/`PolicyDecision`/`Outcome`/
`Evidence`. States: `NOT_STARTED → AUTHORIZED → DISPATCHED → ACKED |
REJECTED | UNKNOWN_OUTCOME → RECONCILING → ACKED | REJECTED |
MANUAL_REVIEW`.

**Reference set (5)**: Temporal samples; Restate examples; DBOS examples;
Stripe API docs / idempotency; AWS idempotency guidance.

**Absolute rule**: never automatically convert a timeout into a failure
for a non-idempotent external side effect.

**Dependency order**: 3. **ADR targets**: ADR-0011 (already bound, Phase
1B — the single most cross-corpus-corroborated finding in the whole
research graph), elaborated by `KERNEL-CONSTITUTION.md` §2. **Evidence
this phase**: `E5-02` (this phase, `research/benchmarks/E5-02-RESULT.md`
— SIMULATED, not real, see that document's own Limitations).
**Research trigger**: `E5-04`/`E5-08` firing against a real capability.

### M04 — Capability / Authorization Kernel

**Purpose**: WHO CAN DO WHAT TO WHICH OBJECT UNDER WHICH CONDITIONS UNTIL
WHEN BECAUSE OF WHICH GRANT.

**Reference set (5)**: OpenFGA (explicit agent/MCP-tool authorization
guidance — agents as principals, per-tool access control); Cedar; Open
Policy Agent; Zanzibar concepts; SPIFFE/SPIRE.

**Adversarial set**: privilege escalation, confused deputy, expired
grant, cross-tenant access, tool impersonation, agent impersonation,
stale authorization cache, policy bypass, MCP tool overreach.

**Dependency order**: 4. **ADR targets**: ADR-0013 (already bound, Phase
1B — source-to-sink containment), elaborated by
`KERNEL-CONSTITUTION.md` §4. **Research trigger**: `E5-08`/`E5-10` firing
against a real `PolicyEngine`/`CapabilityEngine` (Phase 8/9).

### M05 — Policy Engine

**Purpose**: distinct from M04 — authorization asks "can A do X to Y,"
policy asks "under what execution conditions is X allowed." Dimensions:
identity, capability, resource, environment, risk, network, filesystem,
cost, human approval, data sensitivity, time. Policy evaluation must be
deterministic and independently executable — the model is never the final
authorization authority.

**Reference set (5)**: OPA; Cedar; OpenFGA; AWS Cedar docs; Google
Zanzibar paper.

**Dependency order**: 5. **ADR targets**: ADR-0013 (shared with M04),
elaborated by `KERNEL-CONSTITUTION.md` §4. **Research trigger**: same as
M04.

### M15 — Observability / Replay

**Purpose**: the event taxonomy that becomes the foundation for forensic
replay — `RunStarted`, `StateChanged`, `ModelRequested`, `ModelReturned`,
`ToolProposed`, `PolicyEvaluated`, `ToolAuthorized`, `ToolExecuted`,
`ToolFailed`, `ApprovalRequested`, `ApprovalGranted`, `CheckpointCreated`,
`CheckpointLoaded`, `RecoveryStarted`, `RecoveryCompleted`,
`VerdictIssued`.

**Reference set (5)**: OpenTelemetry JS (traces, metrics, logs); OpenAI
Agents tracing (agent runs, generations, tools, guardrails, handoffs);
Temporal; Langfuse; Arize Phoenix.

**Dependency order**: 8 (informed by M01-M05 first). **ADR targets**:
none yet — `@lablaunchpad/observability` is already `KEEP` in
`docs/architecture/PACKAGE-MAP.md` (Phase 1B `BOUNDARY-RECONCILIATION.md`);
`KERNEL-CONSTITUTION.md` §5 (Evidence/Verdict) is the primitive-level
input this event taxonomy will eventually consume. **Research trigger**:
Phase 20 `@lablaunchpad/observability` design.

### M16 — Contracts / Schemas

**Purpose**: the domain model owns the semantics; schema libraries are
implementation mechanisms, never the reverse. `Domain Contract → Schema
Projection → Runtime Validation → Persistence`.

**Reference set (5)**: Zod; Ajv; Standard Schema; TypeBox; Valibot.

**Rule**: never let a library's schema limitations redefine the domain.

**Dependency order**: 6. **ADR targets**: ADR-0001 (TypeScript canonical,
language-neutral JSON Schema contracts — already Accepted, Phase 0).
Already partially proven: `@lablaunchpad/contracts`'s Zod↔JSON-Schema
round-trip harness (`schema-contract-validator`). **Research trigger**:
Phase 3 domain-contract design finding the existing harness insufficient.

## Governed, not active this phase (13 of 20)

Full detail (references, extraction targets, adversarial tests) as
originally supplied; abbreviated here since none are in scope this phase
— expand in place when a real trigger fires, per the governance rule
above, not preemptively.

| Module                                             | Purpose                                                                                                                                                                                                                                           | Reference set (5)                                                                                                                                 | Dependency order | Research trigger                                                                                    |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------- |
| **M06 Context Compiler**                           | raw context → classify → rank → compress → compile → validate → inject; never conflate context with conversation history                                                                                                                          | Claude Code context practices; LangGraph state/context; Microsoft Agent Framework context providers; OpenAI Agents sessions/context; Letta/MemGPT | 9                | Phase 6 `@lablaunchpad/context` design                                                              |
| **M07 Memory**                                     | episodic/semantic/procedural/working/profile/task; adversarial: poisoning, false memory, staleness, conflict, cross-tenant leakage                                                                                                                | Letta; Mem0; Zep; LangMem; LlamaIndex                                                                                                             | 10               | Phase 7 `@lablaunchpad/memory` design                                                               |
| **M08 Knowledge / Retrieval**                      | retrieval ≠ truth — every retrieved item carries provenance/source/timestamp/confidence/version/license/verification state                                                                                                                        | LlamaIndex; Haystack; Weaviate; Qdrant; Chroma                                                                                                    | 11               | A concrete retrieval requirement, aligned with this repo's own OKF/evidence discipline              |
| **M09 Agent Loop**                                 | observe → interpret → propose → validate → authorize → execute → observe result → update state → continue/stop; planning is not an inseparable kernel primitive                                                                                   | OpenAI Agents JS; Microsoft Agent Framework; Claude Agent SDK TS; LangGraph; PydanticAI                                                           | 12               | Phase 10 `@lablaunchpad/agent` design                                                               |
| **M10 Workflow / Graph Engine**                    | DAG/state-graph/cycles/branch/join/map/reduce/parallelism/handoff/interrupt/checkpoint/resume; an Agent Loop operates inside a Workflow, a Workflow need not become an Agent                                                                      | Temporal; Restate; LangGraph; Microsoft Agent Framework; XState                                                                                   | 13               | Phase 12 `@lablaunchpad/workflow` design                                                            |
| **M11 Tools / MCP**                                | MCP belongs in the adapter layer, never kernel semantics                                                                                                                                                                                          | MCP TypeScript SDK; MCP specification; MCP servers repository; OpenAI Agents JS; MCP Inspector                                                    | 14               | Phase 18 `MCPAdapter` design (ADR-0009 already bound)                                               |
| **M12 A2A / Remote Agent Protocol**                | remote agents are untrusted external principals — never expose internal state/memory/capabilities/policy unless explicitly delegated                                                                                                              | A2A protocol; A2A specification; A2A samples; Google A2A samples; Microsoft Agent Framework                                                       | 15               | Phase 18 `A2AAdapter` design (ADR-0009 already bound)                                               |
| **M13 Workspace / Sandbox**                        | filesystem/process/network/secret/CPU/memory/disk isolation; fork bomb, symlink escape, container escape                                                                                                                                          | OpenHands; OpenAI Agents JS; E2B; Daytona; gVisor                                                                                                 | 7                | Phase 8/19 (ADR-0012 already bound)                                                                 |
| **M14 HITL / Approval**                            | model approval as explicit state (`PENDING_APPROVAL → APPROVED/DENIED → EXECUTING → COMPLETED`), never a boolean hidden in a prompt                                                                                                               | LangGraph; OpenAI Agents JS; Microsoft Agent Framework; Temporal; Restate                                                                         | 13               | Phase 12 workflow design (ADR-0015 already bound)                                                   |
| **M17 Concurrency / Queue / Scheduling**           | queue/worker/lease/lock/fencing/backpressure/priority/fairness/dedup/concurrency-limit; adversarial: duplicate delivery, starvation, thundering herd, deadlock, split-brain, lease expiry                                                         | BullMQ; Temporal; Restate; DBOS; Effect                                                                                                           | 8                | Phase 4 concurrency model design                                                                    |
| **M18 Model Gateway / Provider Abstraction**       | not a normalizer over `messages → provider.generate()` — the real contract includes capabilities, structured output, tool calling, streaming, reasoning controls, multimodal, context limits, cost, latency, failure modes, privacy, availability | Vercel AI SDK; LiteLLM; OpenAI Agents JS; PydanticAI; LangChain JS                                                                                | 16               | Phase 16 Model Gateway design (ADR-0014 already bound)                                              |
| **M19 Evaluation / Red Team**                      | measures correctness, safety, reliability, latency, cost, recovery, determinism — not just LLM response quality                                                                                                                                   | Inspect AI; DeepEval; Phoenix; Langfuse; OpenAI Evals                                                                                             | 17               | Phase 21 `@lablaunchpad/evaluation` design                                                          |
| **M20 Packaging / Monorepo / Runtime Portability** | workspace/npm/pnpm/bun/deno/Node/worker-runtime/bundler/ESM/CJS boundary testing                                                                                                                                                                  | pnpm; Turborepo; Nx; Effect; MCP TypeScript SDK                                                                                                   | 18               | Phase 17 runtime-portability work, `workerd` smoke test (already a known gap, `docs/agent/NEXT.md`) |

## The steal matrix — idea → mechanism → invariant → adaptation

Never "steal" as copy source code. `idea → mechanism → invariant →
adaptation → independent implementation`, with license/provenance
recorded for every source (matching this repository's own evidence
discipline, applied identically here).

| LabLaunchPad concept | Learn heavily from       | Do not copy                           |
| -------------------- | ------------------------ | ------------------------------------- |
| State                | XState                   | XState's API surface                  |
| Durable execution    | Temporal                 | Temporal's runtime                    |
| Durable state        | Restate                  | Restate's architecture wholesale      |
| DB-backed recovery   | DBOS                     | Database-specific semantics           |
| Effects/concurrency  | Effect                   | The functional-programming surface    |
| Authorization        | OpenFGA                  | A generic meta-model                  |
| Policy               | Cedar/OPA                | Policy-language lock-in               |
| Agent loop           | OpenAI/Claude/Microsoft  | A provider-specific agent primitive   |
| Workflow             | Temporal/LangGraph/MAF   | A framework-specific graph model      |
| Sandbox              | OpenHands/E2B            | Vendor runtime assumptions            |
| Tool protocol        | MCP                      | MCP semantics leaking into the kernel |
| Remote agents        | A2A                      | Remote-implementation assumptions     |
| Observability        | OpenTelemetry            | A vendor exporter                     |
| Contracts            | Zod/Ajv/Standard Schema  | A schema library defining the domain  |
| Evaluation           | Inspect/DeepEval/Phoenix | Benchmark overfitting                 |

## Kernel target (informs but does not replace `KERNEL-CONSTITUTION.md`)

The module map's own synthesis converges on a kernel smaller than the map
itself: `Identity, Task, Run, State, Operation, Capability, Policy,
Checkpoint, Evidence, Verdict` — ten primitives, with everything else
(M06–M20) layered above or around it as adapters, not kernel concerns.
This is the same conclusion Phase 1B's `BOUNDARY-RECONCILIATION.md`
independently reached (14 `KEEP` boundaries, 0 new top-level packages) —
convergent evidence, not new information.
