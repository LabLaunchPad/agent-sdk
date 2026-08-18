// Throwaway E5-02 harness — not part of any @lablaunchpad/* package.
// Implements the Operation state machine from
// docs/architecture/KERNEL-CONSTITUTION.md section 2 (elaborating
// ADR-0011) directly against SQLite, shared by the orchestrator and the
// concurrent-reconciliation worker processes. Every transition is guarded
// by optimistic concurrency (state IN (...) AND version = ?) so a losing
// writer can be detected, not just overwritten.
import { DatabaseSync } from 'node:sqlite';

export function openKernelDb(dbPath) {
  const db = new DatabaseSync(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS operations (
      operation_id TEXT PRIMARY KEY,
      attempt_id TEXT,
      idempotency_key TEXT,
      input_hash TEXT,
      capability TEXT,
      policy_decision TEXT,
      state TEXT NOT NULL,
      outcome TEXT,
      version INTEGER NOT NULL,
      created_at INTEGER,
      updated_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS evidence (
      id TEXT PRIMARY KEY,
      operation_id TEXT,
      provenance TEXT,
      detail TEXT,
      created_at INTEGER
    );
  `);
  return db;
}

export function createOperation(db, { operationId, idempotencyKey, inputHash }) {
  db.prepare(
    `INSERT INTO operations
       (operation_id, idempotency_key, input_hash, state, version, created_at, updated_at)
     VALUES (?, ?, ?, 'NOT_STARTED', 1, ?, ?)`,
  ).run(operationId, idempotencyKey, inputHash, Date.now(), Date.now());
}

export function getOperation(db, operationId) {
  return db.prepare('SELECT * FROM operations WHERE operation_id = ?').get(operationId);
}

export function recordEvidence(db, { id, operationId, provenance, detail }) {
  db.prepare(
    'INSERT INTO evidence (id, operation_id, provenance, detail, created_at) VALUES (?, ?, ?, ?, ?)',
  ).run(id, operationId, provenance, detail, Date.now());
}

/**
 * A guarded, optimistic-concurrency transition. Returns { ok, operation }.
 * ok === false means the guard failed — either the operation was not in
 * one of fromStates, or another writer already advanced `version` past
 * expectedVersion. This is the mechanism the concurrent-mutation
 * adversarial case exercises directly: two racing reconcilers, only one
 * of which can win a given transition.
 */
export function transition(
  db,
  operationId,
  { fromStates, toState, outcome, attemptId, capability, policyDecision },
  expectedVersion,
) {
  const placeholders = fromStates.map(() => '?').join(', ');
  const sets = ['state = ?', 'version = version + 1', 'updated_at = ?'];
  const args = [toState, Date.now()];
  if (outcome !== undefined) {
    sets.push('outcome = ?');
    args.push(outcome);
  }
  if (attemptId !== undefined) {
    sets.push('attempt_id = ?');
    args.push(attemptId);
  }
  if (capability !== undefined) {
    sets.push('capability = ?');
    args.push(capability);
  }
  if (policyDecision !== undefined) {
    sets.push('policy_decision = ?');
    args.push(policyDecision);
  }
  const sql = `UPDATE operations SET ${sets.join(', ')}
               WHERE operation_id = ? AND state IN (${placeholders}) AND version = ?`;
  const result = db
    .prepare(sql)
    .run(...args, operationId, ...fromStates, expectedVersion);
  const ok = Number(result.changes) === 1;
  return { ok, operation: getOperation(db, operationId) };
}

export function integrityCheck(db) {
  return db.prepare('PRAGMA integrity_check').get().integrity_check;
}
