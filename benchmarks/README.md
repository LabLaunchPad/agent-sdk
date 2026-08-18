# benchmarks/

Benchmark suites and recorded baselines.

**Source-of-truth status: CANONICAL** (measurements).

Taxonomy and baseline file format:
[`docs/architecture/BENCHMARK-TAXONOMY.md`](../docs/architecture/BENCHMARK-TAXONOMY.md).

## Rule

Benchmark first, establish a baseline, then set a target and enforce a
regression threshold. Never hard-code a performance target that measurement
has not established.

## Phase 0 contents

Structure and taxonomy only. No benchmarks run — there is nothing to measure
until Phase 3 produces contracts.
