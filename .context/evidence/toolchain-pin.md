---
type: Evidence Record
title: TypeScript Version Pin
description: Evidence backing the TypeScript 6.0.3 pin and the TYPESCRIPT_7_REVISIT gate
sources:
  - resource: /ADR/0003-typescript-version-pin.md
    id: adr-0003
generated:
  by: process:context-refresh
  at: 2026-08-16T20:52:53.307Z
status: stable
stale_after: 2026-11-16
x_source_sha256: 45d63dd9aabdae648ea3a41ba3255ad866ec2de9c0dedd89d2c8e3cbd687f8f2
x_summary_version: 1.0.0
---

# TypeScript Version Pin

Compiled summary of [ADR-0003](/ADR/0003-typescript-version-pin.md)[^adr-0003].

- **Pinned**: `typescript@6.0.3`
- **Latest available**: `7.0.2`
- **Blocker**: `typescript-eslint` peer range `>=4.8.4 <6.1.0`
- **Gate**: `TYPESCRIPT_7_REVISIT`
- **Overrides prohibited**: yes — do not force TS 7 with dependency overrides

`stale_after` is set three months out: `typescript-eslint`'s peer range is the
kind of fact that can change without anyone in this repository noticing, so
this record is due for a fresh registry query even if nothing here edited it.

[^adr-0003]: ADR/0003-typescript-version-pin.md.
