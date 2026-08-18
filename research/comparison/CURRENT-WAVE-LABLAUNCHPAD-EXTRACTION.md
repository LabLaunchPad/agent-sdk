---
type: Framework Research
title: LabLaunchPad Architecture Extraction
description: 'Comparison matrix: LabLaunchPad Architecture Extraction, imported from the "current wave" research corpus'
sources:
  - resource: (see body for inline citations)
    id: inline
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
x_provenance: imported research corpus ("current wave"), URLs not independently re-verified via WebFetch/WebSearch in this session - treat as DOCUMENTED_NOT_REPRODUCED
---

# LabLaunchPad Architecture Extraction

## Target kernel

```text
Agent Kernel
  -> Capability
  -> Context
  -> Policy
  -> Runtime
  -> State
  -> Event
  -> Result
  -> Evaluation
```

Optional but independently replaceable:

```text
Workflow Engine
Knowledge Engine
Memory Engine
Optimization Engine
Multi-Agent Coordinator
Workspace Engine
Sandbox Engine
Protocol Adapters (MCP/A2A)
Model Router
```

## New contract emphasis from this wave

### WorkspaceContract

```yaml
root: opaque
path_rules: explicit
read_policy: capability-scoped
write_policy: capability-scoped
shell_policy: explicit
process_policy: explicit
network_policy: allowlist_or_deny
secret_policy: isolated
resource_limits: cpu|ram|disk|pids|time
artifact_policy: explicit
snapshot_policy: optional
cleanup_policy: required
resume_policy: explicit
cross_platform_behavior: declared
```

### SideEffectContract

```yaml
operation_id: required
intent: required
target: required
requested_state: required
commit_state: NOT_STARTED|REQUESTED|COMMITTED|REJECTED|FAILED|UNKNOWN_OUTCOME|RECONCILED
observed_state: optional
idempotency_key: recommended
status: required
reconciliation_strategy: required
compensation_strategy: optional
rollback_strategy: optional
audit_event: required
```

## Architectural deletes / non-goals

Do not build:

- a universal swarm engine before evidence shows multi-agent value
- a universal vector DB inside the kernel
- a universal scheduler inside the kernel
- transcript-as-state
- protocol-specific semantics in the core kernel
- “model agnostic” abstractions without capability degradation reporting
- autonomous self-modification in the base runtime

## ADR candidates

1. ADR-CANDIDATE: promote Workflow/Checkpoint as a first-class runtime subsystem.
2. ADR-CANDIDATE: add MCP 2026-07-28 stateless adapter model rather than session-centric MCP runtime state.
3. ADR-CANDIDATE: add A2A adapter with remote-agent trust boundary and AgentCard validation.
4. ADR-CANDIDATE: promote Workspace/Sandbox from integration detail to explicit contracts.
5. ADR-CANDIDATE: add mandatory source-to-sink security policy around external content -> side effects.
6. ADR-CANDIDATE: make model capability matrices a release artifact, not documentation only.
7. ADR-CANDIDATE: make unknown side-effect outcome a first-class state in all mutation APIs.
