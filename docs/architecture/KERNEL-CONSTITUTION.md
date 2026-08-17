# Kernel Constitution

**Source-of-truth status: CANONICAL** (architecture), same rank as the
rest of `docs/architecture/` per `SOURCE-OF-TRUTH.md`.

This document is **synthesis, not new decision**. It ties ADR-0006 and
ADR-0009 through ADR-0016 into one coherent, testable, primitive-level
specification of what the kernel actually is. Where a section elaborates
an existing ADR, that ADR is named and remains the binding record — this
document explains and connects, it does not supersede. Zero new ADRs were
required to write it; if a genuine ambiguity had surfaced, the fix would
have been a short Clarification addendum to the relevant existing ADR, not
a new one (`.context/research/reconciliation/phase-gate.json`'s
`lock_state.NEW_ADR_CREATION: TRIGGER_ONLY`).

Machine-readable mirror: `.context/specs/kernel.json`.

## Kernel primitives

Ten, and only ten, until a real dependency cut proves an eleventh is
needed (`docs/architecture/PACKAGE-MAP.md`'s own creation rule, applied
here identically):

**Identity, Task, Run, State, Operation, Capability, Policy, Checkpoint,
Evidence, Verdict.**

Everything else — planning, memory, knowledge, tools, protocols, model
providers, sandboxes — is an adapter or a higher layer, never kernel. See
Non-goals below.

## 1. State machine algebra

Elaborates: nothing existing — this is the one primitive-level definition
no prior ADR states directly (ADR-0009/0010/0011 assume a state machine
exists; none define its algebra).

**Elements**: `State`, `Event`, `Context`, `Guard`, `Transition`,
`Action`/`Effect`, `Error`, `Cancellation`, `Completion`, `Replay`.

- **State**: an immutable snapshot of everything a `Run` needs to resume.
  Never partial — a `State` either fully represents a resumable point or
  it is not a `State`, it is in-flight work that hasn't reached one yet.
- **Event**: an input that may cause a transition. Carries its own
  identity (so duplicate/replayed events are detectable, not just
  hoped-against).
- **Context**: data available to a `Guard`/`Action` at transition time,
  distinct from `State` — `Context` can include ambient information (current
  time, external system status) that is not itself persisted as part of
  `State`.
- **Guard**: a pure, deterministic predicate over `(State, Event, Context)`
  deciding whether a transition is legal. Guards never have side effects.
- **Transition**: `(State, Event) → State`, mediated by zero or more
  Guards and producing zero or more `Action`/`Effect` records.
- **Action/Effect**: what a transition _causes_ — may be purely internal
  (another kernel state change) or may dispatch an `Operation` (§2).
- **Error**: a transition that a `Guard` rejects is not a kernel failure —
  it is a defined, expected outcome (`illegal transition`, see the
  adversarial matrix in `.context/scenarios/kernel-core.json`).
- **Cancellation**: an explicit `Event` type; a cancelled `Run` reaches a
  defined terminal `State`, never simply stops emitting Events.
- **Completion**: a terminal `State` from which no further `Event` causes
  a `Transition` (checked, not assumed).
- **Replay**: re-deriving `State` from a persisted `Event` log must
  produce byte-identical `State` to what was actually persisted, or the
  determinism invariant below is violated.

**The determinism invariant** (the one property everything else in this
section exists to protect):

```
same state + same event + same deterministic input ⇒ same transition result
```

**Illegal by construction, not by convention**: a `Transition` function
that reads any non-deterministic source (wall-clock time, random state,
network I/O) directly is a defect, not a style violation — non-determinism
enters only through `Context`, which is itself part of the recorded input
to a `Transition`, never invisible to it.

**Covers** (per the one-shot's own required list): illegal transitions,
duplicates, ordering, replay, migration, concurrency — see
`.context/scenarios/kernel-core.json` for the adversarial cases each maps
to, and `research/benchmarks/E5-02-RESULT.md` for which of these this
phase's harness actually exercised versus simulated versus left
`NOT_EXECUTED`.

## 2. Operation / side-effect state machine

Elaborates: **ADR-0011** (`UNKNOWN_OUTCOME` as a first-class side-effect
state) — this section is the exact state enum ADR-0011 established the
_need_ for but did not itself enumerate.

**States**:

```
NOT_STARTED
  → AUTHORIZED
    → DISPATCHED
      → ACKED | REJECTED | UNKNOWN_OUTCOME
        → RECONCILING
          → ACKED | REJECTED | MANUAL_REVIEW
```

**Fields every `Operation` carries**: `OperationID` (stable identity
across retries), `AttemptID` (distinct per dispatch attempt),
`IdempotencyKey` (what the external system uses to detect a duplicate,
where it supports one), `InputHash` (detects a caller trying to reuse an
`OperationID` with different input — must be rejected, not silently
accepted), `Capability` (what authorized this), `PolicyDecision` (the
recorded outcome of policy evaluation, §4), `Evidence` (§5), `Outcome`.

**The rule this whole state machine exists to enforce**: a timeout is
never automatically converted into a failure for a non-idempotent
external effect. `DISPATCHED` transitions to `UNKNOWN_OUTCOME`, not
`REJECTED`, when the caller cannot confirm what happened — `REJECTED`
means the kernel has positive evidence the effect did not occur;
`UNKNOWN_OUTCOME` means it does not know. Collapsing the two is exactly
the failure mode this whole primitive exists to prevent (`research/canonical/
canonical-research.json`'s `CTR-UNKNOWN-OUTCOME-CONVERGENCE` — the single
most cross-corpus-corroborated finding across all six research corpora).

**`RECONCILING`** must query the external system's own record of what it
did (an idempotent status check, where the capability supports one) before
ever re-dispatching. A capability with no such status check degrades
`RECONCILING`'s only exit to `MANUAL_REVIEW` — this is a legitimate,
expected outcome for some capabilities, not a defect in the state machine.

**Evidence this phase**: `research/benchmarks/E5-02-RESULT.md` — a
SIMULATED harness (§7 explains why real capabilities don't exist yet to
test this against honestly).

## 3. Durability

Elaborates: **ADR-0010** (Durability & Checkpoint Boundary) and
`specs/persistence/STORE-INTERFACES.md` (`SPEC-PERSIST-001`).

**Checkpoint boundary**: a `Checkpoint` is a `(State, sequence number,
schema version)` tuple, written atomically — partial checkpoint writes
must never be observable by a subsequent reader (this is exactly what
`E5-DURABLE-RESTART` tested, scope-qualified — see
`research/benchmarks/E5-RESULT.md`).

**Persistence ordering**: checkpoints for a single `Run` are totally
ordered by sequence number. Cross-`Run` ordering is not guaranteed unless
a `Run` explicitly depends on another's `Checkpoint` (an open question,
`specs/persistence/STORE-INTERFACES.md` §19).

**Recovery**: on restart, the kernel loads the highest-sequence
`Checkpoint` for a `Run` and resumes from there — never from
partially-written state (verified this phase, scope-qualified, by
`E5-DURABLE-RESTART`).

**Replay**: recovering `State` from `Checkpoint` + subsequent `Event` log
entries must satisfy the §1 determinism invariant exactly.

**Duplicate suppression**: resuming a `Run` must not re-execute an
`Operation` already `DISPATCHED` before the crash — this is where §2's
`UNKNOWN_OUTCOME`/`RECONCILING` states and §3's checkpoint/recovery model
meet directly; recovery alone cannot resolve this, reconciliation must.

**Crash semantics**: a crash at any point must leave the persisted state
in one of exactly two observable conditions — the pre-crash `Checkpoint`
(if the in-flight write never completed) or the post-write `Checkpoint`
(if it did) — never anything in between. This is the precise corruption
definition adopted this phase (see `research/benchmarks/E5-RESULT.md`'s
"Precise definition of corruption" — 7 criteria, of which this phase's E5
work measured 2).

**Corruption detection**: schema validity (structural), event-order
validity, duplicate-committed-operation detection, impossible-transition
detection, evidence-linkage completeness, checkpoint-references-real-state
validity, and authorization-decision-change-without-cause detection — the
same 7 criteria, restated here as what a real `CheckpointStore`
implementation must actually check, not just what an E5 experiment
happened to measure.

**Schema migration**: a `Checkpoint` written by version N must remain
readable by version N+1 (`STORE-INTERFACES.md`'s existing invariant 4),
tested against real persisted checkpoints, never synthetic fixtures built
to match the new shape.

**Concurrency**: `StateStore` writes for a single `Run` require optimistic
concurrency at minimum; whether that's sufficient under real multi-agent
write contention is explicitly `UNKNOWN` (`STORE-INTERFACES.md` §19, ADR-0010's
own revisit trigger) — not resolved by this document.

## 4. Capability / policy

Elaborates: **ADR-0013** (Security Enforcement at the Policy/Capability
Boundary).

**The formula**: `WHO + CAN + DO WHAT + TO WHICH OBJECT + UNDER WHICH
CONDITIONS + UNTIL WHEN + BECAUSE OF WHICH GRANT (WHY)`.

**Capability** and **Policy** are kept separate and both independently
enforceable, never merged into one check and never delegated to model
judgement:

- **Capability** answers "is this principal (`Identity`) permitted this
  action on this object at all" — a grant, with an expiry, traceable to
  its issuing authority.
- **Policy** answers "is this action permitted _right now_, given
  environment/risk/cost/data-sensitivity/network conditions" — evaluated
  independently of capability, deterministically, and enforceable without
  a model in the loop.

**Enforcement point**: source-to-sink, at the point an `Operation`
actually dispatches (§2), never at the point a model produces or receives
text. A capability/policy check that only runs against model _output_ is
not this primitive — it is advisory. This is ADR-0013's core claim,
restated here as a kernel-level rule rather than a security
recommendation.

## 5. Evidence / verdict

Elaborates: nothing existing directly — this formalizes the E0–E5
evidence-hierarchy discipline this repository has used informally in
every research installment (`research/canonical/canonical-research.json`,
`research/topics/e5-evidence-levels.md`) as an explicit kernel primitive
for the first time.

**Evidence** fields: identity (its own stable ID), provenance (what
produced it — a `Transition`, an `Operation` dispatch, a reconciliation
query), timestamp/version, source, transition linkage (which `State`
change it's evidence for), authorization linkage (which `PolicyDecision`/
`Capability` grant it's evidence for, where applicable), confidence/status
(using the same E0–E5 scale this repository already applies to its own
research).

**Verdict** lifecycle: a `Verdict` is a terminal judgement over a `Run` or
an `Operation` — `VERIFIED` / `SUPPORTED` / `INFERRED` / `UNKNOWN` /
`NOT_EXECUTED` (the same five labels this phase's own final receipt uses,
deliberately — a `Verdict` at kernel level and a claim label at
documentation level are the same concept applied at different scales, not
two different vocabularies). A `Verdict` always cites the `Evidence`
records it rests on; a `Verdict` with no cited `Evidence` is malformed.

## 6. Agent/workflow boundary

Elaborates: **ADR-0012** (Workspace & Sandbox), **ADR-0015** (HITL as a
Workflow Contract), and the existing `PACKAGE-MAP.md`/
`DEPENDENCY-DIRECTION.md` layering.

| Layer                | Owns                                                                                                           | Does not own                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Kernel**           | The 10 primitives above; canonical semantics; truth                                                            | Execution mechanics, model calls, tool implementations                                                     |
| **AgentLoop**        | observe → interpret → propose → validate → authorize → execute → observe result → update state → continue/stop | Planning as an inseparable primitive — a loop may be planning-free                                         |
| **Workflow/Graph**   | Multi-step orchestration with explicit control flow; may host an `AgentLoop` as one of its steps               | Being required for an `AgentLoop` to function — a loop never needs to "become" a workflow                  |
| **HITL**             | A `Workflow` pause point, checkpointed exactly like any other durable pause (ADR-0015)                         | A separate control-flow mechanism                                                                          |
| **Runtime/Adapters** | Model calls, tool execution, MCP/A2A protocol translation, sandbox isolation                                   | Kernel semantics — an adapter translates, it never redefines what `Operation`/`Capability`/`Evidence` mean |

**The flow this constitution commits to**:

```
MODEL PROPOSES → KERNEL VALIDATES → POLICY AUTHORIZES → RUNTIME EXECUTES
  → EVIDENCE RECORDS → STATE TRANSITIONS → CHECKPOINT/REPLAY
```

The model never authorizes its own proposals. The kernel never executes
directly — it validates and hands off to Runtime. Runtime never decides
policy — it executes what Policy already authorized.

## Non-goals

Explicitly **not** kernel, regardless of how central they feel to an
agent SDK's user experience: planning strategy, memory management,
knowledge/retrieval, specific tool implementations, MCP/A2A wire
protocols, specific model providers, sandbox isolation mechanisms. Each
has a real, planned home (`docs/architecture/PACKAGE-MAP.md`,
`research/reconciliation/BOUNDARY-RECONCILIATION.md`) — none of them is
this document's concern, and none of them may leak kernel-shaped
assumptions into their own design (the same rule already applied to MCP
in ADR-0009).

## Testability

Every element in §1–§6 above must correspond to at least one case in
`.context/scenarios/kernel-core.json`'s adversarial matrix, marked
`EXECUTED`, `SIMULATED`, or `NOT_EXECUTED` with a stated reason — a
primitive with no corresponding test case is not yet a tested part of
this constitution, regardless of how precisely it's described in prose.
