---
type: Framework Research
title: Security Findings
description: 'Comparison matrix: Security Findings, imported from the "current wave" research corpus'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus ("current wave"), URLs not independently re-verified via WebFetch/WebSearch in this session - treat as DOCUMENTED_NOT_REPRODUCED
---

# Security Findings

## Current threat model

OWASP's 2026 Agentic Applications Top 10 identifies: Agent Goal Hijack, Tool Misuse & Exploitation, Identity & Privilege Abuse, Agentic Supply Chain Vulnerabilities, Unexpected Code Execution, Memory & Context Poisoning, Insecure Inter-Agent Communication, Cascading Failures, Human-Agent Trust Exploitation, and Rogue Agents. [OWASP](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)

OpenAI's current security framing emphasizes source-to-sink analysis: an attacker may control external content (source) and attempt to reach a dangerous capability (sink). Defenses should constrain impact even when classification fails. [OpenAI](https://openai.com/index/designing-agents-to-resist-prompt-injection/)

MCP's specification states that tools represent arbitrary code execution and that tool annotations/descriptions should not be assumed trustworthy unless the server is trusted. It also calls for explicit user consent around data access and tool invocation. [MCP](https://modelcontextprotocol.io/specification/2025-11-25)

## LabLaunchPad security invariants

1. TOOL OUTPUT = DATA; TOOL OUTPUT != AUTHORITY.
2. Capability descriptions are metadata, not policy.
3. Authorization must be evaluated at the capability boundary.
4. Sensitive data exfiltration must be modeled as a source-to-sink flow.
5. Remote agents are untrusted capabilities until authenticated and policy-authorized.
6. Memory is a poisoning surface; promotion into durable memory requires provenance and policy.
7. Sandbox escape and workspace boundary tests are mandatory for execution capabilities.
8. Every side-effecting capability needs an operation ID and reconciliation semantics.

## Sandbox extraction

Docker supplies seccomp-based syscall filtering and rootless mode; Firecracker uses KVM-based microVM isolation with a minimal device model; Wasmtime/WebAssembly uses sandboxing and capability-oriented WASI filesystem access. These are different isolation strengths and convenience profiles, not interchangeable “sandbox” labels. [Docker](https://docs.docker.com/engine/security/seccomp/) [Docker rootless](https://docs.docker.com/engine/security/rootless/) [Firecracker](https://firecracker-microvm.github.io/) [Wasmtime](https://docs.wasmtime.dev/security.html)

## Decision

ADOPT capability-based security and explicit Workspace/Sandbox contracts. REJECT a single universal sandbox implementation. ADAPT isolation level to risk and platform.
