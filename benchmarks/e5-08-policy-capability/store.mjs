// Throwaway E5-08 harness — not part of any @lablaunchpad/* package.
// Implements the Capability lifecycle and Policy evaluation model from
// docs/architecture/KERNEL-CONSTITUTION.md sections 4.1/4.2 (elaborating
// ADR-0013), added for Phase 8/9 prep. SIMULATED: this is a minimal
// deterministic rule evaluator standing in for a real PolicyEngine/
// CapabilityEngine (Phase 8/9 unstarted) — it proves the enforcement
// *logic* (stale-authorization, capability-escalation, policy-bypass
// detection), not that a real implementation will behave identically.
import { DatabaseSync } from 'node:sqlite';

export function openStoreDb(dbPath) {
  const db = new DatabaseSync(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS capabilities (
      capability_id TEXT PRIMARY KEY,
      principal TEXT NOT NULL,
      action TEXT NOT NULL,
      object TEXT NOT NULL,
      granted_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      revoked INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS policies (
      policy_version INTEGER PRIMARY KEY,
      denied_actions TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS operations (
      operation_id TEXT PRIMARY KEY,
      capability_id TEXT,
      requested_action TEXT,
      requested_object TEXT,
      policy_version_at_authorize INTEGER,
      state TEXT NOT NULL,
      outcome TEXT,
      version INTEGER NOT NULL
    );
  `);
  return db;
}

// --- Capability lifecycle (KERNEL-CONSTITUTION.md section 4.1) ---

export function issueCapability(db, { capabilityId, principal, action, object, ttlMs }) {
  const now = Date.now();
  db.prepare(
    `INSERT INTO capabilities (capability_id, principal, action, object, granted_at, expires_at, revoked)
     VALUES (?, ?, ?, ?, ?, ?, 0)`,
  ).run(capabilityId, principal, action, object, now, now + ttlMs);
}

export function revokeCapability(db, capabilityId) {
  db.prepare('UPDATE capabilities SET revoked = 1 WHERE capability_id = ?').run(
    capabilityId,
  );
}

/**
 * The stale-authorization / capability-escalation check (section 4.1).
 * Called at the source-to-sink enforcement point (dispatch), never
 * trusted from an earlier authorize-time check alone.
 */
export function checkCapability(db, capabilityId, { action, object }) {
  const cap = db
    .prepare('SELECT * FROM capabilities WHERE capability_id = ?')
    .get(capabilityId);
  if (!cap) return { valid: false, reason: 'CAPABILITY_NOT_FOUND' };
  if (cap.revoked) return { valid: false, reason: 'CAPABILITY_REVOKED' };
  if (Date.now() > cap.expires_at)
    return { valid: false, reason: 'CAPABILITY_EXPIRED_AT_DISPATCH' };
  if (cap.action !== action || cap.object !== object) {
    return { valid: false, reason: 'CAPABILITY_SCOPE_MISMATCH' };
  }
  return { valid: true, reason: null };
}

// --- Policy evaluation model (KERNEL-CONSTITUTION.md section 4.2) ---

export function createPolicy(db, { version, deniedActions }) {
  db.exec(`UPDATE policies SET active = 0`);
  db.prepare(
    'INSERT INTO policies (policy_version, denied_actions, active) VALUES (?, ?, 1)',
  ).run(version, JSON.stringify(deniedActions));
}

export function getCurrentPolicyVersion(db) {
  const row = db.prepare('SELECT policy_version FROM policies WHERE active = 1').get();
  return row ? row.policy_version : null;
}

/**
 * Evaluate a policy version's rules against a requested action.
 * `atVersion` is the version to evaluate AT — the freshness rule (4.2)
 * requires the caller to compare this against getCurrentPolicyVersion()
 * before trusting the result, never assume a cached decision is current.
 */
export function evaluatePolicy(db, atVersion, action) {
  const row = db
    .prepare('SELECT * FROM policies WHERE policy_version = ?')
    .get(atVersion);
  if (!row) return { decision: 'DENY', reason: 'POLICY_VERSION_NOT_FOUND' };
  const denied = JSON.parse(row.denied_actions);
  if (denied.includes(action))
    return { decision: 'DENY', reason: 'POLICY_DENIES_ACTION' };
  return { decision: 'ALLOW', reason: null };
}

// --- Operation (extends the section 2 shape with capability/policy linkage) ---

export function createOperation(
  db,
  { operationId, capabilityId, requestedAction, requestedObject },
) {
  db.prepare(
    `INSERT INTO operations (operation_id, capability_id, requested_action, requested_object, state, version)
     VALUES (?, ?, ?, ?, 'NOT_STARTED', 1)`,
  ).run(operationId, capabilityId, requestedAction, requestedObject);
}

export function getOperation(db, operationId) {
  return db.prepare('SELECT * FROM operations WHERE operation_id = ?').get(operationId);
}

export function transition(
  db,
  operationId,
  { fromStates, toState, outcome, policyVersionAtAuthorize },
  expectedVersion,
) {
  const placeholders = fromStates.map(() => '?').join(', ');
  const sets = ['state = ?', 'version = version + 1'];
  const args = [toState];
  if (outcome !== undefined) {
    sets.push('outcome = ?');
    args.push(outcome);
  }
  if (policyVersionAtAuthorize !== undefined) {
    sets.push('policy_version_at_authorize = ?');
    args.push(policyVersionAtAuthorize);
  }
  const sql = `UPDATE operations SET ${sets.join(', ')}
               WHERE operation_id = ? AND state IN (${placeholders}) AND version = ?`;
  const result = db
    .prepare(sql)
    .run(...args, operationId, ...fromStates, expectedVersion);
  return { ok: Number(result.changes) === 1, operation: getOperation(db, operationId) };
}
