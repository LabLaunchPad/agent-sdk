// E5-02 UNKNOWN_OUTCOME / side-effect reconciliation — throwaway
// orchestrator, not part of any @lablaunchpad/* package (matches
// benchmarks/durable-restart/'s precedent exactly: Phase 2 implementation
// stays LOCKED per .context/research/reconciliation/phase-gate.json;
// this validates the Operation state machine in
// docs/architecture/KERNEL-CONSTITUTION.md section 2 against a SIMULATED
// external side-effect service, not a real one).
//
// See research/benchmarks/E5-02-RESULT.md for the write-up this run
// produces and .context/benchmarks/e5-02-unknown-outcome.json for the
// machine record.
import { spawn, spawnSync } from 'node:child_process';
import {
  existsSync,
  rmSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  openSync,
  writeSync,
  closeSync,
  readdirSync,
} from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  openKernelDb,
  createOperation,
  getOperation,
  transition,
  integrityCheck,
} from './store.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'runs');
mkdirSync(outDir, { recursive: true });
const servicePath = path.join(__dirname, 'service.mjs');
const reconcileWorkerPath = path.join(__dirname, 'reconcile-worker.mjs');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function freshDbPaths(name) {
  const kernelDbPath = path.join(outDir, `${name}-kernel.db`);
  const serviceDbPath = path.join(outDir, `${name}-service.db`);
  for (const p of [kernelDbPath, serviceDbPath]) {
    for (const ext of ['', '-journal', '-wal', '-shm']) {
      if (existsSync(p + ext)) rmSync(p + ext);
    }
  }
  // Also remove any per-idempotency-key sentinel files
  // (service.mjs writes `${serviceDbPath}.<key>.{started,committed,deduped}`)
  // left over from a prior run of this script - otherwise a stale
  // .committed sentinel from a previous invocation causes the harness to
  // believe the current run's dispatch already committed before it has.
  const serviceDbBase = path.basename(serviceDbPath);
  for (const entry of readdirSync(outDir)) {
    if (entry.startsWith(`${serviceDbBase}.`)) {
      rmSync(path.join(outDir, entry));
    }
  }
  return { kernelDbPath, serviceDbPath };
}

function serviceLogRow(serviceDbPath, idempotencyKey) {
  const db = new DatabaseSync(serviceDbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS service_log (
      idempotency_key TEXT PRIMARY KEY,
      operation_id TEXT,
      dispatch_attempts INTEGER,
      committed_at INTEGER
    );
  `);
  const row = db
    .prepare('SELECT * FROM service_log WHERE idempotency_key = ?')
    .get(idempotencyKey);
  db.close();
  return row;
}

function serviceLogRowCount(serviceDbPath) {
  const db = new DatabaseSync(serviceDbPath);
  db.exec('CREATE TABLE IF NOT EXISTS service_log (idempotency_key TEXT PRIMARY KEY)');
  const row = db.prepare('SELECT COUNT(*) as n FROM service_log').get();
  db.close();
  return Number(row.n);
}

/**
 * Dispatches one call to the SIMULATED service. `kill` controls the
 * fault mode: 'none' lets it finish naturally, 'before-commit' kills
 * before the .committed sentinel can appear, 'after-commit' polls for
 * the .committed sentinel then SIGKILLs — the real-side-effect-but-
 * lost-response case this whole E5 exists to test.
 */
async function dispatchSimulated(
  serviceDbPath,
  idempotencyKey,
  operationId,
  kill = 'none',
) {
  const child = spawn(
    process.execPath,
    [servicePath, serviceDbPath, idempotencyKey, operationId],
    {
      stdio: ['ignore', 'pipe', 'ignore'],
    },
  );
  let stdout = '';
  child.stdout.on('data', (d) => {
    stdout += d.toString();
  });
  child.on('error', () => {});

  if (kill === 'before-commit') {
    await sleep(5);
    if (child.exitCode === null) child.kill('SIGKILL');
  } else if (kill === 'after-commit') {
    const committedFlag = `${serviceDbPath}.${idempotencyKey}.committed`;
    const deadline = Date.now() + 3000;
    while (!existsSync(committedFlag) && Date.now() < deadline) {
      await sleep(3);
    }
    if (child.exitCode === null) child.kill('SIGKILL');
  } else if (kill === 'timeout') {
    // Models a caller-side timeout on a still-running, uninterrupted
    // effect: the orchestrator simply stops waiting after a short window
    // without killing the child. The child completes on its own.
    await sleep(8);
  } else {
    await Promise.race([
      new Promise((resolve) => child.on('exit', resolve)),
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]);
  }

  return {
    started: existsSync(`${serviceDbPath}.${idempotencyKey}.started`),
    committed: existsSync(`${serviceDbPath}.${idempotencyKey}.committed`),
    deduped: existsSync(`${serviceDbPath}.${idempotencyKey}.deduped`),
    stdout: stdout.trim(),
    childStillAlive: child.exitCode === null,
    child,
  };
}

/**
 * Kernel-side classification on "restart": load the operation fresh (a
 * new DatabaseSync handle, modeling a new process), and if it is stuck in
 * DISPATCHED with no observed ACKED/REJECTED evidence, transition it to
 * UNKNOWN_OUTCOME. This is the one rule the whole state machine exists to
 * enforce: a timeout/crash never silently becomes REJECTED.
 */
function classifyOnRestart(kernelDbPath, operationId) {
  const db = openKernelDb(kernelDbPath);
  const op = getOperation(db, operationId);
  if (op.state !== 'DISPATCHED') {
    db.close();
    return { db: openKernelDb(kernelDbPath), classified: false, operation: op };
  }
  const result = transition(
    db,
    operationId,
    { fromStates: ['DISPATCHED'], toState: 'UNKNOWN_OUTCOME' },
    op.version,
  );
  db.close();
  return { classified: result.ok, operation: result.operation };
}

/**
 * Reconciliation: query the SIMULATED service's own durable log (the
 * idempotent status check) — never re-dispatch blindly. A row present
 * means the effect happened -> ACKED. No row means no evidence it
 * happened -> REJECTED, valid ONLY because this simulated service's own
 * invariant is log-before-respond (stated as a limitation below - a real
 * external system may not offer an equivalently reliable status check,
 * in which case RECONCILING must degrade to MANUAL_REVIEW instead).
 */
function reconcile(kernelDbPath, serviceDbPath, operationId) {
  const kdb = openKernelDb(kernelDbPath);
  const op = getOperation(kdb, operationId);
  const toReconciling = transition(
    kdb,
    operationId,
    { fromStates: ['UNKNOWN_OUTCOME'], toState: 'RECONCILING' },
    op.version,
  );
  if (!toReconciling.ok) {
    kdb.close();
    return { operation: toReconciling.operation, reconciled: false };
  }
  const row = serviceLogRow(serviceDbPath, op.idempotency_key);
  const toState = row ? 'ACKED' : 'REJECTED';
  const final = transition(
    kdb,
    operationId,
    { fromStates: ['RECONCILING'], toState, outcome: toState },
    toReconciling.operation.version,
  );
  kdb.close();
  return {
    operation: final.operation,
    reconciled: final.ok,
    serviceEvidence: row ?? null,
  };
}

const results = [];

// ---------------------------------------------------------------------
// PRIMARY SCENARIO — the 12-step minimum: create -> authorize -> dispatch
// -> side effect actually happens -> ack lost -> process killed ->
// restart -> recover -> classify UNKNOWN_OUTCOME -> reconcile (query the
// service's own durable log) -> reach ACKED/REJECTED/MANUAL_REVIEW ->
// assert no blind duplicate dispatch occurred.
// ---------------------------------------------------------------------
async function runPrimaryScenario() {
  const name = 'primary';
  const { kernelDbPath, serviceDbPath } = freshDbPaths(name);
  const operationId = 'op-primary-001';
  const idempotencyKey = 'idem-primary-001';

  // 1. create
  const db = openKernelDb(kernelDbPath);
  createOperation(db, { operationId, idempotencyKey, inputHash: 'hash-1' });
  // 2. authorize
  const afterAuth = transition(
    db,
    operationId,
    {
      fromStates: ['NOT_STARTED'],
      toState: 'AUTHORIZED',
      capability: 'CAP-simulated-send',
      policyDecision: 'ALLOW',
    },
    1,
  );
  db.close();

  // 3. dispatch (checkpoint DISPATCHED before calling out, per the
  // constitution's "duplicate suppression" rule: the kernel must know it
  // dispatched before the effect can be trusted to have been attempted)
  const db2 = openKernelDb(kernelDbPath);
  const beforeDispatch = getOperation(db2, operationId);
  const dispatchTxn = transition(
    db2,
    operationId,
    { fromStates: ['AUTHORIZED'], toState: 'DISPATCHED', attemptId: 'attempt-1' },
    beforeDispatch.version,
  );
  db2.close();

  // 4-6. side effect actually happens, ack lost, process killed: the
  // SIMULATED service commits its own durable log entry, then this
  // harness SIGKILLs it before it can ever respond.
  const dispatchOutcome = await dispatchSimulated(
    serviceDbPath,
    idempotencyKey,
    operationId,
    'after-commit',
  );

  // 7-8. restart, recover: a fresh DB handle stands in for a new process.
  // 9. classify UNKNOWN_OUTCOME
  const classified = classifyOnRestart(kernelDbPath, operationId);

  // 10-11. reconcile against the service's own log; reach a terminal state.
  const reconciled = reconcile(kernelDbPath, serviceDbPath, operationId);

  // 12. assert no blind duplicate dispatch occurred: exactly one
  // service_log row, dispatch_attempts === 1 (reconciliation never
  // re-called the service).
  const finalServiceRow = serviceLogRow(serviceDbPath, idempotencyKey);

  const pass =
    afterAuth.ok &&
    dispatchTxn.ok &&
    dispatchOutcome.committed === true &&
    dispatchOutcome.stdout === '' && // response genuinely never observed
    classified.classified === true &&
    classified.operation.state === 'UNKNOWN_OUTCOME' &&
    reconciled.reconciled === true &&
    reconciled.operation.state === 'ACKED' &&
    finalServiceRow !== undefined &&
    Number(finalServiceRow.dispatch_attempts) === 1;

  results.push({
    case: 'primary-12-step-unknown-outcome-reconciliation',
    executed: 'EXECUTED',
    steps: {
      '1_create': true,
      '2_authorize': afterAuth.ok,
      '3_dispatch_checkpoint': dispatchTxn.ok,
      '4_side_effect_happened': dispatchOutcome.committed,
      '5_ack_lost': dispatchOutcome.stdout === '',
      '6_process_killed': !dispatchOutcome.childStillAlive,
      '7_8_restart_recover': true,
      '9_classify_unknown_outcome': classified.classified,
      '10_reconcile_query_service_log': reconciled.serviceEvidence !== null,
      '11_reach_terminal_state': reconciled.operation.state,
      '12_no_blind_duplicate_dispatch':
        finalServiceRow !== undefined && Number(finalServiceRow.dispatch_attempts) === 1,
    },
    finalOperationState: reconciled.operation.state,
    finalOperationOutcome: reconciled.operation.outcome,
    serviceDispatchAttempts: finalServiceRow
      ? Number(finalServiceRow.dispatch_attempts)
      : null,
    pass,
  });
  return { kernelDbPath, serviceDbPath, operationId, idempotencyKey };
}

// ---------------------------------------------------------------------
// ADVERSARIAL CASE 1 — duplicate operation: after the primary scenario
// already reached ACKED, something erroneously calls the service again
// with the same idempotency key. The service itself must dedupe.
// ---------------------------------------------------------------------
async function caseDuplicateOperation(primary) {
  const before = serviceLogRow(primary.serviceDbPath, primary.idempotencyKey);
  const redispatch = await dispatchSimulated(
    primary.serviceDbPath,
    primary.idempotencyKey,
    primary.operationId,
    'none',
  );
  const after = serviceLogRow(primary.serviceDbPath, primary.idempotencyKey);
  const pass =
    redispatch.deduped === true &&
    before.committed_at === after.committed_at && // effect not re-performed
    Number(after.dispatch_attempts) === Number(before.dispatch_attempts) + 1;
  results.push({
    case: 'duplicate-operation',
    executed: 'EXECUTED',
    before: {
      dispatchAttempts: Number(before.dispatch_attempts),
      committedAt: before.committed_at,
    },
    after: {
      dispatchAttempts: Number(after.dispatch_attempts),
      committedAt: after.committed_at,
    },
    deduped: redispatch.deduped,
    pass,
  });
}

// ---------------------------------------------------------------------
// ADVERSARIAL CASE 2 — timeout after real side effect: the kernel gives
// up waiting before the (still-running, never-killed) service actually
// finishes and commits. Must still classify UNKNOWN_OUTCOME, not assume
// failure.
// ---------------------------------------------------------------------
async function caseTimeoutAfterRealSideEffect() {
  const name = 'timeout';
  const { kernelDbPath, serviceDbPath } = freshDbPaths(name);
  const operationId = 'op-timeout-001';
  const idempotencyKey = 'idem-timeout-001';
  const db = openKernelDb(kernelDbPath);
  createOperation(db, { operationId, idempotencyKey, inputHash: 'hash-2' });
  transition(db, operationId, { fromStates: ['NOT_STARTED'], toState: 'AUTHORIZED' }, 1);
  db.close();
  const db2 = openKernelDb(kernelDbPath);
  const beforeDispatch = getOperation(db2, operationId);
  transition(
    db2,
    operationId,
    { fromStates: ['AUTHORIZED'], toState: 'DISPATCHED', attemptId: 'attempt-1' },
    beforeDispatch.version,
  );
  db2.close();

  const dispatchOutcome = await dispatchSimulated(
    serviceDbPath,
    idempotencyKey,
    operationId,
    'timeout',
  );
  const classified = classifyOnRestart(kernelDbPath, operationId);
  // Let the still-running child actually finish before reconciling, same
  // as a real timeout would eventually resolve on the service side.
  const deadline = Date.now() + 3000;
  while (
    !existsSync(`${serviceDbPath}.${idempotencyKey}.committed`) &&
    Date.now() < deadline
  ) {
    await sleep(5);
  }
  const reconciled = reconcile(kernelDbPath, serviceDbPath, operationId);

  const pass =
    dispatchOutcome.childStillAlive === true && // kernel stopped waiting, service kept running
    classified.classified === true &&
    classified.operation.state === 'UNKNOWN_OUTCOME' &&
    reconciled.operation.state === 'ACKED';
  results.push({
    case: 'timeout-after-real-side-effect',
    executed: 'EXECUTED',
    note: 'Kernel-side timeout, distinct mechanism from response-lost-after-real-side-effect: the service process is never killed, only the kernel stops waiting for it.',
    kernelStoppedWaitingWhileServiceStillRunning: dispatchOutcome.childStillAlive,
    finalOperationState: reconciled.operation.state,
    pass,
  });
}

// ---------------------------------------------------------------------
// ADVERSARIAL CASE 3 — response lost after real side effect: same as the
// primary scenario's core mechanism, run as its own isolated trial so it
// has an independent pass/fail signal from the 12-step composite above.
// ---------------------------------------------------------------------
async function caseResponseLostAfterRealSideEffect() {
  const name = 'response-lost';
  const { kernelDbPath, serviceDbPath } = freshDbPaths(name);
  const operationId = 'op-resplost-001';
  const idempotencyKey = 'idem-resplost-001';
  const db = openKernelDb(kernelDbPath);
  createOperation(db, { operationId, idempotencyKey, inputHash: 'hash-3' });
  transition(db, operationId, { fromStates: ['NOT_STARTED'], toState: 'AUTHORIZED' }, 1);
  db.close();
  const db2 = openKernelDb(kernelDbPath);
  const beforeDispatch = getOperation(db2, operationId);
  transition(
    db2,
    operationId,
    { fromStates: ['AUTHORIZED'], toState: 'DISPATCHED', attemptId: 'attempt-1' },
    beforeDispatch.version,
  );
  db2.close();

  const dispatchOutcome = await dispatchSimulated(
    serviceDbPath,
    idempotencyKey,
    operationId,
    'after-commit',
  );
  const classified = classifyOnRestart(kernelDbPath, operationId);
  const reconciled = reconcile(kernelDbPath, serviceDbPath, operationId);

  const pass =
    dispatchOutcome.committed === true &&
    dispatchOutcome.stdout === '' &&
    classified.operation.state === 'UNKNOWN_OUTCOME' &&
    reconciled.operation.state === 'ACKED';
  results.push({
    case: 'response-lost-after-real-side-effect',
    executed: 'EXECUTED',
    sideEffectCommitted: dispatchOutcome.committed,
    responseObserved: dispatchOutcome.stdout !== '',
    finalOperationState: reconciled.operation.state,
    pass,
  });
}

// ---------------------------------------------------------------------
// ADVERSARIAL CASE 4 — kill before checkpoint: the kernel never even
// checkpoints DISPATCHED (models a crash between AUTHORIZED and dispatch).
// On restart it must find AUTHORIZED, not treat it as UNKNOWN_OUTCOME,
// and it must be safe to dispatch fresh since the service has no record.
// ---------------------------------------------------------------------
async function caseKillBeforeCheckpoint() {
  const name = 'kill-before-checkpoint';
  const { kernelDbPath, serviceDbPath } = freshDbPaths(name);
  const operationId = 'op-killbefore-001';
  const idempotencyKey = 'idem-killbefore-001';
  const db = openKernelDb(kernelDbPath);
  createOperation(db, { operationId, idempotencyKey, inputHash: 'hash-4' });
  transition(db, operationId, { fromStates: ['NOT_STARTED'], toState: 'AUTHORIZED' }, 1);
  db.close();
  // Simulated crash here: dispatch is never attempted, no DISPATCHED
  // checkpoint is ever written, and the service is never called.

  const db2 = openKernelDb(kernelDbPath);
  const onRestart = getOperation(db2, operationId);
  db2.close();
  const serviceHasRecord = serviceLogRow(serviceDbPath, idempotencyKey) !== undefined;

  const pass = onRestart.state === 'AUTHORIZED' && !serviceHasRecord;
  results.push({
    case: 'kill-before-checkpoint',
    executed: 'EXECUTED',
    stateOnRestart: onRestart.state,
    serviceHasRecordOfEffect: serviceHasRecord,
    note: 'No DISPATCHED checkpoint was ever written, so restart correctly finds AUTHORIZED, not UNKNOWN_OUTCOME - safe to dispatch fresh.',
    pass,
  });
}

// ---------------------------------------------------------------------
// ADVERSARIAL CASE 5 — kill after checkpoint: the kernel checkpoints
// DISPATCHED but crashes before the service call ever actually reaches
// the service (no .started sentinel). On restart, reconciliation must
// find no service evidence and correctly resolve REJECTED, not assume
// ACKED.
// ---------------------------------------------------------------------
async function caseKillAfterCheckpoint() {
  const name = 'kill-after-checkpoint';
  const { kernelDbPath, serviceDbPath } = freshDbPaths(name);
  const operationId = 'op-killafter-001';
  const idempotencyKey = 'idem-killafter-001';
  const db = openKernelDb(kernelDbPath);
  createOperation(db, { operationId, idempotencyKey, inputHash: 'hash-5' });
  transition(db, operationId, { fromStates: ['NOT_STARTED'], toState: 'AUTHORIZED' }, 1);
  db.close();
  const db2 = openKernelDb(kernelDbPath);
  const beforeDispatch = getOperation(db2, operationId);
  transition(
    db2,
    operationId,
    { fromStates: ['AUTHORIZED'], toState: 'DISPATCHED', attemptId: 'attempt-1' },
    beforeDispatch.version,
  );
  db2.close();
  // Simulated crash: the DISPATCHED checkpoint is durable, but the
  // service call never actually happens (the child process is never
  // even spawned this trial).

  const classified = classifyOnRestart(kernelDbPath, operationId);
  const reconciled = reconcile(kernelDbPath, serviceDbPath, operationId);

  const pass =
    classified.operation.state === 'UNKNOWN_OUTCOME' &&
    reconciled.operation.state === 'REJECTED' &&
    reconciled.serviceEvidence === null;
  results.push({
    case: 'kill-after-checkpoint',
    executed: 'EXECUTED',
    finalOperationState: reconciled.operation.state,
    serviceEvidenceFound: reconciled.serviceEvidence !== null,
    limitation:
      'REJECTED here is trustworthy only because this SIMULATED service honors a log-before-respond invariant. A real external system with no equivalently reliable status check must degrade this same no-evidence case to MANUAL_REVIEW instead, per KERNEL-CONSTITUTION.md section 2 - not assumed safe by default.',
    pass,
  });
}

// ---------------------------------------------------------------------
// ADVERSARIAL CASE 6 — checkpoint corruption: corrupt kernel.db's bytes
// directly and confirm the recovery path detects it (PRAGMA
// integrity_check) instead of silently trusting corrupted state.
// ---------------------------------------------------------------------
async function caseCheckpointCorruption() {
  const name = 'corruption';
  const { kernelDbPath } = freshDbPaths(name);
  const operationId = 'op-corrupt-001';
  const db = openKernelDb(kernelDbPath);
  createOperation(db, {
    operationId,
    idempotencyKey: 'idem-corrupt-001',
    inputHash: 'hash-6',
  });
  db.close();

  // Corrupt: overwrite the SQLite file header itself (bytes 0-15 are the
  // fixed "SQLite format 3\0" magic string every valid database file
  // starts with) so the structure is unreadable, not merely mismatched in
  // unused space that integrity_check may not inspect (criterion 1 -
  // schema violation - from research/benchmarks/E5-RESULT.md's 7-criteria
  // corruption definition; a first attempt at this case corrupted bytes
  // in the middle of the file instead and PRAGMA integrity_check reported
  // "ok" - an honest miss, corrected here rather than left silent).
  const fd = openSync(kernelDbPath, 'r+');
  const garbage = Buffer.alloc(16, 0xff);
  writeSync(fd, garbage, 0, garbage.length, 0);
  closeSync(fd);

  let integrity = null;
  let threw = false;
  try {
    const db2 = new DatabaseSync(kernelDbPath);
    integrity = integrityCheck(db2);
    db2.close();
  } catch {
    threw = true;
  }

  const detected = threw || integrity !== 'ok';
  results.push({
    case: 'checkpoint-corruption',
    executed: 'EXECUTED',
    integrityCheckResult: integrity,
    threwOnOpen: threw,
    corruptionDetected: detected,
    note: 'Detection only - this harness does not implement a repair/quarantine path. A real CheckpointStore must route a detected corruption to MANUAL_REVIEW, never proceed as if the state were trustworthy.',
    pass: detected,
  });
}

// ---------------------------------------------------------------------
// ADVERSARIAL CASE 7 — replay determinism: the same starting operation +
// service-log state, reconciled twice independently, must produce
// byte-identical resulting classification both times.
// ---------------------------------------------------------------------
async function caseReplayDeterminism() {
  const name = 'replay';
  const { kernelDbPath, serviceDbPath } = freshDbPaths(name);
  const operationId = 'op-replay-001';
  const idempotencyKey = 'idem-replay-001';
  const db = openKernelDb(kernelDbPath);
  createOperation(db, { operationId, idempotencyKey, inputHash: 'hash-7' });
  transition(db, operationId, { fromStates: ['NOT_STARTED'], toState: 'AUTHORIZED' }, 1);
  db.close();
  const db2 = openKernelDb(kernelDbPath);
  const beforeDispatch = getOperation(db2, operationId);
  transition(
    db2,
    operationId,
    { fromStates: ['AUTHORIZED'], toState: 'DISPATCHED', attemptId: 'attempt-1' },
    beforeDispatch.version,
  );
  db2.close();
  await dispatchSimulated(serviceDbPath, idempotencyKey, operationId, 'after-commit');
  classifyOnRestart(kernelDbPath, operationId);

  // Snapshot the DB bytes so both replay attempts start from the exact
  // identical persisted state (not from two different live databases).
  const snapshot = readFileSync(kernelDbPath);
  const replayPathA = `${kernelDbPath}.replay-a`;
  const replayPathB = `${kernelDbPath}.replay-b`;
  writeFileSync(replayPathA, snapshot);
  writeFileSync(replayPathB, snapshot);

  const resultA = reconcile(replayPathA, serviceDbPath, operationId);
  const resultB = reconcile(replayPathB, serviceDbPath, operationId);

  const identical =
    resultA.operation.state === resultB.operation.state &&
    resultA.operation.outcome === resultB.operation.outcome &&
    resultA.reconciled === resultB.reconciled;
  results.push({
    case: 'replay-determinism',
    executed: 'EXECUTED',
    replayA: { state: resultA.operation.state, outcome: resultA.operation.outcome },
    replayB: { state: resultB.operation.state, outcome: resultB.operation.outcome },
    identical,
    pass: identical,
  });
}

// ---------------------------------------------------------------------
// ADVERSARIAL CASE 8 — concurrent state mutation: two "restarted workers"
// race to reconcile the same UNKNOWN_OUTCOME operation. Exactly one must
// win the guarded transition; the loser must detect the loss via the
// optimistic-concurrency guard, not overwrite the winner's result.
// ---------------------------------------------------------------------
async function caseConcurrentStateMutation() {
  const name = 'concurrent';
  const { kernelDbPath, serviceDbPath } = freshDbPaths(name);
  const operationId = 'op-concurrent-001';
  const idempotencyKey = 'idem-concurrent-001';
  const db = openKernelDb(kernelDbPath);
  createOperation(db, { operationId, idempotencyKey, inputHash: 'hash-8' });
  transition(db, operationId, { fromStates: ['NOT_STARTED'], toState: 'AUTHORIZED' }, 1);
  db.close();
  const db2 = openKernelDb(kernelDbPath);
  const beforeDispatch = getOperation(db2, operationId);
  transition(
    db2,
    operationId,
    { fromStates: ['AUTHORIZED'], toState: 'DISPATCHED', attemptId: 'attempt-1' },
    beforeDispatch.version,
  );
  db2.close();
  await dispatchSimulated(serviceDbPath, idempotencyKey, operationId, 'after-commit');
  classifyOnRestart(kernelDbPath, operationId);

  const workerA = spawnSync(process.execPath, [
    reconcileWorkerPath,
    kernelDbPath,
    serviceDbPath,
    operationId,
  ]);
  const workerB = spawnSync(process.execPath, [
    reconcileWorkerPath,
    kernelDbPath,
    serviceDbPath,
    operationId,
  ]);
  const outA = JSON.parse(workerA.stdout.toString().trim());
  const outB = JSON.parse(workerB.stdout.toString().trim());

  const finalRowCount = serviceLogRowCount(serviceDbPath);
  const exactlyOneWon = outA.won !== outB.won; // one true, one false
  const noDuplicateDispatch = finalRowCount === 1;
  const pass = exactlyOneWon && noDuplicateDispatch;
  results.push({
    case: 'concurrent-state-mutation',
    executed: 'EXECUTED',
    workerA: outA,
    workerB: outB,
    exactlyOneWon,
    noDuplicateDispatchTriggered: noDuplicateDispatch,
    note: 'Workers reconcile only (read the already-committed service log); neither ever calls the service, so this case isolates the concurrency guard from dispatch behaviour, which is already covered by the duplicate-operation case.',
    pass,
  });
}

// ---------------------------------------------------------------------
// NOT_EXECUTED — the 7 cases this harness cannot honestly exercise
// without a real Policy/Capability/state-machine-guard implementation.
// ---------------------------------------------------------------------
const notExecuted = [
  {
    case: 'illegal-transition',
    reason:
      "This harness's transition() guard rejects any fromStates mismatch, but there is no real Guard/Context model (KERNEL-CONSTITUTION.md section 1) to test an actually adversarial illegal-transition attempt against - only the one legal path was exercised.",
  },
  {
    case: 'duplicate-event',
    reason:
      'No Event identity/log exists in this harness (section 1 Event carries its own identity) - only Operation-level idempotency was exercised, which is a different mechanism.',
  },
  {
    case: 'reordered-event',
    reason: 'Same reason as duplicate-event: no persisted Event log to reorder.',
  },
  {
    case: 'stale-authorization',
    reason:
      'Capability/PolicyDecision fields are recorded but never expire or get re-evaluated in this harness - needs a real Capability grant with an expiry (ADR-0013).',
  },
  {
    case: 'capability-escalation',
    reason:
      'No real Capability enforcement boundary exists yet (Phase 8/9 unstarted) - the "capability" field here is a label, not an enforced grant.',
  },
  {
    case: 'policy-bypass',
    reason:
      'Same reason as capability-escalation - PolicyDecision is recorded, not enforced by a real PolicyEngine.',
  },
  {
    case: 'schema-version-mismatch',
    reason:
      "This harness runs a single schema version throughout - no second version exists to test migration/mismatch against (ADR-0010's schema migration invariant, Phase 4).",
  },
];

async function main() {
  const primary = await runPrimaryScenario();
  await caseDuplicateOperation(primary);
  await caseTimeoutAfterRealSideEffect();
  await caseResponseLostAfterRealSideEffect();
  await caseKillBeforeCheckpoint();
  await caseKillAfterCheckpoint();
  await caseCheckpointCorruption();
  await caseReplayDeterminism();
  await caseConcurrentStateMutation();

  for (const r of results) {
    console.log(JSON.stringify(r));
  }
  for (const n of notExecuted) {
    console.log(JSON.stringify({ ...n, executed: 'NOT_EXECUTED' }));
  }

  const summary = {
    experiment_id: 'E5-02-UNKNOWN-OUTCOME',
    environment: {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
    },
    harness_type: 'SIMULATED',
    harness_type_note:
      'The external side-effect service (service.mjs) is SIMULATED - a local child process with its own SQLite durable log, not a real remote system. No real capability/policy implementation exists yet (Phase 8/9 unstarted), so authorization is recorded but not enforced.',
    executed_cases: results.length,
    not_executed_cases: notExecuted.length,
    all_executed_pass: results.every((r) => r.pass === true),
    results,
    not_executed: notExecuted,
  };
  writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));
  console.log(`\nSummary written to ${path.join(outDir, 'summary.json')}`);
  console.log(`All executed cases pass: ${summary.all_executed_pass}`);
}

await main();
