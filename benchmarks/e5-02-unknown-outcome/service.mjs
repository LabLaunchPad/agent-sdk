// Throwaway E5-02 harness — not part of any @lablaunchpad/* package.
//
// SIMULATED external side-effect service. Stands in for a real remote
// system (payment processor, email sender, downstream API) since no real
// capability/side-effect implementation exists yet (Phase 8/9 unstarted).
// Everywhere this harness's own docs/results refer to this process, it is
// labeled SIMULATED — it is not a proof about any real external system,
// only about the kernel-side reconciliation logic around one.
//
// What makes reconciliation meaningful rather than fake: this service has
// its OWN durable log of what it actually did (service.db), independent
// of whether the caller (the kernel/orchestrator) ever saw a response.
// Idempotency is enforced here, at the service, the same way a real
// well-behaved external system would: INSERT is a no-op on a key already
// logged, and the second caller can tell it was a duplicate.
import { DatabaseSync } from 'node:sqlite';
import { writeFileSync } from 'node:fs';

const [, , serviceDbPath, idempotencyKey, operationId] = process.argv;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const db = new DatabaseSync(serviceDbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS service_log (
    idempotency_key TEXT PRIMARY KEY,
    operation_id TEXT,
    dispatch_attempts INTEGER,
    committed_at INTEGER
  );
`);

const existing = db
  .prepare('SELECT * FROM service_log WHERE idempotency_key = ?')
  .get(idempotencyKey);

if (existing) {
  // Real duplicate-suppression, enforced by the service itself: the
  // effect is not re-performed. dispatch_attempts is incremented purely
  // so the harness can prove no second effect occurred, mirroring what a
  // real idempotent API's attempt counter would show.
  db.prepare(
    'UPDATE service_log SET dispatch_attempts = dispatch_attempts + 1 WHERE idempotency_key = ?',
  ).run(idempotencyKey);
  writeFileSync(`${serviceDbPath}.${idempotencyKey}.deduped`, String(Date.now()));
  console.log(JSON.stringify({ status: 'ACKED', deduped: true }));
  db.close();
  process.exit(0);
}

// Sentinel: written the instant the process is actually running, so the
// orchestrator can distinguish "killed before the service ever started"
// from "killed after it committed" without guessing from wall-clock
// timing alone — same discipline as benchmarks/durable-restart/writer.mjs.
writeFileSync(`${serviceDbPath}.${idempotencyKey}.started`, String(Date.now()));

// Simulated network/processing latency before the effect commits.
await sleep(30);

db.exec('BEGIN IMMEDIATE');
db.prepare(
  'INSERT INTO service_log (idempotency_key, operation_id, dispatch_attempts, committed_at) VALUES (?, ?, 1, ?)',
).run(idempotencyKey, operationId, Date.now());
db.exec('COMMIT');

// The effect is now real and durable on the service side, regardless of
// whether this process is allowed to finish and respond. The
// .committed sentinel is the harness's proof of that fact, checked from
// outside this process. In "response lost" trials the orchestrator
// SIGKILLs this process in the window right after this sentinel appears
// but before the ACKED response below is ever printed/observed.
writeFileSync(`${serviceDbPath}.${idempotencyKey}.committed`, String(Date.now()));

// A deliberate window between "effect committed" and "response sent",
// wide enough for the orchestrator's poll-then-SIGKILL round trip
// (fs.existsSync + process.kill, both real syscalls) to reliably land
// inside it. Without this, the first run of this harness showed the
// child's own synchronous close/print/exit sometimes winning the race
// against the orchestrator under real OS scheduling - an honest flake,
// not a logic bug, but one that made the "response lost after a real
// side effect" case non-reproducible. Widening this window (the same
// fix benchmarks/durable-restart/ needed for its own timing) is what
// makes the scenario the harness claims to test actually happen.
await sleep(60);

db.close();
console.log(JSON.stringify({ status: 'ACKED', deduped: false }));
process.exit(0);
