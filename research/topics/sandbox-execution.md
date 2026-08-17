---
type: Topic Research
title: Sandbox / Workspace Execution
description: Cross-cutting comparison of sandbox/workspace isolation approaches (Docker seccomp/rootless, Firecracker microVMs, Wasmtime/WASI) imported from the "current wave" corpus
sources:
  - resource: https://openai.github.io/openai-agents-python/sandbox_agents/
    id: openai-sandbox-agents
  - resource: https://docs.docker.com/engine/security/seccomp/
    id: docker-seccomp
  - resource: https://docs.docker.com/engine/security/rootless/
    id: docker-rootless
  - resource: https://firecracker-microvm.github.io/
    id: firecracker
  - resource: https://docs.wasmtime.dev/security.html
    id: wasmtime-security
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_evidence_level: E3
x_provenance: imported research corpus ("current wave"), URLs not independently re-verified via WebFetch/WebSearch in this session — treat as DOCUMENTED_NOT_REPRODUCED
---

# Sandbox / Workspace Execution

> **Cross-cutting topic, not a framework.** Unlike `research/frameworks/`
> or `research/protocols/`, this is a topic-level comparison spanning
> multiple isolation technologies referenced across several already-
> researched frameworks (Mastra's Workspace sandbox, OpenHands's
> `DockerWorkspace`, Browser Use's sandboxing). New directory
> `research/topics/` created for this and `security-2026.md`.

## Isolation technology comparison [E3, imported]

- **OpenAI Agents SDK sandbox agents**: exposes workspace, file, shell,
  snapshot and resume concepts as a first-party feature — marked **beta**
  in the Python docs. Relevant to the OpenAI Agents SDK refresh-check
  appended to `research/frameworks/openai-agents-sdk/overview.md`.
- **Docker seccomp**: restricts available syscalls at the container
  boundary.
- **Docker rootless mode**: reduces host privilege exposure by running
  the container runtime itself as a non-root user.
- **Firecracker microVMs**: KVM-based, minimal device model, plus a
  "jailer" process for additional isolation — heavier-weight than
  containers, closer to true VM isolation.
- **Wasmtime/WASI**: capability-oriented filesystem access, sandboxing at
  the WASM runtime level rather than the OS process level.

## Named tradeoffs [E3, imported]

1. **Container convenience vs. isolation strength** — Docker-style
   containers are the easiest to adopt but share the host kernel;
   syscall-filtering (seccomp) narrows but does not eliminate that shared
   surface.
2. **MicroVM isolation vs. startup/resource overhead** — Firecracker-style
   isolation is stronger but costs cold-start latency and per-instance
   resource overhead that container-based sandboxes don't pay.
3. **WASM portability vs. API/environment restrictions** — Wasmtime/WASI
   sandboxing is highly portable but constrains what the sandboxed code
   can do (no arbitrary syscalls, capability-scoped filesystem only).

## LabLaunchPad implication

This is a genuine three-way tradeoff space, not a single "pick the most
secure option" decision — LabLaunchPad's own `SandboxProvider` spec
(Phase 19, per `docs/agent/NEXT.md`'s "Known gaps") should treat isolation
strength as a **configurable dial**, not a fixed choice, since the right
point on the convenience/strength/latency triangle differs by workload
(a quick local dev sandbox vs. a production multi-tenant execution
surface have different requirements). This reinforces
`research/contradictions/local-execution-cheaper.md`'s finding that
isolation guarantees must be defined independent of local-vs-hosted
preference — now with a concrete menu of technologies to choose from
rather than an abstract requirement.

## Open questions

- No cross-platform security benchmark was performed by the source
  corpus — explicitly flagged as unknown there, inherited here.
- Exact LabLaunchPad `SandboxProvider` interface shape — not designed yet,
  deferred to Phase 19.
- How this interacts with Mastra's Workspace sandbox and OpenHands's
  `DockerWorkspace` (both already researched) — not cross-referenced in
  depth this pass.
