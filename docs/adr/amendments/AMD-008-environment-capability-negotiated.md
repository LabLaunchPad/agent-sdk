---
type: Architecture Decision
title: Capability-Negotiated Environment
description: Environment is a capability set, limits and network posture; concrete OS facilities are derived by platform hosts, not modelled in core.
generated:
  by: process:claude-code-session
  at: 2026-08-22T00:00:00Z
status: draft
---

# AMD-008 — Capabilities are primary; concrete facilities are derived

Resolves [CONFLICT-008](../../architecture/conflicts/CONFLICT-008-environment-is-os-shaped.md).
**Requires [AMD-005](AMD-005-canonical-encoding.md)** — the fingerprint is a digest.

| Field      | Value |
| ---------- | ----- |
| Phase      | P00   |
| Supersedes | —     |

## Context

`Environment` was modelled OS-shaped — operating system, filesystem, processes — while the browser
is claimed as a first-class target. Three forces collide:

- On a first-class browser target most of an OS-shaped type is permanently absent, so the type
  would be mostly `None` on a platform the architecture claims to support fully.
- *Populating* OS fields requires `std::env`, `sysinfo` or equivalent — exactly the platform
  dependencies a portable core is forbidden to have. The type could be defined in core but never
  filled there, making the "first-class object" hollow.
- Internally, listing `Capabilities` *alongside* OS/Filesystem/Processes implies the concrete
  facilities are primary. On a partial platform only the capability list is meaningful.

## Decision

Invert the model.

```
Environment {
    platform:     PlatformClass,          // Native{os,arch} | Browser | Wasi | Remote
    capabilities: OrderedSet<CapabilityId>,
    limits:       ResourceLimits,
    network:      NetworkAccess,          // Offline | Restricted{..} | Full
    fingerprint:  Digest,
}
```

- **Zero probing in core.** A Platform Host port populates it; the core only consumes it.
- **Total across platforms.** A browser environment is not a degraded native one; it is an
  environment with a different capability set.
- **Meaningful fingerprint.** Hashing a capability set and limits detects real drift — a run
  resumed into an environment that lost a capability is a genuine hazard, and this makes it
  detectable rather than latent.

`OrderedSet` is not incidental: the fingerprint is a digest under AMD-005, which bans
hash-ordered collections from serialized types. An unordered capability set would produce an
unstable fingerprint.

**Environment observations are versioned and timestamped.** An environment is observed, not known,
and an observation has an age.

## Adversarial review

**Attack:** a capability set is a flat list of identifiers with no structure, so it cannot express
things an OS-shaped type could — "writable filesystem, but only under `/tmp`, and only 2 GB". The
model is total across platforms by being vague on all of them.

**Failure modes:** capability identifiers accrete parameters as strings (`fs.write:/tmp:2GB`) and
become an unparsed sub-language. Or `limits` grows into the OS-shaped struct this amendment
removed, arriving at the same place by another route.

**Falsifying experiment:** attempt to express the three most complex real environments — a
sandboxed container, a browser tab with OPFS, and a remote worker — using only
`capabilities` + `limits`. If any requires a capability identifier with embedded structure, the
model needs parameterized capabilities and this amendment is incomplete as written. This is a
design exercise that can be run before any code, and should be, because the answer changes the
schema.

## Alternatives considered

| Alternative | Why rejected |
| ----------- | ------------ |
| Keep `Environment` OS-shaped | Mostly `None` on browser; requires platform dependencies in core to populate |
| OS-shaped with a browser variant | Two types that must be kept in sync, and every consumer branches on which it got |
| Drop `Environment` as a first-class object | Loses drift detection on resume, which is a real correctness property, not a convenience |
| Unordered capability set | Produces an unstable fingerprint under AMD-005's ordering rule |

## Consequences

**Easier:** the portable core has no platform dependency and stays honest about it. Browser and
native are peers. Drift on resume becomes detectable via one digest comparison.

**Harder:** every platform host must enumerate capabilities accurately — under-reporting silently
disables features, over-reporting produces runtime failures the type system said were impossible.

**Foreclosed:** probing the environment from core. Treating browser as degraded native.

## Revisit trigger

Reopen when a capability needs parameters that do not fit `limits` — see the falsifying
experiment; that is the specific, observable condition, and the exercise above is designed to
surface it before rather than after the schema is frozen.

## Evidence

- **FACT** — ADR-0001 commits to a runtime surface spanning "local desktop, browser, Node,
  edge/worker runtimes", which is what makes browser-as-first-class binding rather than aspirational.
  [`ADR/0001`](../../../ADR/0001-typescript-canonical-language.md)
- **FACT** — The browser's storage story carries constraints native does not (OPFS needs
  `SharedArrayBuffer` and COOP/COEP headers; platform cleanup can clear data), so "has durable
  storage" is genuinely a per-environment capability rather than an assumption.
  <https://sqlite.org/wasm/doc/trunk/persistence.md>
- **INFERENCE** — A type that is mostly absent on a supported platform is evidence the type is
  modelled at the wrong level. Capability sets are total where facility lists are not.
- **UNKNOWN** — Whether capabilities need parameters. This is the load-bearing open question and
  the falsifying experiment is designed to answer it.
