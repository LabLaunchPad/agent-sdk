# Benchmark taxonomy

## Families

| Family          | Measures                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------- |
| `capability`    | Capability invocation cost, latency, failure handling                                     |
| `planning`      | Plan correctness, unnecessary steps, tool selection accuracy                              |
| `long-running`  | Checkpoint latency and size, resume latency, recovery success, duplicate side-effect rate |
| `recovery`      | Behaviour under crash, restart, outage, corruption                                        |
| `security`      | Injection resistance, policy bypass attempts, escalation attempts                         |
| `context`       | Context tokens, critical-fact omission, irrelevant context, compile time, cache hit rate  |
| `memory`        | Precision, recall, latency, tokens, poisoning resistance                                  |
| `efficiency`    | Tokens, cached tokens, model cost, tool calls, CPU, memory, wall clock                    |
| `portability`   | Same task and contract across runtimes and providers                                      |
| `human-in-loop` | Approval latency, human time consumed, intervention rate                                  |

## The cardinal rule

**Benchmark first → establish baseline → set target → enforce regression
threshold.**

Never hard-code a performance target that measurement has not established.
Numbers like "sub-10ms cold start", "50–80% token savings" or "90% memory
recall" are inadmissible until this repository has measured them on its own
code. Another system's published limits are evidence about that system, not a
guarantee about this one.

## Baseline record format

One JSON file per family under `benchmarks/<family>/baseline.json`:

```json
{
  "family": "long-running",
  "recordedAt": "2026-08-16T00:00:00Z",
  "commit": "<sha>",
  "environment": {
    "node": "24.19.0",
    "os": "linux",
    "arch": "x64",
    "cpuModel": "…",
    "containerized": true
  },
  "metrics": [
    { "name": "checkpoint.latency.p50", "value": 0, "unit": "ms", "samples": 0 }
  ],
  "regressionThreshold": { "metric": "checkpoint.latency.p50", "maxDeltaPct": 10 }
}
```

`environment` is mandatory. A baseline without the environment that produced it
cannot be compared against, and comparing across environments produces
confident nonsense.

## Comparison

Every release compares against the recorded baseline. A regression beyond the
declared threshold is a stop condition — report it rather than re-recording the
baseline to make it green. Re-baselining is an explicit, justified decision
recorded in the phase receipt.

## Phase 0 scope

Structure and format only. No benchmarks are run and no baselines are recorded,
because there is no behaviour to measure. The first real baselines land in
Phase 3.
