# M0 Architecture Conflict Register

**Status: `M0 IMPLEMENTATION: BLOCKED_PENDING_ARCHITECTURE_SIGNOFF`**

This register exists because the governing architecture handoff states:

> If implementation conflicts with an ADR: **STOP and report. Do not silently override.**

Design review of the locked architecture, plus distillation of six open-source agent runtimes,
surfaced **14 conflicts** between the locked ADRs and any coherent M0 implementation. One is a
confirmed security defect. Six are schema- or ABI-affecting and cannot be retrofitted once code
depends on them.

No runtime code exists in this repository and none may be written until these are signed off.

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

| # | Title | ADR | Tags |
|---|---|---|---|
| [001](CONFLICT-001-transform-privilege-escalation.md) | Policy TRANSFORM permits privilege escalation | 030, 031 | `SECURITY-CRITICAL` `BLOCKING` |
| [002](CONFLICT-002-cancellation-substate-unrepresentable.md) | Two state machines, only one enumerated | 007, 057 | `SCHEMA-AFFECTING` `BLOCKING` |
| [003](CONFLICT-003-phase-list-over-modelled.md) | The 12-phase run machine is over-modelled | 007 | `SCHEMA-AFFECTING` `BLOCKING` |
| [004](CONFLICT-004-replay-is-two-operations.md) | "Replay" names two incompatible operations | 008, 046 | `SCHEMA-AFFECTING` `BLOCKING` |
| [005](CONFLICT-005-canonical-encoding-unspecified.md) | Canonical encoding unspecified but signing assumed | 009, 075 | `SCHEMA-AFFECTING` `ABI-AFFECTING` `BLOCKING` |
| [006](CONFLICT-006-idempotency-vs-replay.md) | Idempotency keys defeat their own purpose under replay | 047 | `SCHEMA-AFFECTING` `BLOCKING` |
| [007](CONFLICT-007-plugin-abi-cannot-be-one-integer.md) | One `plugin_abi` integer cannot version eight plugin classes | 004, 080 | `ABI-AFFECTING` `BLOCKING` |
| [008](CONFLICT-008-environment-is-os-shaped.md) | `Environment` is OS-shaped but browser is a first-class target | 010, 003 | `SCHEMA-AFFECTING` `BLOCKING` |
| [009](CONFLICT-009-effect-class-taxonomy-mismatch.md) | Effect-class taxonomy mismatch defeats the no-widening invariant | 048 | `SECURITY-CRITICAL` `SCHEMA-AFFECTING` `BLOCKING` |
| [010](CONFLICT-010-action-correlation-needs-two-ids.md) | Action correlation needs two identifiers, one is modelled | 054, 008 | `SCHEMA-AFFECTING` `BLOCKING` |
| [011](CONFLICT-011-cancel-is-a-request-not-a-command.md) | Cancellation is modelled as a command but behaves as a request | 057 | `SCHEMA-AFFECTING` `BLOCKING` |
| [012](CONFLICT-012-log-linearity-vs-tree.md) | Log linearity forecloses fork and rewind | 008, 009 | `SCHEMA-AFFECTING` |
| [013](CONFLICT-013-sqlite-vs-browser.md) | "Storage: SQLite" contradicts browser-first-class | 072, 003 | `NON-BLOCKING` |
| [014](CONFLICT-014-no-global-state-vs-ecosystem.md) | "No hidden global state" read literally bans the ecosystem | 082 | `NON-BLOCKING` |

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
