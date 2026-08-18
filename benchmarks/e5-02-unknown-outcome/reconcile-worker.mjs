// Throwaway E5-02 harness — not part of any @lablaunchpad/* package.
//
// One "restarted worker" attempting to reconcile the same UNKNOWN_OUTCOME
// operation. Spawned twice, concurrently, by the concurrent-state-mutation
// adversarial case in run-e5-02.mjs, to prove the guarded, optimistic-
// concurrency transition in store.mjs actually lets only one worker win —
// not merely that it usually does under a single writer.
import { openKernelDb, getOperation, transition } from './store.mjs';
import { DatabaseSync } from 'node:sqlite';

const [, , kernelDbPath, serviceDbPath, operationId] = process.argv;

const db = openKernelDb(kernelDbPath);
const op = getOperation(db, operationId);

const serviceDb = new DatabaseSync(serviceDbPath);
const serviceRecord = serviceDb
  .prepare('SELECT * FROM service_log WHERE idempotency_key = ?')
  .get(op.idempotency_key);
serviceDb.close();

const toState = serviceRecord ? 'ACKED' : 'REJECTED';

const result = transition(
  db,
  operationId,
  { fromStates: ['UNKNOWN_OUTCOME', 'RECONCILING'], toState, outcome: toState },
  op.version,
);

console.log(
  JSON.stringify({
    pid: process.pid,
    won: result.ok,
    resultingState: result.operation.state,
  }),
);
db.close();
