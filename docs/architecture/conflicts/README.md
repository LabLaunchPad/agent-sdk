# M0 Architecture Conflict Register

**Status: `M0 IMPLEMENTATION: BLOCKED_PENDING_ARCHITECTURE_SIGNOFF`**

This register exists because the governing architecture handoff states:

> If implementation conflicts with an ADR: **STOP and report. Do not silently override.**

Design review of the locked architecture, plus distillation of six open-source agent runtimes,
surfaced **14 conflicts** between the locked ADRs and any coherent M0 implementation. **Two** are
confirmed security defects (001 and 009 — the count read "one" until 2026-08-22, inconsistent with
this file's own severity summary). Six are schema- or ABI-affecting and cannot be retrofitted once
code depends on them.

No runtime code exists in this repository and none may be written until these are signed off.

## Citation provenance

**This register's ADR citations were rewritten on 2026-08-22. They are not as originally authored.**

As first written, every conflict cited ADRs from a set numbered ADR-002 through ADR-089
(ADR-030 Policy Engine, ADR-048 Transaction Boundary, ADR-057 Cancellation, ADR-076 Device
Federation, and roughly twenty more). **None of those documents exist in this repository.** This
was verified by searching every branch and every commit in history; the only ADRs that exist are
`ADR/0001-` through `ADR/0016-`, on a different numbering scheme and largely a different subject
matter. The original set was presumably held outside version control and is not recoverable here.

Leaving unresolvable citations in place would let a conflict borrow authority from a document
nobody can open, which defeats the register's own evidence standard. So each **Affected ADR**
field now reads one of:

- **A real ADR link** where a genuine correspondence exists — five strong, two partial.
- **`UNVERIFIED`**, naming the original citation, where no counterpart exists. Those conflicts
  stand on their own restated premise, not on borrowed authority.

The remap changed two conflicts substantively, because the real ADR already decides part of
what the conflict asks for:

| Conflict | Real ADR | Effect |
|---|---|---|
| [009](CONFLICT-009-effect-class-taxonomy-mismatch.md) | [ADR-0013](../../../ADR/0013-security-at-policy-capability-boundary.md) | "Tool output is data, never authority" already locks the model-assertion rule. Only the **lattice** is open. |
| [010](CONFLICT-010-action-correlation-needs-two-ids.md) | [ADR-0009](../../../ADR/0009-protocol-application-agent-state-distinction.md) | "No adapter may treat a protocol identifier as a state primitive" already forbids `tool_call_id` as an ownership key. |

Full mapping, including the sixteen citations with no counterpart, is in
[`../../adr/amendments/README.md`](../../adr/amendments/README.md).

**Known dangling links, by design.** Every `../../../ADR/…` link above, and the reference to
`boundaries.json`, resolves only once PR #1 (`claude/agent-sdk-execution-context-h1lzv2`) merges
to `main` — that branch is where `ADR/0001–0016` and `boundaries.json` currently live, and it is
still a draft. The links are written against their post-merge location deliberately, so that
landing PR #1 fixes them all at once and no second editing pass is needed. Until then a link
checker will flag them, and that flag is expected rather than a defect.

Body text throughout the register still contains the original `ADR-0NN` numbers in phrases like
*"remapped from ADR-030"* and inside **Evidence** sections. Those are retained on purpose as a
historical record of what was cited; the authoritative citation is the **Affected ADR** field.

## Conventions

Each conflict is one file, `CONFLICT-0NN-<slug>.md`, carrying a fixed field set:

| Field | Meaning |
|---|---|
| Conflict ID | Stable identifier, referenced by the matching amendment |
| Affected ADR | The locked decision(s) in tension |
| Current Decision | What the ADR says today, quoted or closely paraphrased |
| Observed Design | What any coherent implementation actually needs to do |
| Contradiction | Precisely why the two cannot both hold |
| Security / Reliability / Compatibility Impact | What breaks, and how badly |
| Affected Schemas | Serialized shapes that change |
| Affected APIs / ABIs | Public surfaces that change |
| Affected Tests | Tests that cannot be written, or would assert something false |
| Downstream Dependencies | What later phases inherit the decision |
| Evidence | Sources, tagged FACT / INFERENCE / UNKNOWN |
| Recommended Resolution | Proposed fix — **not** authoritative until the amendment is locked |
| Alternatives Considered | Options rejected, with reasons |
| Migration Required | Whether resolving later costs a migration |
| Blocks Implementation | Whether kernel code may proceed without a decision |

## Tags

- `SECURITY-CRITICAL` — a defect with a security consequence, not merely a design wart
- `SCHEMA-AFFECTING` — changes a serialized shape; cheap now, a migration later
- `ABI-AFFECTING` — changes a plugin or binary interface
- `BLOCKING` — kernel implementation must not begin until decided
- `NON-BLOCKING` — may be decided in parallel with early implementation
- `DEFERRED` — deliberately postponed, with the trigger for revisiting stated

## Index

The **ADR** column cites real documents in [`ADR/`](../../../ADR/). `UNVERIFIED` means the
originally-cited ADR does not exist here — see [Citation provenance](#citation-provenance).

| # | Title | ADR | Tags |
|---|---|---|---|
| [001](CONFLICT-001-transform-privilege-escalation.md) | Policy TRANSFORM permits privilege escalation | [0013](../../../ADR/0013-security-at-policy-capability-boundary.md) | `SECURITY-CRITICAL` `BLOCKING` |
| [002](CONFLICT-002-cancellation-substate-unrepresentable.md) | Two state machines, only one enumerated | `UNVERIFIED` | `SCHEMA-AFFECTING` `BLOCKING` |
| [003](CONFLICT-003-phase-list-over-modelled.md) | The 12-phase run machine is over-modelled | `UNVERIFIED` | `SCHEMA-AFFECTING` `BLOCKING` |
| [004](CONFLICT-004-replay-is-two-operations.md) | "Replay" names two incompatible operations | `UNVERIFIED` | `SCHEMA-AFFECTING` `BLOCKING` |
| [005](CONFLICT-005-canonical-encoding-unspecified.md) | Canonical encoding unspecified but signing assumed | [0010](../../../ADR/0010-durability-checkpoint-boundary.md) | `SCHEMA-AFFECTING` `ABI-AFFECTING` `BLOCKING` |
| [006](CONFLICT-006-idempotency-vs-replay.md) | Idempotency keys defeat their own purpose under replay | [0011](../../../ADR/0011-unknown-outcome-side-effect-state.md) | `SCHEMA-AFFECTING` `BLOCKING` |
| [007](CONFLICT-007-plugin-abi-cannot-be-one-integer.md) | One `plugin_abi` integer cannot version eight plugin classes | [0012](../../../ADR/0012-workspace-sandbox-boundaries.md) *(partial)* | `ABI-AFFECTING` `BLOCKING` |
| [008](CONFLICT-008-environment-is-os-shaped.md) | `Environment` is OS-shaped but browser is a first-class target | `UNVERIFIED` | `SCHEMA-AFFECTING` `BLOCKING` |
| [009](CONFLICT-009-effect-class-taxonomy-mismatch.md) | Effect-class taxonomy mismatch defeats the no-widening invariant | [0013](../../../ADR/0013-security-at-policy-capability-boundary.md) *(half already decided)* | `SECURITY-CRITICAL` `SCHEMA-AFFECTING` `BLOCKING` |
| [010](CONFLICT-010-action-correlation-needs-two-ids.md) | Action correlation needs two identifiers, one is modelled | [0009](../../../ADR/0009-protocol-application-agent-state-distinction.md) *(core already decided)* | `SCHEMA-AFFECTING` `BLOCKING` |
| [011](CONFLICT-011-cancel-is-a-request-not-a-command.md) | Cancellation is modelled as a command but behaves as a request | `UNVERIFIED` | `SCHEMA-AFFECTING` `BLOCKING` |
| [012](CONFLICT-012-log-linearity-vs-tree.md) | Log linearity forecloses fork and rewind | `UNVERIFIED` | `SCHEMA-AFFECTING` |
| [013](CONFLICT-013-sqlite-vs-browser.md) | "Storage: SQLite" contradicts browser-first-class | [0006](../../../ADR/0006-persistence-interfaces-deferred.md) | `NON-BLOCKING` |
| [014](CONFLICT-014-no-global-state-vs-ecosystem.md) | "No hidden global state" read literally bans the ecosystem | `UNVERIFIED` | `NON-BLOCKING` |

## Severity summary

- **Security-critical:** 001, 009
- **Schema-affecting:** 002, 003, 004, 005, 006, 008, 009, 010, 011, 012
- **ABI-affecting:** 005, 007
- **Affect persisted state:** 004, 005, 006, 010, 011, 012
- **Blocking:** 001–011
- **Non-blocking:** 013, 014
- **Deferred:** log compaction (folded into 012's resolution rather than deferred — see that file)

## Evidence standard

Claims are tagged:

- **FACT** — documented in a primary source, URL cited
- **INFERENCE** — reasoned from source code or documentation, reasoning shown
- **UNKNOWN** — could not be verified; stated as such rather than guessed

Vendor marketing is not evidence. Where the locked handoff cites a product whose architecture is
not publicly documented, that is recorded explicitly rather than treated as precedent — see
[CONFLICT-012](CONFLICT-012-log-linearity-vs-tree.md) and the honesty note in
[`../M0.md`](../M0.md).
