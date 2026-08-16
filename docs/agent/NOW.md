# NOW

The single current objective. If you are working on something not described
here, stop and reconcile before continuing.

## Phase

**P00 — Foundation + Working Toolchain Only**

## Objective

Establish the engineering substrate and anti-drift machinery for the Agent SDK,
prove the red/green loop on a placeholder package, and stop.

Phase 0 proves the engineering environment. Phase 1 proves the architecture.
Only Phase 2+ implements it.

## In scope

Repository structure, governance documents, the `.context` compiled cache, the
root toolchain, one placeholder package, the five validators with negative
fixtures, templates, seed ADRs, and CI.

## Out of scope

Any Agent SDK product behaviour: Agent, Task engine, Planner, Harness,
Workflow, Memory, Context compiler, Runtime, Model gateway, MCP/A2A, Fast Path.
Also out of scope: Phase 1 ecosystem research.

## Definition of done

Every exit criterion in the Phase 0 receipt passes, the receipt is emitted, and
work stops. Not "the build is green".

**Status: met.** See [`RECEIPT-P00.md`](RECEIPT-P00.md). The only open item is CI
confirmation on the pull request. Phase 1 has not started.
