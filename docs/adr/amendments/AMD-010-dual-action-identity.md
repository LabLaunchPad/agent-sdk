---
type: Architecture Decision
title: Dual Action Identity
description: A kernel-minted action_id is the sole ownership key; tool_call_id is protocol echo only, and denial is an observation.
generated:
  by: process:claude-code-session
  at: 2026-08-22T00:00:00Z
status: draft
---

# AMD-010 — Two identifiers, one owner; denial is an observation

Resolves [CONFLICT-010](../../architecture/conflicts/CONFLICT-010-action-correlation-needs-two-ids.md).
Applies [ADR-0009](../../../ADR/0009-protocol-application-agent-state-distinction.md).

| Field      | Value |
| ---------- | ----- |
| Phase      | P00   |
| Supersedes | —     |

## Context

The event vocabulary implies one identifier serving two roles: correlating a request with its
completion, and keying the kernel's in-flight registry. That fails because a provider-supplied
identifier is **not guaranteed unique outside the provider's own turn**. Two concurrent runs, or
a parent and a subagent, can legitimately receive the same `tool_call_id`. If that is also the
ownership key, then cancelling one run can cancel an unrelated run's in-flight operation, a
completion can be attributed to the wrong request, and a registry keyed on it silently collides.

Conversely, if only an internally-minted identifier exists, the provider protocol cannot be
satisfied, because the response must carry the provider's own identifier.

**ADR-0009 already decides this.** Its rule — *"no adapter may treat a protocol/application-layer
identifier as if it were LabLaunchPad's own state primitive"* — forbids exactly the collision
above. `tool_call_id` is a server-minted opaque identifier, which is ADR-0009's "application
state" category verbatim. This amendment therefore **applies an existing decision** and adds the
one thing ADR-0009 does not supply: what the kernel-side identifier is, and what happens on denial.

## Decision

1. **`action_id`** — minted by the kernel. The **sole** key for the in-flight registry,
   cancellation targeting, timeout attribution, and request/completion correlation. Never supplied
   externally.
2. **`tool_call_id`** — optional, provider-supplied, carried for protocol echo only. **Explicitly
   forbidden as an ownership or registry key**, per ADR-0009.
3. **Denial is an observation variant**, carrying a reason and a source (policy / human / hook), so
   every `CapabilityRequested` has exactly one terminating observation and the fold never sees a
   dangling action.
4. **`llm_response_id`** groups actions emitted from a single model response. Needed later for
   batched tool calls; free to reserve now.

Point 3 is not a convenience. Without it, a policy denial leaves a `CapabilityRequested` with no
terminating event, and any consumer reconstructing a model-visible view must **repair the log at
read time** — which is both a correctness hazard and the point at which the log stops being
self-describing.

Enforce the pairing **at append time, not read time**: appending a `CapabilityRequested` without
an eventual terminating observation is a kernel invariant violation, detectable in the store
rather than left for each reader to notice.

## Adversarial review

**Attack:** `llm_response_id` is reserved for a feature that does not exist, and points 1–2 are
just ADR-0009 restated. The genuinely new content is point 3, which could have been a smaller
change.

**Failure modes:** `tool_call_id` leaks into a lookup somewhere despite the prohibition — most
likely in an adapter, where the provider's identifier is the natural handle and the kernel's is
not in scope. The rule holds in the kernel and is violated at the edge.

**Falsifying experiment:** `duplicate_tool_call_id_across_runs_does_not_collide` — run two
concurrent runs whose provider stub returns an identical `tool_call_id`, and assert both complete
independently. This is the test that would actually have caught the original defect, and it must
run against the adapter layer, not only the kernel.

## Alternatives considered

| Alternative | Why rejected |
| ----------- | ------------ |
| One identifier, provider-supplied | Collides across concurrent runs and subagents; violates ADR-0009 |
| One identifier, kernel-minted | Cannot satisfy provider protocols, which require their own identifier echoed back |
| Namespace the provider id by run (`run_id + tool_call_id`) | Works for correlation but still makes kernel ownership depend on a provider's uniqueness semantics, which ADR-0009 forbids on principle |
| Let denial produce no event | Leaves dangling actions; forces read-time log repair |

## Consequences

**Easier:** cancellation and timeout targeting become unambiguous. The fold is total — every
request has a terminating observation — so consumers need no repair logic.

**Harder:** adapters carry two identifiers and must not confuse them. Every denial path must
append an event, including paths that previously just returned an error.

**Foreclosed:** `tool_call_id` as a registry key, anywhere, including in adapters.

## Revisit trigger

Reopen if a provider protocol requires the kernel to *accept* an externally-minted identifier as
authoritative for correlation — that would put the protocol in direct conflict with ADR-0009 and
would need escalation rather than a local fix.

## Evidence

- **FACT** — ADR-0009 requires adapters to treat protocol state, application state (server-minted
  opaque identifiers, explicitly including an MCP task handle and an A2A `contextId`) and agent
  state as three non-interchangeable layers.
  [`ADR/0009`](../../../ADR/0009-protocol-application-agent-state-distinction.md)
- **INFERENCE** — `tool_call_id` is a server-minted opaque identifier and therefore falls in
  ADR-0009's application-state category, so its prohibition as an ownership key follows from an
  existing decision rather than requiring a new one.
- **UNKNOWN** — Whether any target provider protocol requires accepting an external identifier as
  authoritative. Not surveyed; recorded as the revisit trigger.
