# CONFLICT-010 — Action correlation needs two identifiers, one is modelled

**Tags:** `SCHEMA-AFFECTING` `BLOCKING`
**Affected ADR:** ADR-054 (Agent Communication), ADR-008 (Event Sourcing), ADR-071 (Trace Context)

## Current Decision

ADR-008 enumerates the event vocabulary, including `CapabilityRequested`, `ToolStarted`,
`ToolCompleted` and `ObservationReceived`. ADR-071 defines the trace context as
`organization_id / team_id / employee_id / task_id / run_id / worker_id / span_id`.

Neither ADR distinguishes an identifier that *we* mint from one supplied by a model provider.

## Observed Design

Two independent identity needs exist for a single capability invocation:

1. **Ownership / lifecycle.** The kernel needs a key for its in-flight registry, for cancellation
   targeting, for timeout attribution and for correlating a completion back to its request.
2. **Protocol correlation.** A model provider that emits tool calls supplies its own identifier,
   which must be echoed back in the response for the provider's protocol to work.

## Contradiction

The current event vocabulary implies one identifier serving both roles. That fails because the
provider-supplied identifier is **not guaranteed unique outside the provider's own turn**. Two
concurrent runs, or a parent run and a subagent, can legitimately receive the same
`tool_call_id` from the provider. If that identifier is also the kernel's ownership key, then:

- cancelling one run can cancel an unrelated run's in-flight operation
- a completion can be attributed to the wrong request
- a registry keyed on it silently collides

Conversely, if only an internally-minted identifier exists, the provider protocol cannot be
satisfied, because the response must carry the provider's own identifier.

A related gap sits in the same area. If a policy denial produces *no* observation event, the fold
sees a `CapabilityRequested` with no terminating event — a dangling action. Any consumer
reconstructing a model-visible view must then repair the log at read time, which is both a
correctness hazard and a place where the log stops being self-describing.

## Security / Reliability / Compatibility Impact

**Security — moderate.** Cross-run cancellation via a colliding identifier is an availability
defect reachable by an untrusted party who can influence tool-call identifiers.

**Reliability — high.** Misattributed completions corrupt run state in a way the fold cannot
detect, because the resulting log is internally well-formed.

**Compatibility — high.** Adding a second identifier to the event payloads later is a schema
change to the most numerous event types in the system.

## Affected Schemas

- `CapabilityRequested`, `ToolStarted`, `ToolCompleted`, `ObservationReceived`
- Any denial/rejection event

## Affected APIs / ABIs

- The capability invocation contract and therefore the plugin ABI
- The cancellation API's targeting parameter

## Affected Tests

- `two_runs_sharing_a_provider_tool_call_id_do_not_cross_cancel`
- `completion_is_attributed_to_the_correct_request`
- `fold_over_a_log_containing_a_denied_action_has_no_dangling_action`

## Downstream Dependencies

Phase 5 (multi-agent, handoffs, delegation) multiplies this: subagents receive tool calls from
the same provider and would collide immediately. ADR-027's Handoff object needs an unambiguous
ownership key.

## Evidence

- **FACT** — OpenHands' `ObservationEvent` carries `action_id` ("The action id that this
  observation is responding to") *alongside* `tool_call_id` and `tool_name`. Its `ActionEvent`
  additionally carries `llm_response_id` grouping actions emitted from one model response.
  <https://github.com/OpenHands/software-agent-sdk>
  (`openhands-sdk/openhands/sdk/event/llm_convertible/observation.py`)
- **FACT** — DeerFlow states the rule explicitly and gives the reason verbatim: the provider
  `tool_call_id` "remains the correlation key" for messages, SSE events and frontend cards, while
  a server-minted `execution_id` is used for "the process-wide registry, polling, cancellation,
  timeout handling, and cleanup", because provider IDs "are not globally unique across parent
  runs, so they must never become registry ownership keys."
  <https://github.com/bytedance/deer-flow/blob/main/backend/AGENTS.md>
- **FACT** — OpenHands models rejection as a *sibling observation type*,
  `UserRejectObservation`, carrying `rejection_reason` and `rejection_source` (`"user"` for
  confirmation-mode, `"hook"` for a blocked tool call) — not as an absent observation.
- **FACT** — OpenHands additionally needs a view-time repair pass (`enforce_properties`) that
  drops unmatched action/observation pairs, because such pairs violate downstream API invariants.
- **INFERENCE** — That repair pass is evidence for enforcing the invariant at *append* time
  instead: if denial is an observation variant, the pairing invariant holds by construction and
  no repair is needed.

## Recommended Resolution

Model both identifiers, and make denial an observation. Proposed, not locked — see
[`../../adr/amendments/AMD-010-dual-action-identity.md`](../../adr/amendments/AMD-010-dual-action-identity.md).

1. **`action_id`** — minted by the kernel. The sole key for the in-flight registry, cancellation
   targeting, timeout attribution and request/completion correlation. Never supplied externally.
2. **`tool_call_id`** — optional, provider-supplied, carried for protocol echo only. **Explicitly
   forbidden as an ownership or registry key.**
3. **Denial is an observation variant** carrying a reason and a source (policy / human / hook), so
   every `CapabilityRequested` has exactly one terminating observation and the fold never sees a
   dangling action.

Adopt `llm_response_id` as well, grouping actions emitted from a single model response — needed
later for batched tool calls and free to reserve now.

## Alternatives Considered

- **One identifier, namespaced by run.** Rejected: it works for the parent-run collision but not
  for the subagent case, and it silently changes the value echoed to the provider, breaking the
  protocol.
- **One identifier, minted by us, provider ID discarded.** Rejected: the provider protocol
  requires the echo.
- **Denial as an absent observation, repaired at fold time.** Rejected on the evidence: the one
  project that did this had to build a repair pass. Enforcing at append time is strictly cheaper.

## Migration Required

**Yes if deferred.** These are the highest-cardinality events in the log.

## Blocks Implementation

**Yes.** It is the shape of the core capability event chain.
