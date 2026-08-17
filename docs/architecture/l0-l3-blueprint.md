# AgentBridge — L0–L3 Planning Package (Kernel + Tool Runtime deep dive)

> Status: approved planning artifact. No implementation exists yet; Horizon 1 (MVP) work should follow this blueprint until superseded by a new ADR.

## Context

`LabLaunchPad/agent-sdk` is greenfield: the only tracked file was a one-line README ("Next-generation, local-first AI Agent SDK for efficient, stateful, long-running, policy-aware and verifiable agents and workflows") plus `CLAUDE.md`. No language, stack, or module boundaries were fixed before this document.

This blueprint deliberately scopes down from a much larger proposed methodology (research-first, evidence-gated, hierarchically decomposed architecture planning across ~15 candidate modules) to: **L0 product blueprint → L1 platform blueprint → L2 module map/dependency graph → L3 full deep-dive on exactly two highest-leverage SDKs** — Kernel (execution/state/durability substrate) and Tool Runtime + Security (the highest-risk surface: tool execution, sandboxing, MCP, prompt-injection/tool-poisoning defense). Everything else is explicitly deferred until its own dependency is stable and its standalone value is evidenced, per the anti-premature-modularization principle used throughout.

Three decisions were made explicitly, after the initial draft: (1) language is decided **per component**, not globally — TypeScript is the default hypothesis for orchestration, but any component (notably the Tool Runtime's sandbox boundary) can land on wrap-existing infrastructure instead of custom code if that's the better-evidenced choice; (2) Kernel durability ships as **interim checkpoint/restore** in the MVP, with full event-sourced replay deferred to V1; (3) the hosted Control Plane stays **deferred** — no near-term business driver — keeping the sequence local-first-first.

Evidence basis (live research; TS/Node ecosystem-fit claims are explicitly marked as inference, not benchmarked):
- LangGraph: checkpoints state per "superstep," pluggable checkpointer backends (Postgres/Redis/DynamoDB); current industry commentary explicitly warns checkpointing alone is "not production-grade durability."
- Temporal: durability via event sourcing — append-only immutable event history, state reconstructed by deterministic replay; server-based (conflicts with local-first if wrapped directly).
- MCP spec (2025-06-18+): security model is human-in-the-loop + explicit consent; tool descriptions/results are untrusted input by design; the protocol delegates consent/authz enforcement to the host application.
- 2026 threat landscape: a documented incident (April 2026, JHU researchers) — malicious instructions in GitHub PR titles hijacked Claude Code/Gemini CLI/Copilot into exfiltrating secrets via indirect prompt injection; a 2026 disclosure found ~200k vulnerable MCP server instances; Google reported a 32% relative rise in malicious indirect-injection content Nov 2025–Feb 2026.
- OpenAI Agents SDK: small primitive set (Agents, Tools, Handoffs, Guardrails, Tracing, Sessions), TypeScript-first official SDK, official MCP TypeScript SDK exists — ecosystem-compatibility evidence for TS, not proof TS is architecturally optimal.
- Claude Agent SDK: exposes the Claude Code agent loop as a library — auto-compaction (clear older tool outputs, then summarize) and subagents with isolated context windows returning summaries — concrete precedent for Kernel's Context Manager.
- ReAct (Yao et al. 2022) / Reflexion (Shinn et al. 2023): interleaved reasoning+acting beats pure imitation baselines; verbal self-reflection in an episodic buffer improves subsequent-trial performance — evidence for the Kernel's execution-loop shape and its Memory extension point.
- NIST AI-600-1 (GenAI Profile, July 2024): risk taxonomy (incl. Information Security, Data Privacy) — reference point for the Tool Runtime's policy hook, not a scope item this pass.
- Rust official docs: ownership gives compile-time concurrency-error detection and memory safety without GC — real property, but **not equivalent to sandbox/process-level security**, which is the actual property Tool Runtime's isolation boundary needs.

## Executive answer

Build installable packages, not a hosted service, starting with two SDKs: **Kernel** (deterministic execution/state/durability substrate) and **Tool Runtime + Security** (governed tool/MCP execution). Everything else in the 15-module candidate list is explicitly deferred, merged into Kernel, or marked wrap-existing — not because it's unimportant, but because none of it has standalone value yet and building it now would be premature modularization. Language is decided **per component**, not as one global choice: TypeScript for all orchestration/control-plane logic in both SDKs (ecosystem fit, async-native, official MCP/agent-SDK precedent); the Tool Runtime's actual isolation boundary is a **wrap-existing decision**, not a language decision — reuse OS/container-level sandboxing rather than hand-build a custom sandbox in Rust or anything else, because no evidence yet shows a custom native sandbox outperforms a well-configured existing one at solo-founder-maintainable cost. Kernel durability ships as simple, provable checkpoint/restore in the MVP, with the harder event-sourced replay design deferred to V1 once the simpler version is validated in real use — de-risking the single biggest engineering bet in the plan.

## L1 Platform Blueprint (all ~15 candidate systems, posture only)

| System | Posture | Why |
|---|---|---|
| Kernel (state+graph+context+events merged) | **BUILD** (this pass) | No local-first durable-execution engine exists off-shelf; Temporal requires a server |
| Tool Runtime + Security | **BUILD** (this pass) | Highest documented risk surface (tool poisoning, indirect injection) |
| MCP | **WRAP-EXISTING** | Reuse the spec/official TS SDK; build our own consent/policy layer, which the spec explicitly leaves to hosts |
| Model (thin call abstraction) | **BUILD (thin, later)** | Needed by the loop eventually; keep out of this pass's scope |
| Model Router, Memory, Knowledge/RAG, Evaluation, Trust, Observability, Interoperability, Control Plane | **DEFERRED** | No standalone-value evidence yet; Kernel exposes extension points (episodic-memory hook, policy hook, OTel-shaped event bus) so later modules attach without a Kernel rewrite |

## L2 Module Map + Dependency Graph

Standalone-SDK gate applied: only Kernel and Tool Runtime pass (clear purpose, stable boundary, independent versionability, demonstrated market/standalone value). Graph/State/Context/Event-bus merge into Kernel as internally namespaced modules (`kernel.graph`, `kernel.state`, `kernel.context`) — splitting them now has no precedent (LangGraph and Claude Agent SDK both bundle these) and no standalone-value evidence.

```
                    +--------------------+
                    |   Model SDK (later)|
                    +----------+---------+
                               ^
     +-------------------------------------------------------+
     |                     KERNEL SDK                          |
     |  execution engine | state store | checkpoint mgr        |
     |  event log/replay | graph exec  | context mgr           |
     |  extension points: episodic-memory hook, policy hook     |
     +----------------------+----------------------------------+
              ^ policy/consent hook   ^ checkpoint/event append
     +--------+------------------------+---+
     |     TOOL RUNTIME + SECURITY SDK      |
     |  registry | sandbox tiers | MCP      |
     |  client | consent flow | policy hook |
     +--------+------------------------------+
              v
       [ MCP spec / external MCP servers ]

Deferred dependents (not built this pass):
  Model Router -> Model SDK | Evaluation -> Kernel event log | Memory -> Kernel episodic hook
  Knowledge/RAG -> Model SDK + external vector DB | Trust -> Tool Runtime + Observability
  Observability -> Kernel event bus (OTel) | Interop/Control Plane -> Kernel + MCP + Observability
```

## Per-module technology decisions (not a single global language)

TypeScript is the *starting hypothesis* for orchestration; it must be earned, and any non-TS or non-custom-code choice must be justified by a specific requirement.

| Component | Decision | State | Confidence | Reasoning |
|---|---|---|---|---|
| Kernel execution engine, state store, checkpoint mgr, context mgr, graph layer | **TypeScript/Node** | LOCKED | MEDIUM | Not CPU-bound; async/event-driven model fits an orchestration loop; official Claude Agent SDK / OpenAI Agents SDK / MCP TS SDK precedent for this class of component. No evidence Rust's memory-safety/perf properties are needed here — the loop is I/O- and coordination-bound, not compute-bound. |
| Kernel event log (durability) | **TypeScript, embedded local store (e.g. SQLite/WAL)** | LOCKED for MVP shape; **implementation is interim checkpointing, not event-sourcing** (see ADR-B) | MEDIUM | De-risked per decision: ship simple checkpoint/restore first, prove it, then decide if the harder event-sourced replay actually needs a different storage engine or language. |
| Tool Runtime control plane (registry, consent flow, policy hook, MCP client) | **TypeScript/Node** | LOCKED | HIGH | Official MCP TypeScript SDK exists; this layer is orchestration/validation, not a security *boundary* itself — the boundary is the sandbox below it. |
| Tool Runtime isolation/sandbox substrate (where untrusted tool code actually executes) | **Wrap an existing hardened substrate — not a bespoke Rust sandbox** | EXPERIMENTAL — needs a small prototype before MVP freeze | LOW-MEDIUM | Rust's memory safety is a real property but is **not equivalent to sandbox/process security** (confirmed by Rust's own docs describing memory guarantees, not isolation guarantees). Building a custom native sandbox is exactly the kind of high-build-risk, low-solo-founder-maintainability bet to avoid without proven necessity. Prototype needed: compare (a) Node `child_process` + OS-level restricted permissions for Tier 1, vs (b) an existing container/microVM runtime wrapped for Tier 2 (default for third-party/untrusted MCP servers). Decision matures to LOCKED after that prototype. |
| Everything deferred this pass (Model Router, Memory, Knowledge/RAG, Evaluation, Trust, Observability) | **DEFERRED** | N/A | N/A | No architecture committed; will get its own per-component pass when its dependency (Kernel event log / Tool Runtime policy hook) is stable. |

## L3 — Kernel SDK Plan

**Identity.** Local-first, durable, resumable, policy-aware, verifiable execution substrate for agent graphs/loops. Non-goals (MVP): distributed multi-node execution, built-in RAG/memory implementations, model routing, hosted control plane.

**Architecture.**
1. **Execution Engine** — discrete deterministic steps ("supersteps"), interleaved reason+act per ReAct evidence, delegates tool calls to Tool Runtime via a `ToolInvocation` interface.
2. **Checkpoint Store (MVP durability mechanism)** — embedded local store (SQLite/WAL), periodic snapshot of full run state + a short replay buffer since the last snapshot. This is the **interim** design: simpler and faster to validate than full event-sourcing, explicitly the LangGraph-style pattern the evidence criticizes as "not production-grade" on its own — so the V1 upgrade path (below) is a committed follow-on, not an afterthought.
3. **State Store** — materialized run state, checkpointed per step or on a configurable cadence.
4. **Event Bus** — pub/sub for OTel-compatible observability emission and extension-point firing (episodic-memory hook on episode end; policy hook invoked *by* Tool Runtime).
5. **Context Manager** — auto-compaction (clear older tool outputs first, then summarize) and subagent isolation (isolated context windows, summary-only return) — both directly per Claude Agent SDK precedent.
6. **Graph/Workflow Layer** — internal `kernel.graph` namespace; cycles modeled as explicit loop/retry edges with required termination conditions and execution budgets, not claimed as a strict DAG.
7. **Extension Point Registry** — typed hooks (`onEpisodeEnd`, `onCheckpoint`, `onReplay`) so Memory/Trust/Evaluation can attach later without a Kernel rewrite.

**Durability roadmap:**
- **MVP:** checkpoint/restore only — snapshot state at each step or configurable interval; on crash, resume from the last checkpoint. Explicit test: kill-mid-run, restart, verify resumed state matches expected.
- **V1:** upgrade to append-only event-sourced log with deterministic replay (Temporal's replay-completed-results model, not re-invoking non-deterministic tool/LLM calls) once checkpoint/restore is proven in real usage and its gaps (e.g., lost work between checkpoints) are concretely felt.

**API/lifecycle (sketch).** `kernel.createRun(graphDef, initialState) -> Run`; `run.step()`, `run.checkpoint()`, `run.resume(checkpointId)`; `kernel.graph.define(...)`; `kernel.state.get/set` (scoped, versioned); `run.on(event, handler)`.

**Security boundary.** Kernel never executes tools itself — always delegates to Tool Runtime, keeping its trusted computing base small. Every tool-call event must carry a logged policy decision before being marked approved.

**Test/eval strategy.** Kill-mid-run/restart recovery tests (MVP acceptance bar); checkpoint data captures tool name/args/order/result so a full trajectory is reconstructable — the concrete hook for future trajectory evaluation (TRAJECT-Bench-style scoring), even though the Evaluation SDK itself is out of scope.

**Exit criteria (MVP).** (1) crashed run resumes to correct state from last checkpoint, test-verified; (2) checkpoint data reconstructs full step/tool trajectory; (3) context compaction + subagent isolation implemented/tested; (4) public API versioned 0.1-stable; (5) Tool Runtime integrates via `ToolInvocation` without touching Kernel internals.

## L3 — Tool Runtime + Security SDK Plan

**Identity.** Safe execution of function tools and MCP tools with sandboxing, consent, and policy inline in the call path (non-optional, non-bypassable). Non-goals (MVP): full multi-tenant governance engine, a consent UI (exposes a hook; host builds the UI), reinventing the MCP protocol.

**Architecture.**
1. **Tool Registry** — function tools (schema-validated) and MCP tools (discovered via the official MCP TS client).
2. **MCP Client Integration** — implements MCP spec discovery/invocation; every tool description and tool-result is tagged untrusted by construction, never interpolated into a privileged instruction channel unmarked.
3. **Sandbox, tiered, wrap-existing (see technology matrix above):** Tier 0 in-process (first-party trusted tools only), Tier 1 subprocess with restricted FS/network (Node `child_process` + OS permissions), Tier 2 container/microVM (default for third-party/untrusted MCP servers) — reusing an existing hardened runtime rather than building one.
4. **Consent/Authorization Flow** — explicit gate before every invocation per MCP's spec; host supplies a `ConsentProvider`; risk-tiered/adaptive prompting to counter documented consent-fatigue (flagged as a design hypothesis, not validated — see open questions below).
5. **Policy Hook** — pluggable allow/deny/modify, logged to Kernel's event/checkpoint log for auditability; taxonomy can reference NIST AI-600-1 categories even though the full Trust SDK is deferred.

**Threat model.**

| Risk | Control | Residual risk |
|---|---|---|
| Tool poisoning via malicious description | Untrusted tagging + shown at first-use consent | MEDIUM — obfuscated instructions can evade heuristics |
| Indirect injection via tool-result content (the JHU-incident pattern) | Result tagged untrusted; policy hook can require re-confirmation before high-privilege follow-on actions | HIGH — no SDK-level control fully closes this; needs host-level least-privilege discipline |
| Consent fatigue | Risk-tiered/adaptive prompting | MEDIUM — mechanism provided, good defaults not guaranteed |
| Compromised MCP server (200k-instance disclosure) | Tier 2 sandbox default for third-party MCP | MEDIUM — exfiltration still possible via network access the tool legitimately needs |
| Over-broad permission grants | Per-tool declared capability/least-privilege model | LOW–MEDIUM if enforced |

**API (sketch).** `registry.registerTool(fnToolDef)`, `registry.registerMcpServer(config)`, `runtime.invoke(toolCall, { consentProvider, policyHook }) -> ToolResult`; all decision events (`tool_call_requested`, `consent_decision`, `policy_decision`, `tool_call_executed/result`) written to Kernel's checkpoint/event log — single source of truth, no parallel state.

**Roadmap.** MVP: registry + function tools + basic MCP client + consent-every-call + Tier 1 sandbox + allow/deny policy stub. V1: adaptive consent, Tier 2 sandbox (post-prototype), untrusted-content tagging + heuristics, context-aware policy hook.

**Exit criteria (MVP).** (1) no tool call bypasses consent+policy+sandbox; (2) crafted malicious tool descriptions demonstrably fail to be interpreted as instructions (test); (3) full consent/policy audit trail recoverable from Kernel's log; (4) sandbox tiers configurable, Tier 1 functional, Tier 2 prototyped; (5) public API 0.1-stable, integrates with Kernel MVP.

## Key decisions (ADR-style)

- **ADR-A (language).** Per-component matrix (table above), not a single global language. TypeScript for all orchestration/control-plane code in both SDKs; the Tool Runtime sandbox boundary is a wrap-existing decision, explicitly not a build-in-Rust decision, pending a small prototype. Confidence: MEDIUM (orchestration layer), LOW-MEDIUM (sandbox substrate, pre-prototype).
- **ADR-B (durability).** MVP ships interim checkpoint/restore (simpler, faster to validate); V1 upgrades to event-sourced replay once real usage validates the need. Confidence: HIGH that this ordering reduces MVP risk; MEDIUM that event-sourcing will still be necessary once checkpointing is proven (revisit trigger: if checkpoint-interval data loss proves acceptable in practice, V1 event-sourcing may be downgraded to optional).
- **ADR-C (Kernel = one merged SDK, not four).** Confidence HIGH — directly supported by LangGraph/Claude Agent SDK precedent and the anti-premature-modularization principle.
- **ADR-D (Tool Runtime + Security = one SDK).** Confidence MEDIUM-HIGH — MCP places consent/authz inline with invocation; splitting risks bypass.
- **ADR-E (Control Plane deferred).** No near-term business driver. Sequence stays Kernel → Tool Runtime → (later, evidence-permitting) Memory/Model/Router/Evaluation → Trust/Observability → optional self-hostable Control Plane last.

## Roadmap (horizon-level only)

- **Horizon 0 (this document):** L0–L3 frozen, no code.
- **Horizon 1 (MVP):** Kernel (checkpoint/restore durability) + Tool Runtime (Tier 1 sandbox, consent-every-call) as installable local-first packages. Includes the sandbox-substrate prototype (Tier 1 vs Tier 2 comparison) needed to lock ADR-A's sandbox row.
- **Horizon 2:** Kernel V1 (event-sourced replay), Tool Runtime V1 (Tier 2 default, adaptive consent); extract Graph ergonomics only if real usage shows standalone value; Model + Model Router SDKs begin.
- **Horizon 3+:** Memory/Knowledge/Evaluation/Trust/Observability per their own evidence-gated passes; optional self-hostable Control Plane last.

### Horizon 1 gate

No scaffolding or implementation code should be written until every row below is frozen, not just some:

| Decision | Status |
|---|---|
| Module boundaries (L2 — Kernel merges Graph/State/Context; Tool Runtime+Security is one SDK) | **FROZEN** — ADR-C, ADR-D |
| Priority SDK selection (Kernel + Tool Runtime as the first two) | **FROZEN** — dependency-centrality + risk justification, this document |
| Language/runtime — orchestration layer of both SDKs | **FROZEN** — TypeScript/Node, ADR-A |
| Language/runtime — Tool Runtime sandbox substrate | **NOT FROZEN** — EXPERIMENTAL, blocked on the Tier 1 vs Tier 2 prototype (see Verification section) |
| Kernel durability contract (MVP checkpoint/restore vs V1 event-sourcing) | **FROZEN for MVP shape** — ADR-B |
| Control Plane sequencing | **FROZEN** — deferred, ADR-E |

Horizon 1 implementation stays blocked until the sandbox-substrate row also reaches FROZEN. That prototype is research/benchmarking work, not package scaffolding, and should be scoped as its own follow-up pass before any `packages/` directory is created.

## Open questions carried forward (not blocking, but should be revisited)

- Sandbox-substrate prototype (Tier 1 vs Tier 2, which existing runtime to wrap) is unresolved — first concrete build task in Horizon 1.
- Risk-tiered/adaptive consent (anti-fatigue design) is a hypothesis, not validated against real users — treat as V1, user-test before committing further.
- No Python surface is planned; flagged as open if AI/ML ecosystem gravity later demands one — not a Horizon 1 blocker.
- Indirect prompt injection via tool-result content remains **HIGH residual risk** even after every proposed Tool Runtime control — no SDK-level design fully closes it; host-level least-privilege discipline is required as a complement, not a substitute.

## Verification (once Horizon 1 implementation begins)

- Kernel: automated kill-mid-run/restart test suite must pass before checkpoint/restore is called done; a golden-trajectory test verifies checkpoint data alone reconstructs the full tool-call sequence.
- Tool Runtime: a red-team fixture set of crafted malicious tool descriptions/results must be demonstrated to fail to influence agent behavior (i.e., treated as inert data) before Tier 1 is called done; full audit trail for every tool call must be reconstructable from Kernel's log alone.
- Sandbox prototype: before locking ADR-A's sandbox row, benchmark Tier 1 (subprocess+OS permissions) against a wrapped Tier 2 substrate on startup latency, escape resistance (attempted FS/network access from a malicious tool), and solo-founder operability (setup/debugging burden) — decision recorded as a new ADR once measured.

### Critical first files (Horizon 1 kickoff, not created by this document)

- `packages/kernel/src/checkpoint-store.ts` — MVP durability component (ADR-B interim design)
- `packages/kernel/src/index.ts` — Kernel public API surface
- `packages/tool-runtime/src/consent.ts` — consent/authorization flow (core security control)
- `packages/tool-runtime/src/sandbox/` — Tier 1/Tier 2 prototype location
- `packages/tool-runtime/src/index.ts` — Tool Runtime public API surface
