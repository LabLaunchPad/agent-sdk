---
type: Architecture Decision
title: Plugin ABI Scope
description: plugin_abi versions only the manifest schema and capability contract; per-class transports version themselves, and dlopen of Rust types is prohibited.
generated:
  by: process:claude-code-session
  at: 2026-08-22T00:00:00Z
status: draft
---

# AMD-007 — `plugin_abi` versions two things, and NATIVE is constrained

Resolves [CONFLICT-007](../../architecture/conflicts/CONFLICT-007-plugin-abi-cannot-be-one-integer.md).
Extends [ADR-0012](../../../ADR/0012-workspace-sandbox-boundaries.md).

| Field      | Value |
| ---------- | ----- |
| Phase      | P00   |
| Supersedes | —     |

## Context

A single `plugin_abi` integer was to version eight independent plugin classes. It cannot:
incrementing it because the WASM Component Model changed would invalidate every MCP plugin, which
is unaffected; declining to increment leaves WASM plugins unversioned. One number is asked to mean
eight things.

There is a second and more serious problem that was not addressed at all. **Dynamically loading a
NATIVE Rust plugin via `dlopen` is unsound.** Rust has no stable ABI: a plugin compiled with a
different rustc version — or the same version with different flags — has undefined memory layout
for every non-`repr(C)` type. There is no diagnostic. It manifests as memory corruption. With
NATIVE named as a first-class class and left unconstrained, the natural implementation is unsafe
by default.

ADR-0012 fixes the isolation *mechanism* as swappable (Docker, Firecracker, Wasmtime) but says
nothing about a plugin ABI, so this is a genuine gap rather than a mis-citation.

## Decision

1. **`plugin_abi: 1` versions exactly two things:** the **manifest schema**, and the **capability
   request/response/error contract**. These are genuinely common to all eight classes because they
   are *our* internal contract, not anyone else's wire format.
2. **Per-class transport bindings are separately versioned documents.** WASM binds via WIT; MCP
   negotiates its own version; HTTP/REMOTE/A2A version their own wire formats. The manifest
   records which binding a plugin uses **and that binding's version**, in its own field.
3. **NATIVE is constrained now, because it is manifest-affecting.** A NATIVE plugin is either a
   **subprocess communicating over IPC**, or a strict `extern "C"` boundary exchanging only
   `repr(C)` types. **`dlopen` of Rust types is prohibited.**

Point 3 must be decided before the manifest schema is written, since it determines what fields a
NATIVE plugin declares — a subprocess declares an executable and a protocol; an `extern "C"`
library declares a symbol and a header version. These are different manifests.

**M0 defines only the manifest schema and the capability contract. No plugin class is
implemented.** This is consistent with deferring the WASM boundary measurement: measuring a
transport before its binding exists would benchmark a placeholder.

## Adversarial review

**Attack:** splitting one integer into a version per binding multiplies the compatibility matrix
by eight. A host must now decide whether it supports (manifest v1, WIT v0.2) but not
(manifest v1, WIT v0.3), and that matrix is where real deployment pain lives — the single
integer's dishonesty at least kept the matrix small.

**Failure modes:** the matrix is never actually checked, and `plugin_abi: 1` becomes the only gate
anyone tests, restoring the original defect with extra ceremony. Or the `extern "C"` escape hatch
is used with types that are `repr(C)` at the boundary but contain non-`repr(C)` members, which is
just as unsound and much harder to spot.

**Falsifying experiment:** for the second — a lint or test asserting that every type crossing the
`extern "C"` boundary is transitively `repr(C)`. Shallow checking is insufficient and the test
must say so. For the matrix, the observable is whether any plugin is ever rejected for a binding
version mismatch; if none ever is, the per-binding versions are not being enforced.

## Alternatives considered

| Alternative | Why rejected |
| ----------- | ------------ |
| One `plugin_abi` for everything | Cannot express eight independent contracts; each increment invalidates unaffected classes |
| A version per class, no common integer | Loses the genuinely shared part — manifest schema and capability contract really are common |
| Allow `dlopen` with a rustc-version check | Version equality is necessary but not sufficient: build flags, feature unification and codegen options all change layout, and the check would give false confidence |
| Drop the NATIVE class entirely | Subprocess-over-IPC is a legitimate and safe NATIVE implementation; the class is fine, the loading mechanism was not |

## Consequences

**Easier:** each transport evolves at its own pace without invalidating the others. The unsound
loading path is closed before anyone writes it.

**Harder:** hosts must check a compatibility matrix rather than one integer. NATIVE plugin authors
lose in-process dynamic loading and pay IPC or `repr(C)` discipline.

**Foreclosed:** `dlopen` of Rust types. `plugin_abi` as a universal compatibility gate.

## Revisit trigger

Reopen if Rust gains a stable ABI, or if a `#[repr(Rust)]`-stable subset becomes specified and
tooling can verify it — that would reopen point 3 specifically, not the rest.

## Evidence

- **FACT** — Rust has no stable ABI; layout of non-`repr(C)` types is unspecified and may differ
  between compiler versions or builds. <https://doc.rust-lang.org/reference/type-layout.html>
- **FACT** — ADR-0012 makes the isolation mechanism swappable across Docker, Firecracker and
  Wasmtime, but does not address a plugin ABI.
  [`ADR/0012`](../../../ADR/0012-workspace-sandbox-boundaries.md)
- **FACT** — Wasmtime's WASI implementation denies TCP/UDP socket creation by default, evidence
  that a WASM host's security posture is a property of host configuration rather than of WASM
  itself. <https://github.com/bytecodealliance/wasmtime/releases>
- **INFERENCE** — WASM is therefore not "automatically secure"; the security model remains
  manifest + capability grant + policy + sandbox + resource limits + host enforcement, and the ABI
  decision above is independent of it.
- **UNKNOWN** — Which of the eight plugin classes are actually wanted. Deciding the manifest schema
  does not require the answer, which is why this can proceed while that stays open.
