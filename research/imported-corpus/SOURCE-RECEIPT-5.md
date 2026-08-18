---
type: Research Receipt
title: External Research Commission Receipt (Corpus 6, Defective — Reconciled by Independent Verification)
description: Receipt for a user-commissioned external research pass on Volcengine AgentKit, Baidu AppBuilder SDK, PydanticAI/Kimi deepening, and two comparative audits — the response had disqualifying evidentiary defects and was not imported as-is; its specific, checkable claims were independently re-verified by this session instead
sources:
  - resource: /research/frameworks/volcengine-agentkit/overview.md
    id: volcengine
  - resource: /research/frameworks/baidu-appbuilder-sdk/overview.md
    id: baidu
generated:
  by: process:claude-code-session
  at: 2026-08-18T00:00:00Z
status: draft
x_provenance: this document describes an external corpus that was NOT imported verbatim, unlike SOURCE-RECEIPT.md through SOURCE-RECEIPT-4.md — read the "Corpus defects" section before treating anything from the described corpus as evidence
---

# External Research Commission Receipt (Defective Corpus, Not Imported As-Is)

## What was commissioned

This session produced a detailed research-commission prompt
(`LABLAUNCHPAD-EXTERNAL-RESEARCH-PROMPT.md`, sent to the user as a file)
specifying 6 research modules — Volcengine AgentKit (A), Baidu AppBuilder
SDK (B), PydanticAI deepening (C), Kimi Agent SDK deepening (D), a
token/context-efficiency comparative audit (E), and a UX/DX comparative
audit (F) — with an exact OKF v0.2 output format, an E0-E5 evidence
hierarchy, and an explicit "never fabricate, always cite" discipline
matching this repository's own standing rules.

The user ran this prompt against a different AI system and pasted the
response back into this session.

## Corpus defects — recorded explicitly, not smoothed over

Direct inspection of the returned corpus found:

1. **Every citation is a bare bracketed number** (`[[75]]`, `[[7]]`, up
   to `[[83]]`) with **no bibliography anywhere in the output**. There is
   no mapping from any citation number to an actual URL — every claim in
   the corpus is, as delivered, untraceable to its source.
2. **Each file's `sources:` frontmatter lists only 2-3 URLs**, while the
   body text cites dozens of distinct `[[N]]` numbers — the frontmatter
   does not even cover the range of citations actually used in the body.
3. **`MANIFEST.json` and `CHECKSUMS.txt` contained literal placeholder
   strings** (`"simulated_hash_1"` through `"simulated_hash_8"`) instead
   of real SHA-256 hashes — an explicit fabrication marker in the
   deliverable's own integrity-verification artifacts.
4. **No zip was actually produced.** A Python build script was provided
   instead, with `"..."` placeholder content for 6 of the 8 target files
   — running it as given would not reproduce the corpus shown in chat.
5. One specific finding (Volcengine AgentKit "up to 99% token savings")
   cited an unfamiliar domain (`explodential.com`) that could not be
   corroborated by an independent WebSearch this session ran — see
   "What was independently checked and failed to corroborate" below.

The corpus's **shape** was good — it correctly used OKF v0.2 frontmatter,
the repository's own evidence-level/claim-type/local-first-classification
vocabulary throughout, and followed the requested module structure. The
defect is entirely in the evidentiary apparatus, not the format
understanding.

## What was done instead of importing verbatim

Per this repository's own precedent (A2A in Phase 1B: "the imported
okf.md was thin — a lead, not a final record... independently
re-verified A2A live"), the corpus's specific, checkable claims were
treated as **leads**, and the load-bearing ones were independently
re-verified via direct `WebFetch`/`WebSearch` this session:

| Claim                                                                 | Corpus said                                 | Independently verified result                                                                                                                                                                      |
| --------------------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Volcengine `agentkit-sdk-python`/`veadk-python` license               | Apache-2.0                                  | **Confirmed** — directly fetched both repos' READMEs/license badges                                                                                                                                |
| Volcengine requires a cloud API key                                   | Yes (`CLOUD_ONLY`)                          | **Confirmed** — directly fetched `veadk-python`'s README config example, which shows a required, blank `api_key` field pointed at Volcengine's own ARK endpoint                                    |
| Baidu `app-builder` license                                           | Apache-2.0                                  | **Confirmed** — directly fetched the repo                                                                                                                                                          |
| Baidu requires a cloud token                                          | Yes (`CLOUD_ONLY`)                          | **Confirmed** — directly fetched the repo, `APPBUILDER_TOKEN` is a mandatory quickstart step                                                                                                       |
| Baidu AppBuilder is "architecturally bound to ERNIE"                  | Claimed as `FACT`                           | **Corrected** — independent WebSearch found Baidu's AI Studio LLM API is `openai-python`-SDK-compatible and explicitly supports DeepSeek-V3.1 alongside ERNIE, not an ERNIE-exclusive architecture |
| PydanticAI supports multi-agent delegation via tool-registered agents | Claimed                                     | **Confirmed** — directly fetched PydanticAI's own docs, which name this pattern "Agent delegation"                                                                                                 |
| PydanticAI has no built-in memory/state                               | Claimed                                     | **Confirmed** — PydanticAI's own docs state agents "are stateless and designed to be global"                                                                                                       |
| Kimi CLI requires a Moonshot API key, no self-hosted path             | Claimed                                     | **Confirmed** — directly fetched Moonshot's own platform docs                                                                                                                                      |
| Volcengine AgentKit achieves "up to 99% token savings"                | Claimed as `FACT`, cited `explodential.com` | **Not corroborated** — independent WebSearch found no source for this specific claim anywhere, including Volcengine's own properties. **Not adopted.**                                             |

## What this receipt does NOT claim

This is not a wholesale rejection of the external AI's effort — the
format compliance was genuinely good, and several claims held up under
independent verification. It is a record that **this repository's
evidence bar does not bend for a corpus with an unverifiable citation
apparatus**, applied identically here as to every internally-authored
claim all session. The actual research content now living in
`research/frameworks/volcengine-agentkit/overview.md`,
`research/frameworks/baidu-appbuilder-sdk/overview.md`, and the
deepening sections of `research/frameworks/{pydantic-ai,kimi-agent-sdk}/overview.md`
was written from this session's own direct verification, not copied from
the external corpus's prose — this receipt exists so a future reader
understands why that extra verification pass happened.
