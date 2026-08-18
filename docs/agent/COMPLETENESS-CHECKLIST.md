# Completeness Checklist

**Optional.** Not part of `pnpm validate`, not required by `ADR/TEMPLATE.md`,
not a gate. A voluntary, more granular pass to run over a draft ADR before
finalizing it, when the decision is high-stakes enough to warrant it.
Adapted from a user-supplied external package
(`research/reconciliation/KNOWLEDGE-OS-RECONCILIATION.md`'s "Comparison
3"), not a replacement for the ADR template's own required Adversarial
review section.

A material decision is complete only when each of the following is
present or explicitly marked `NOT_APPLICABLE` with a one-line rationale —
filling every field with prose is not required:

- intent
- outcome
- scope / non-goals
- constraints
- capability
- state / authority
- trust boundary
- failure modes
- quality attributes
- ownership
- boundary
- contract
- options
- evidence
- counter-evidence
- assumptions
- hypothesis (where uncertainty is material)
- experiment / prototype (where needed)
- measurement / threshold
- decision
- confidence
- revisit trigger
- verification
- validation
- operational implications

## Relationship to `ADR/TEMPLATE.md`

The ADR template's Context/Decision/Adversarial review/Alternatives
considered/Consequences/Revisit trigger/Evidence structure remains the
required, mechanically-checked-by-review shape for every ADR. This
checklist is a finer-grained lens over the same content — most fields map
directly (`evidence`/`counter-evidence` ↔ Evidence + Adversarial review's
Attack; `revisit trigger` ↔ the same field, verbatim; `options` ↔
Alternatives considered) — a few (`quality attributes`, `ownership`,
`operational implications`) are genuinely more granular than the
template's own sections and can surface a gap the template's shorter form
might let slide past. Use it as a self-check, not a second template to
fill out in parallel.
