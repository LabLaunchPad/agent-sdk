---
type: Dependency Map
title: Package Dependency Map
description: Compiled view of the layer manifest in boundaries.json
sources:
  - resource: /boundaries.json
    id: boundaries-json
generated:
  by: process:context-refresh
  at: 2026-08-16T20:19:22.800Z
status: stable
x_source_sha256: 36f893d59eacdcb11a7ab0d8fb6e06ad7932fd0a5345bf22b5068e021fdd2068
x_summary_version: 1.0.0
---

# Package Dependency Map

Compiled view of [`/boundaries.json`](/boundaries.json)[^boundaries-json].
`boundaries.json` is authoritative — regenerate this summary rather than
hand-editing it.

- **Layers**: contracts → core → composition → runtime → adapters → tooling
- **Direction**: outward only — a package may depend on a strictly lower layer
- **Materialized**:
  - `@lablaunchpad/contracts` — layer `contracts`
  - `@lablaunchpad/repo-tools` — layer `tooling`
- **Enforced by**: `package-boundary-validator`

[^boundaries-json]: boundaries.json, repository root.
