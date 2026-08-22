# CONFLICT-008 — `Environment` is OS-shaped but browser is a first-class target

**Tags:** `SCHEMA-AFFECTING` `BLOCKING`
**Affected ADR:** ADR-010 (Environment as First-Class Object), ADR-003 (WASM Strategy), ADR-002 (Runtime Model)

## Current Decision

ADR-010 makes `Environment` a first-class object and enumerates its contents:

```
OS  Architecture  Filesystem  Network  Browser  Applications  Processes
Device  Display  Credentials  Workspace  Capabilities  Limits
Connectivity  Power  Resource pressure
```

ADR-003 declares WASM a first-class target. ADR-002 requires that core domain logic carry no
platform dependency.

## Observed Design

A browser has no OS, no filesystem, no process table, no display enumeration and no way to
observe resource pressure. A bare-metal or WASI target has a different and equally partial
subset.

## Contradiction

Three ADRs cannot all hold with an OS-shaped `Environment`:

- **Against ADR-003.** If `Environment` is OS-shaped, then on a first-class target most of it is
  permanently absent. The type would be mostly `Option::None` on a platform the architecture
  claims to support fully.
- **Against ADR-002.** *Populating* OS fields requires `std::env`, `sysinfo` or equivalent —
  exactly the platform dependencies the core is forbidden to have. The type could be defined in
  core but never filled there, which makes the "first-class object" a hollow one.
- **Internally.** ADR-010 lists `Capabilities` *alongside* OS/Filesystem/Processes, implying the
  concrete facilities are primary and capabilities secondary. But on a partial platform only the
  capability list is meaningful.

## Security / Reliability / Compatibility Impact

**Security — moderate.** `Environment` feeds policy decisions (ADR-030 lists environment as a
policy dimension). A type whose fields are absent on some platforms produces policy rules that
silently fail open or closed depending on how absence is treated — and neither default is safe
across all platforms.

**Reliability — moderate.** ADR-009 records an environment fingerprint in checkpoints for drift
detection (ADR-050). A fingerprint over mostly-absent fields detects nothing.

**Compatibility — high.** `Environment` is embedded in checkpoint events.

## Affected Schemas

- `Environment` itself
- The checkpoint event's environment fingerprint
- Policy context, which carries the environment

## Affected APIs / ABIs

- The Platform Host port that populates `Environment`
- Policy rule matchers that test environment properties

## Affected Tests

- `environment_fingerprint_is_stable_across_processes`
- `policy_denies_network_capability_in_offline_environment`
- `core_compiles_for_wasm32_with_environment_type` — currently would fail if the type requires OS
  probing

## Downstream Dependencies

ADR-050 (Environment Drift) compares expected against current environment before continuing long
tasks. ADR-058/059 (mobile, browser architecture) depend on partial environments being
first-class rather than degraded.

## Evidence

- **FACT** — Rust's `wasm32-unknown-unknown` target has no filesystem, no process API and no
  environment variables in std; `std::fs` and `std::process` are unavailable or stubbed.
  <https://doc.rust-lang.org/rustc/platform-support.html>
- **FACT** — The OpenAI Agents SDK models its execution environment as a *sandbox manifest*
  describing workspace, ports and command history — a declared descriptor rather than a probed
  machine profile. <https://developers.openai.com/api/docs/guides/agents/sandboxes>
- **FACT** — OpenHands v1 exposes `LocalWorkspace` / `DockerWorkspace` / `RemoteAPIWorkspace`
  behind one abstraction, with the same agent code running against any of them.
  <https://docs.openhands.dev/sdk/arch/overview>
- **INFERENCE** — Both reference systems describe the environment by *what it affords* rather
  than by *what hardware it is*, which is the capability-negotiated shape recommended below.

## Recommended Resolution

Invert the model: capabilities are primary, concrete facilities are derived. Proposed, not locked
— see [`../../adr/amendments/AMD-008-environment-capability-negotiated.md`](../../adr/amendments/AMD-008-environment-capability-negotiated.md).

```
Environment {
    platform:     PlatformClass,          // Native{os,arch} | Browser | Wasi | Remote
    capabilities: OrderedSet<CapabilityId>,
    limits:       ResourceLimits,
    network:      NetworkAccess,          // Offline | Restricted{..} | Full
    fingerprint:  Digest,
}
```

Properties:

- **Zero probing in core.** A Platform Host port populates it; the core only consumes it. ADR-002
  is satisfied.
- **Total across platforms.** A browser environment is not a degraded native one; it is an
  environment with a different capability set. ADR-003 is satisfied.
- **Meaningful fingerprint.** Hashing a capability set and limits detects real drift.
- **Policy-usable.** Rules test capability presence and network posture, which exist everywhere.

OS and architecture remain available inside `PlatformClass::Native` for the platforms that have
them, so no information is lost where it exists.

## Alternatives Considered

- **OS-shaped struct with `Option` everywhere.** Rejected: every consumer must handle absence,
  and policy rules acquire a silent fail-open/fail-closed choice at each field.
- **Per-platform `Environment` types.** Rejected: makes `Environment` non-portable, so it cannot
  live in core or be embedded in a portable checkpoint.
- **Probe lazily via a trait.** Rejected: makes `Environment` non-serializable and therefore
  unusable as a checkpoint fingerprint.

## Migration Required

**Yes if deferred.** `Environment` is embedded in checkpoint events.

## Blocks Implementation

**Yes.** It is a domain-crate type that policy, checkpointing and drift detection all consume.
