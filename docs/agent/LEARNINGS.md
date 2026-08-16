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

| ID   | Learning                                                                                                                                                                                        | Evidence                                                              | Status    |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | --------- |
| L001 | Toolchain compatibility must be checked against the live registry, not assumed from release recency — `typescript@latest` (7.0.2) is unusable here because `typescript-eslint` caps at `<6.1.0` | Registry query recorded in ADR-0003                                   | validated |
| L002 | A dist-only import test does not prove a package is publishable; the packed-tarball path catches failures the repo-local path hides                                                             | Rationale for validator 4; to be demonstrated by its negative fixture | candidate |

## Promoted

| ID  | Rule     | Promoted | Enforced by |
| --- | -------- | -------- | ----------- |
| —   | none yet | —        | —           |

A learning is promoted only when it is enforced by something mechanical. An
unenforced rule is a preference, and preferences decay.
