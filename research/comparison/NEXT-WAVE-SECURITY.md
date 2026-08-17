---
type: Framework Research
title: SECURITY
description: 'Comparison matrix imported from a prior "next wave" external research pass (batch 2, 9 frameworks: Strands Agents, smolagents, AG2, LlamaIndex, Llama Agents, Haystack, DSPy, AutoGen, Semantic Kernel)'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus batch 2 (user-supplied "next wave"), URLs not independently re-verified via WebFetch in this session - treat as DOCUMENTED_NOT_REPRODUCED per the source corpus's own evidence-discipline section
x_original_frontmatter: 'okf_version: "0.2" | id: "SECURITY" | title: "Security Extraction" | date: "2026-08-17" | source_type: "research" | evidence_standard: "E0-E5" | status: "RESEARCH_COMPLETE" | tags: |   - "security" |   - "sandbox" |   - "capabilities"'
---

# SECURITY

## Verified risk signals

1. Strands session persistence documentation warns session managers are not thread-safe and that symlink behavior in trusted session storage can expose files. This demonstrates that "local persistence" is itself a security boundary, not a convenience feature.
2. smolagents documents that CodeAgent local execution can be potentially unsafe and provides sandbox options. This demonstrates that generated code execution must have an explicit trust model.
3. Haystack MCPToolset can execute local tools through subprocess stdio and remote tools through HTTP/SSE. The trust boundary therefore crosses process and network boundaries.
4. AutoGenBench uses Docker isolation for benchmark execution, a useful precedent for adversarial/benchmark workloads.
5. Haystack release notes include security fixes around prompt/template handling, showing schema/template sanitization belongs in regression gates.

## Non-negotiable LabLaunchPad policy

`TOOL OUTPUT = DATA; TOOL OUTPUT != AUTHORITY`

Every capability call should carry:

- capability_id
- operation_id
- actor/agent identity
- authorization decision
- side-effect class
- input provenance
- timeout
- cancellation state
- output provenance
- reconciliation status

## Threat classes

Prompt injection, tool output injection, memory poisoning, workspace escape, shell abuse, network exfiltration, secret disclosure, PII leakage, capability escalation, remote-agent impersonation, MCP server compromise and skill/package poisoning.

## Required contracts

`WorkspaceContract`: root, read/write allowlist, subprocess policy, network policy, secret mounts, resource limits, TTL, cleanup and artifact ownership.

`SandboxContract`: isolation class, syscall/process limits, filesystem mapping, network mode, dependency policy, escape detection and teardown.

`SideEffectContract`: intent -> operation_id -> commit/rollback/unknown outcome -> reconciliation.

## Security stance

Never infer security from "small SDK", "local", "MCP", "sandbox available" or "typed schema". Security is verified only per capability/runtime boundary.
