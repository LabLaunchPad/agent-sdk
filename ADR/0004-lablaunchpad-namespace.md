---
type: Architecture Decision
title: LabLaunchPad npm Namespace
description: '@lablaunchpad/* is the canonical npm namespace for all published packages.'
generated:
  by: process:claude-code-session
  at: 2026-08-16T00:00:00Z
status: stable
---

# ADR-0004 — `@lablaunchpad/*` is the canonical npm namespace

| Field | Value |
| ----- | ----- |
| Phase | P00   |

## Context

Package names go into every `package.json`, every import statement and every
consumer's lockfile. Renaming a published package is a breaking migration, so
the namespace must be right before the first package ships.

LabLaunchPad is the owning organization. AgencyOS Platform is a separate product
that will consume this SDK, alongside future products. Naming SDK packages after
one consuming product would couple the SDK's identity to a product it must be
usable without.

## Decision

All packages are `@lablaunchpad/<name>`, where `<name>` describes the technical
capability — never a SaaS product, customer or vertical.

```
LabLaunchPad/agent-sdk          →  publishes @lablaunchpad/*
LabLaunchPad/agencyos-platform  →  consumes  @lablaunchpad/*
```

Do not use `@agencyos/*` or `@agent-sdk/*`. Package names are stable; renaming
is a breaking migration, not a cleanup.

`@lablaunchpad/agent-sdk` is reserved as the eventual public umbrella package.
It is created last, once the surfaces it would re-export are stable.

Enforced by `repository-policy-validator`.

## Adversarial review

**Attack:** the organization name is less recognizable than the product name, so
discoverability suffers.

**Failure modes:** the organization is renamed; the SDK is spun out; the npm
scope is unavailable at publication time.

**Falsifying experiment:** confirm scope availability before the first publish.
A scope conflict discovered at publish time is far cheaper to fix now than after
consumers exist.

## Alternatives considered

| Alternative    | Why rejected                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------- |
| `@agencyos/*`  | Couples SDK identity to one consuming product, blurring the boundary this repository must enforce |
| `@agent-sdk/*` | Generic scopes are commonly taken, and it signals no ownership                                    |

## Consequences

Easier: unambiguous ownership; the SDK/platform boundary is visible in every
import line.

Harder: nothing material. The umbrella package recovers ergonomics for consumers
who want a single install.

## Revisit trigger

Organization rename, or the scope proving unavailable on npm.
