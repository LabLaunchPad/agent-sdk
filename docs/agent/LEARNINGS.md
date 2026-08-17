# LEARNINGS

Candidate learnings and their promotion status.

Nothing here is a rule until it is validated. Promotion is deliberate:

```
observation → candidate → experiment → validate → promote → benchmark
→ regression test
```

**Never silently promote** anything touching policy, authority, security
boundaries or permissions. Those change only by explicit decision.

## Candidates

| ID   | Learning                                                                                                                                                                                                          | Evidence                                                                                                                                                                                                                                                                                                       | Status    |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| L001 | Toolchain compatibility must be checked against the live registry, not assumed from release recency — `typescript@latest` (7.0.2) is unusable here because `typescript-eslint` caps at `<6.1.0`                   | Registry query recorded in ADR-0003                                                                                                                                                                                                                                                                            | validated |
| L002 | A dist-only import test does not prove a package is publishable; the packed-tarball path catches failures the repo-local path hides                                                                               | Rationale for validator 4; to be demonstrated by its negative fixture                                                                                                                                                                                                                                          | candidate |
| L003 | Checking a framework's root `LICENSE` file is not sufficient license due diligence — licensing can split by directory, by commercial tier, or by code provenance, and a whole-tree/whole-offering check is needed | Confirmed 3 separate ways in one research pass: LangGraph (core MIT / `langgraph-api` Elastic 2.0), Mastra (framework Apache-2.0 / platform metered / Enterprise separate), AG2 (Apache-2.0 fork changes / MIT pre-fork code) — see `research/canonical/canonical-research.json`'s `CTR-LICENSE-SPLIT-PATTERN` | validated |
| L004 | No single imported research corpus's version claim should be trusted without an independent check — a corpus whose own stated purpose is drift detection can itself carry stale data                              | A2A: 3 imported/live sources cited 3 different version numbers; a live WebSearch during the canonical consolidation found the real current state and that the corpus with its own `drift-report.json` had the stale claim — see `research/protocols/a2a-1.0.1.md`'s "Version drift" section                    | validated |

## Promoted

| ID  | Rule     | Promoted | Enforced by |
| --- | -------- | -------- | ----------- |
| —   | none yet | —        | —           |

A learning is promoted only when it is enforced by something mechanical. An
unenforced rule is a preference, and preferences decay.
