# Naming conventions

Enforced by `repository-policy-validator` where marked **[checked]**.

## Packages

- **[checked]** Every package name is `@lablaunchpad/<name>`. No other scope.
- `<name>` is lowercase, hyphen-separated, and describes the technical
  capability — never a SaaS product, customer or vertical.
- Names are stable. Renaming a published package is a breaking migration, not a
  cleanup.
- Directory basename matches the unscoped package name
  (`packages/contracts` ↔ `@lablaunchpad/contracts`).

## Files

- **[checked]** TypeScript sources are `kebab-case.ts`.
- Tests carry a taxonomy suffix: `*.unit.test.ts`, `*.contract.test.ts`,
  `*.integration.test.ts`, `*.adversarial.test.ts`, `*.portability.test.ts`.
  See [`TEST-TAXONOMY.md`](TEST-TAXONOMY.md).
- Benchmarks are `*.bench.ts`.
- Markdown documents are `SCREAMING-KEBAB-CASE.md`; directory indexes are
  `README.md`.
- ADRs are `NNNN-kebab-summary.md`, zero-padded to four digits.

## Code

| Kind                       | Convention                         |
| -------------------------- | ---------------------------------- |
| Types, interfaces, classes | `PascalCase`                       |
| Functions, variables       | `camelCase`                        |
| Constants                  | `SCREAMING_SNAKE_CASE`             |
| Type parameters            | `TPascalCase` (`TInput`, not `T1`) |
| Schema constants           | `PascalCaseSchema`                 |

Do not prefix interfaces with `I`. Do not suffix types with `Type`.

## Imports

- **[checked]** Relative imports carry an explicit `.js` extension. This is a
  Node ESM requirement under `moduleResolution: nodenext`, not a style
  preference — omitting it produces output that fails at runtime while passing
  the type check.
- Import types with `import type`, required by `verbatimModuleSyntax`.
- Order: node builtins (tooling only) → external → internal workspace →
  relative. Enforced by `eslint-plugin-import-x`.

## Reserved words

Avoid these as bare identifiers; they are architectural concepts with specific
meanings defined in `specs/`, and overloading them creates ambiguity across the
codebase: `Task`, `Goal`, `Identity`, `Session`, `State`, `Intention`,
`Awareness`, `Context`, `Memory`, `Capability`, `Policy`, `Agent`, `Harness`,
`Workflow`, `Runtime`, `Evidence`, `Validation`, `Verdict`, `Proof`, `Trace`.
