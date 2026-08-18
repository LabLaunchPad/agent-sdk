---
type: Contradiction
title: A Framework's Root LICENSE File Governs the Whole Codebase
description: Counterexample to the assumption that checking one top-level LICENSE file is sufficient due diligence for a framework's licensing status
sources:
  - resource: /research/frameworks/langgraph/overview.md
    id: langgraph-overview
  - resource: /research/frameworks/mastra/overview.md
    id: mastra-overview
generated:
  by: process:claude-code-session
  at: 2026-08-17T00:00:00Z
status: draft
---

# Contradiction: "The root LICENSE file governs the whole framework"

## Claim under test

This repository's own `research/licensing/MATRIX.md` (installments 1-2)
recorded one license per framework by fetching and quoting a single root
`LICENSE` file, implicitly treating that as sufficient evidence for the
framework's licensing status as a whole — a reasonable-looking shortcut,
since it is exactly what installments 1-2 did for all six frameworks
researched so far.

## Counterexample

Two independent frameworks researched in installment 3 both split their
license by directory:

- **LangGraph**: `langgraph`, `langchain-core`, and model-integration
  packages are MIT. `langgraph-api` — the deployment server component — is
  **Elastic License 2.0**, a source-available license with commercial-use
  restrictions distinct from MIT's permissions.
- **Mastra**: the core framework and "the vast majority of the codebase" is
  Apache-2.0. Code under `ee/` directories (e.g.
  `packages/core/src/auth/ee/`) is **Mastra Enterprise License**, not
  Apache-2.0.

Neither split is hidden or unusual — both are documented by the respective
projects — but neither is discoverable from the root `LICENSE` file alone.

## Result

The claim as stated is **FALSE** as a general assumption, confirmed twice
independently in one installment. A root `LICENSE` file establishes the
license for the files it actually governs (typically the core library) —
it is not evidence for every directory or package in the repository,
especially server/deployment/enterprise components that are commonly kept
separate specifically because they carry different commercial terms.

## Change required

`research/licensing/MATRIX.md`'s existing six rows (installments 1-2) were
recorded from a single root LICENSE fetch each — **not retroactively wrong**
(no counter-evidence found for those six), but the methodology itself was
incomplete and should not be repeated uncritically. Future installments'
licensing rows should note explicitly whether server/deployment/enterprise
subdirectories were checked, not just the root license — add a
`whole_tree_checked: yes/no/partial` field to future licensing matrix rows
rather than a single license-name cell.

## Test required

Not a runtime test — a process requirement. Before any pattern is promoted
from `CANDIDATE` to `ADOPTED` and any actual code (not just pattern
knowledge) is considered for reuse from an external framework, the specific
file/directory being referenced must have its own license checked, not
inherited from the framework's root LICENSE. This is a documentation/review
gate, to be enforced whenever LabLaunchPad's own dependency-review process
is formalized (not yet a phase on the roadmap).
