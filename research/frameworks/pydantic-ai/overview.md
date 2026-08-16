---
type: Framework Research
title: PydanticAI
description: Durable-execution capability pattern and licensing for PydanticAI
sources:
  - resource: https://pydantic.dev/docs/ai/integrations/durable_execution/overview/
    id: pai-durable
  - resource: https://pydantic.dev/docs/ai/capabilities/durable_execution/temporal/
    id: pai-temporal
  - resource: https://github.com/pydantic/pydantic-ai/blob/main/LICENSE
    id: pai-license
generated:
  by: process:claude-code-session
  at: 2026-08-16T00:00:00Z
status: draft
x_evidence_level: E3
x_coverage: partial
---

# PydanticAI

> **Coverage note.** This installment covers the durable-execution
> capability pattern and licensing. Local-first posture and full built-in
> capability inventory not yet researched.

## Licensing [E3]

MIT License, copyright Pydantic Services Inc., 2024–present.[^pai-license]
Permissive.

## Durable execution architecture [E3, pai-durable]

**Correction to the plan's framing**: the original research brief describes
this as "a public interface that can be backed by multiple durable
runtimes." Direct evidence shows it is more precisely a
**capability-attachment model**, not a single abstract interface every
backend implements identically:

> "The Temporal, DBOS, and Prefect integrations ship with Pydantic AI as
> capabilities you attach to an agent."

Four backends are supported: Temporal, DBOS, Prefect, and Restate. Restate's
integration is architecturally different from the other three — it "lives
in the Restate SDK and builds only on Pydantic AI's public interface, so it
can also serve as a reference for integrating with other durable systems."
This implies Temporal/DBOS/Prefect are integrated _by_ PydanticAI as
first-party capabilities, while Restate integrates _against_ PydanticAI's
public interface from the outside — two different integration postures
under one marketing narrative of "four durable execution solutions."

Documented cross-backend behavioural difference: **runtime swapping is not
uniform**. "Temporal rejects it, while DBOS and Prefect register durable
units at first use and are looser." This is a real, documented
inconsistency in the "swap the backend, keep the semantics" promise — worth
recording as a caveat, not glossed over.

An explicit gap is under discussion upstream: issue #5477 requests a
"first-class `RuntimeCapability` extension point for durable execution
(post-v2)" — i.e., PydanticAI's own maintainers consider the current
multi-backend story not yet a clean, extensible abstraction. This is strong
evidence _for_ the adapter-pattern goal (a genuine `RuntimeAdapter`
interface is valuable) and _against_ assuming PydanticAI has already solved
it cleanly.

## LabLaunchPad extraction

| Pattern                                                                                 | Adopt / Adapt / Reject    | Rationale                                                                                                                                                                                                                        |
| --------------------------------------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Durable execution as an attachable capability, not a hard-wired orchestrator            | **ADOPT** (pattern only)  | Matches `docs/architecture/DEPENDENCY-DIRECTION.md`'s adapters layer — runtime specifics stay out of core                                                                                                                        |
| Assuming backend-swap is semantically uniform                                           | **REJECT the assumption** | Directly falsified by Temporal-vs-DBOS/Prefect runtime-swap behaviour difference — our own `RuntimeAdapter` conformance tests (Phase 17) must test swap behaviour explicitly, not just steady-state execution, per this evidence |
| Waiting for a "first-class RuntimeCapability interface" pattern before building our own | **ADAPT**                 | PydanticAI's own open issue confirms this is unsolved even in a mature ecosystem — we should design our `RuntimeAdapter` contract deliberately in Phase 17 rather than assuming a reference implementation exists to copy        |

## Open questions

- Local-first / offline model support — not yet researched for this
  framework specifically.
- Full capability catalog (tools, memory) — not yet researched.
