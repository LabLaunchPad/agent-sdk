# Graphify semantic-extraction backends

Graphify extracts a knowledge graph in two passes. **Structural** extraction (AST) is
deterministic, free, and needs no LLM. **Semantic** extraction — concepts, rationale,
cross-document relationships — needs one, and this repository is documentation-heavy, so the
semantic pass is where nearly all of the cost sits.

If no API key is present, graphify falls back to dispatching Claude Code subagents. That works,
but it is the expensive path.

## Measured, on this repository

A 25-file / ~21k-word corpus, same content both ways:

| Path | Cost | Wall clock | Context impact |
|---|---|---|---|
| Subagent dispatch (2 agents) | 102,081 in / 87,914 out | ~5 min | ~190k tokens against the session |
| Gemini backend | ~1,400 in / ~460 out per file-pair | seconds | none — runs out of process |

The subagent path also consumes the *session's* context budget, which the API path does not.
On a docs-heavy repo that difference compounds fast.

**Prerequisite:** the API path needs the `openai` SDK, which ships in graphify's `gemini` extra.
Without it graphify silently falls back to subagents even when a key is set — this was the actual
reason the first run here dispatched agents:

```
uv tool install --upgrade 'graphifyy[gemini]'
```

## Setup

Graphify reads its key from the environment. Keep it out of the repository — a project-local
`.graphify/providers.json` is deliberately ignored by graphify unless
`GRAPHIFY_ALLOW_LOCAL_PROVIDERS=1`, precisely because a file that travels with a clone controls
where your corpus and key get sent.

```sh
# ~/.graphify/env — chmod 600, outside any repo
export GEMINI_API_KEY='...'
export GRAPHIFY_GEMINI_MODEL='gemini-flash-latest'
```

Then source it before a graphify run, or export it in your shell profile.

Do **not** put the key in `.claude/settings.json`, `.env`, or anything inside the working tree.

## Backends graphify ships

Selection is by whichever key is set, in this priority order:

```
gemini → kimi → claude → openai → deepseek → azure → bedrock → ollama
```

Ollama is checked **last** on purpose, so an incidental `OLLAMA_BASE_URL` can never silently
shadow a paid key.

| Backend | Env var | Default model |
|---|---|---|
| `gemini` | `GEMINI_API_KEY` / `GOOGLE_API_KEY` | `gemini-3-flash-preview` |
| `cerebras` | `CEREBRAS_API_KEY` | `llama-3.3-70b` |
| `groq` | `GROQ_API_KEY` | `llama-3.3-70b-versatile` |
| `openrouter` | `OPENROUTER_API_KEY` | `deepseek/deepseek-r1:free` |
| `openai` | `OPENAI_API_KEY` | `gpt-4.1-mini` |
| `deepseek` | `DEEPSEEK_API_KEY` | `deepseek-v4-flash` |
| `ollama` | — (local) | `qwen2.5-coder:7b` |

Each has a `GRAPHIFY_<NAME>_MODEL` override. All four free-tier options above are already
built in — no `providers.json` needed.

## Fallback ladder when the Gemini quota runs out

Ordered by daily volume, which is the constraint that actually bites on a corpus this size.
Rate limits below are what vendors and trackers reported as of August 2026; **verify against
your own account's live quota** rather than trusting this table — Google in particular no longer
publishes a fixed public quota table, and OpenRouter's free model lineup rotates without notice.

| Rank | Backend | Reported free ceiling | Why here |
|---|---|---|---|
| 1 | **Cerebras** | ~1M tokens/day | Highest daily volume of any free tier; best match for a large one-off extraction |
| 2 | **Gemini Flash** | ~1,500 req/day, high TPM | Current default. Vision-capable, so it is the only one of these that can extract from images |
| 3 | **Groq** | 30 RPM / 14,400 req/day, but ~500k tokens/day on some models | Fastest per token; the daily *token* cap is the real limit, not the request cap |
| 4 | **OpenRouter** | 50 req/day free, 1,000 after a one-off $10 credit purchase; 20 RPM | Lowest request ceiling, but the widest model choice; useful as a last resort |
| 5 | **Ollama** | unlimited, local | No quota at all, no data leaves the machine. Quality is lower and it needs local compute |

Practical rule: **Cerebras for a full rebuild, Gemini for incremental updates.** A full rebuild
is a burst of large requests where the daily token ceiling dominates; an incremental `--update`
is a handful of small ones where request-per-day limits never come close to binding.

Two caveats worth stating plainly:

- Only Gemini among these is **vision-capable** in graphify's config. A corpus containing images
  will silently lose those nodes on Cerebras, Groq or OpenRouter.
- Free tiers have no uptime guarantee. They are appropriate for a developer-tooling graph and
  inappropriate for anything on a critical path.

## Incremental runs

A full rebuild is rarely necessary. `graphify update .` re-extracts only changed files against a
content-hash cache keyed by the extraction prompt, so a prompt upgrade correctly invalidates
stale entries while unchanged files replay for free. The post-commit hook already runs the
AST-only path, which needs no LLM at all — that is why hook-triggered rebuilds are free and
produce structural nodes only.
