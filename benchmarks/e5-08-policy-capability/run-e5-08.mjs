// E5-08 Policy/Capability Bypass — throwaway orchestrator, not part of any
// @lablaunchpad/* package (PHASE_2_IMPLEMENTATION stays LOCKED per
// .context/research/reconciliation/phase-gate.json). Exercises the 3
// adversarial cases .context/scenarios/kernel-core.json named
// NOT_EXECUTED (ADV-12 stale-authorization, ADV-13 capability-escalation,
// ADV-14 policy-bypass) against a SIMULATED Capability/Policy enforcement
// layer (docs/architecture/KERNEL-CONSTITUTION.md sections 4.1/4.2), plus
// one positive control proving the gating logic isn't just rejecting
// everything.
//
// See research/benchmarks/E5-08-RESULT.md for the write-up this run
// produces and .context/benchmarks/e5-08-policy-capability.json for the
// machine record.
import { existsSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  openStoreDb,
  issueCapability,
  revokeCapability,
  checkCapability,
  createPolicy,
  getCurrentPolicyVersion,
  evaluatePolicy,
  createOperation,
  getOperation,
  transition,
} from './store.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'runs');
mkdirSync(outDir, { recursive: true });

function freshDb(name) {
  const dbPath = path.join(outDir, `${name}.db`);
  for (const ext of ['', '-journal', '-wal', '-shm']) {
    if (existsSync(dbPath + ext)) rmSync(dbPath + ext);
  }
  return dbPath;
}

/**
 * The source-to-sink gate itself: everything an Operation must pass at
 * DISPATCHED, per KERNEL-CONSTITUTION.md sections 4.1/4.2. Returns
 * whether the (SIMULATED) service was actually called.
 */
function attemptDispatch(db, operationId) {
  const op = getOperation(db, operationId);
  let serviceCalled = false;

  // 4.1: re-check Capability at dispatch time, never trust the
  // authorize-time check alone (this is the stale-authorization /
  // capability-escalation gate).
  const capCheck = checkCapability(db, op.capability_id, {
    action: op.requested_action,
    object: op.requested_object,
  });
  if (!capCheck.valid) {
    const result = transition(
      db,
      operationId,
      { fromStates: ['AUTHORIZED'], toState: 'REJECTED', outcome: capCheck.reason },
      op.version,
    );
    return {
      serviceCalled,
      finalState: result.operation.state,
      outcome: result.operation.outcome,
    };
  }

  // 4.2: freshness rule - re-evaluate Policy if the current active
  // version has moved since authorize time; never dispatch against a
  // cached decision from a superseded version.
  const currentPolicyVersion = getCurrentPolicyVersion(db);
  let policyResult;
  if (currentPolicyVersion !== op.policy_version_at_authorize) {
    policyResult = evaluatePolicy(db, currentPolicyVersion, op.requested_action);
    policyResult.reason =
      policyResult.decision === 'DENY'
        ? 'POLICY_STALE_REEVALUATION_DENIED'
        : policyResult.reason;
  } else {
    policyResult = evaluatePolicy(
      db,
      op.policy_version_at_authorize,
      op.requested_action,
    );
  }
  if (policyResult.decision !== 'ALLOW') {
    const result = transition(
      db,
      operationId,
      { fromStates: ['AUTHORIZED'], toState: 'REJECTED', outcome: policyResult.reason },
      op.version,
    );
    return {
      serviceCalled,
      finalState: result.operation.state,
      outcome: result.operation.outcome,
    };
  }

  // Both gates passed - dispatch for real (SIMULATED service call).
  const toDispatched = transition(
    db,
    operationId,
    { fromStates: ['AUTHORIZED'], toState: 'DISPATCHED' },
    op.version,
  );
  serviceCalled = true;
  const toAcked = transition(
    db,
    operationId,
    { fromStates: ['DISPATCHED'], toState: 'ACKED', outcome: 'ACKED' },
    toDispatched.operation.version,
  );
  return {
    serviceCalled,
    finalState: toAcked.operation.state,
    outcome: toAcked.operation.outcome,
  };
}

function authorize(db, operationId) {
  const op = getOperation(db, operationId);
  const policyVersion = getCurrentPolicyVersion(db);
  const policyResult = evaluatePolicy(db, policyVersion, op.requested_action);
  return (
    transition(
      db,
      operationId,
      {
        fromStates: ['NOT_STARTED'],
        toState: 'AUTHORIZED',
        policyVersionAtAuthorize: policyVersion,
      },
      op.version,
    ).ok && policyResult.decision === 'ALLOW'
  );
}

const results = [];

// ---------------------------------------------------------------------
// ADV-12: stale-authorization. Capability is valid at authorize time,
// expires before dispatch. Must reject at dispatch, not proceed on the
// earlier check.
// ---------------------------------------------------------------------
async function caseStaleAuthorization() {
  const dbPath = freshDb('stale-authorization');
  const db = openStoreDb(dbPath);
  createPolicy(db, { version: 1, deniedActions: [] });
  issueCapability(db, {
    capabilityId: 'cap-1',
    principal: 'agent-1',
    action: 'send-email',
    object: 'obj-1',
    ttlMs: 80,
  });
  createOperation(db, {
    operationId: 'op-1',
    capabilityId: 'cap-1',
    requestedAction: 'send-email',
    requestedObject: 'obj-1',
  });
  const authOk = authorize(db, 'op-1');
  await new Promise((r) => setTimeout(r, 150)); // let the capability expire before dispatch
  const dispatchResult = attemptDispatch(db, 'op-1');
  db.close();

  const pass =
    authOk &&
    !dispatchResult.serviceCalled &&
    dispatchResult.finalState === 'REJECTED' &&
    dispatchResult.outcome === 'CAPABILITY_EXPIRED_AT_DISPATCH';
  results.push({
    case: 'ADV-12-stale-authorization',
    executed: 'EXECUTED (SIMULATED)',
    authorizedSuccessfully: authOk,
    serviceCalled: dispatchResult.serviceCalled,
    finalState: dispatchResult.finalState,
    outcome: dispatchResult.outcome,
    pass,
  });
}

// ---------------------------------------------------------------------
// ADV-13: capability-escalation. Principal holds a valid, unexpired
// capability for one action, requests dispatch of a different action.
// ---------------------------------------------------------------------
async function caseCapabilityEscalation() {
  const dbPath = freshDb('capability-escalation');
  const db = openStoreDb(dbPath);
  createPolicy(db, { version: 1, deniedActions: [] });
  issueCapability(db, {
    capabilityId: 'cap-2',
    principal: 'agent-1',
    action: 'read-file',
    object: 'file-A',
    ttlMs: 60_000,
  });
  // The operation requests a DIFFERENT action than the capability grants.
  createOperation(db, {
    operationId: 'op-2',
    capabilityId: 'cap-2',
    requestedAction: 'delete-file',
    requestedObject: 'file-A',
  });
  const authOk = authorize(db, 'op-2');
  const dispatchResult = attemptDispatch(db, 'op-2');
  db.close();

  const pass =
    authOk &&
    !dispatchResult.serviceCalled &&
    dispatchResult.finalState === 'REJECTED' &&
    dispatchResult.outcome === 'CAPABILITY_SCOPE_MISMATCH';
  results.push({
    case: 'ADV-13-capability-escalation',
    executed: 'EXECUTED (SIMULATED)',
    authorizedSuccessfully: authOk,
    serviceCalled: dispatchResult.serviceCalled,
    finalState: dispatchResult.finalState,
    outcome: dispatchResult.outcome,
    pass,
  });
}

// ---------------------------------------------------------------------
// ADV-14: policy-bypass. PolicyDecision was ALLOW at authorize time
// (version 1), but the active policy version changes to a DENY-ing v2
// before dispatch. Must re-evaluate at the current version, not trust
// the stale cached ALLOW.
// ---------------------------------------------------------------------
async function casePolicyBypass() {
  const dbPath = freshDb('policy-bypass');
  const db = openStoreDb(dbPath);
  createPolicy(db, { version: 1, deniedActions: [] }); // v1: everything allowed
  issueCapability(db, {
    capabilityId: 'cap-3',
    principal: 'agent-1',
    action: 'send-email',
    object: 'obj-3',
    ttlMs: 60_000,
  });
  createOperation(db, {
    operationId: 'op-3',
    capabilityId: 'cap-3',
    requestedAction: 'send-email',
    requestedObject: 'obj-3',
  });
  const authOk = authorize(db, 'op-3'); // ALLOW recorded, bound to v1
  // Policy is superseded before dispatch: v2 denies send-email.
  createPolicy(db, { version: 2, deniedActions: ['send-email'] });
  const dispatchResult = attemptDispatch(db, 'op-3');
  db.close();

  const pass =
    authOk &&
    !dispatchResult.serviceCalled &&
    dispatchResult.finalState === 'REJECTED' &&
    dispatchResult.outcome === 'POLICY_STALE_REEVALUATION_DENIED';
  results.push({
    case: 'ADV-14-policy-bypass',
    executed: 'EXECUTED (SIMULATED)',
    authorizedSuccessfully: authOk,
    serviceCalled: dispatchResult.serviceCalled,
    finalState: dispatchResult.finalState,
    outcome: dispatchResult.outcome,
    note: 'PolicyDecision at authorize time was ALLOW under policy v1; v2 (denying) became active before dispatch. Dispatch correctly re-evaluated at the current version instead of trusting the cached v1 ALLOW.',
    pass,
  });
}

// ---------------------------------------------------------------------
// POSITIVE CONTROL: valid capability, unchanged policy - dispatch must
// succeed. Proves the gate isn't rejecting everything by default.
// ---------------------------------------------------------------------
async function caseControlValidDispatch() {
  const dbPath = freshDb('control-valid');
  const db = openStoreDb(dbPath);
  createPolicy(db, { version: 1, deniedActions: [] });
  issueCapability(db, {
    capabilityId: 'cap-4',
    principal: 'agent-1',
    action: 'send-email',
    object: 'obj-4',
    ttlMs: 60_000,
  });
  createOperation(db, {
    operationId: 'op-4',
    capabilityId: 'cap-4',
    requestedAction: 'send-email',
    requestedObject: 'obj-4',
  });
  const authOk = authorize(db, 'op-4');
  const dispatchResult = attemptDispatch(db, 'op-4');
  db.close();

  const pass =
    authOk && dispatchResult.serviceCalled && dispatchResult.finalState === 'ACKED';
  results.push({
    case: 'control-valid-dispatch',
    executed: 'EXECUTED (SIMULATED)',
    authorizedSuccessfully: authOk,
    serviceCalled: dispatchResult.serviceCalled,
    finalState: dispatchResult.finalState,
    outcome: dispatchResult.outcome,
    note: 'Positive control - unexpired capability, unchanged scope, unchanged policy. Must succeed, proving the 3 rejections above are the gate working, not everything being rejected unconditionally.',
    pass,
  });
}

// ---------------------------------------------------------------------
// Bonus check: revocation takes effect immediately, independent of
// expiry clock (section 4.1's revocation property).
// ---------------------------------------------------------------------
async function caseRevocationTakesEffect() {
  const dbPath = freshDb('revocation');
  const db = openStoreDb(dbPath);
  createPolicy(db, { version: 1, deniedActions: [] });
  issueCapability(db, {
    capabilityId: 'cap-5',
    principal: 'agent-1',
    action: 'send-email',
    object: 'obj-5',
    ttlMs: 60_000,
  });
  createOperation(db, {
    operationId: 'op-5',
    capabilityId: 'cap-5',
    requestedAction: 'send-email',
    requestedObject: 'obj-5',
  });
  const authOk = authorize(db, 'op-5');
  revokeCapability(db, 'cap-5'); // revoked well before its own expiry
  const dispatchResult = attemptDispatch(db, 'op-5');
  db.close();

  const pass =
    authOk &&
    !dispatchResult.serviceCalled &&
    dispatchResult.finalState === 'REJECTED' &&
    dispatchResult.outcome === 'CAPABILITY_REVOKED';
  results.push({
    case: 'capability-revocation',
    executed: 'EXECUTED (SIMULATED)',
    authorizedSuccessfully: authOk,
    serviceCalled: dispatchResult.serviceCalled,
    finalState: dispatchResult.finalState,
    outcome: dispatchResult.outcome,
    note: 'Extra case beyond the 3 named ADV cases - revocation is independent of the expiry clock (section 4.1). Not one of ADV-12/13/14 but the same enforcement point.',
    pass,
  });
}

async function main() {
  await caseStaleAuthorization();
  await caseCapabilityEscalation();
  await casePolicyBypass();
  await caseControlValidDispatch();
  await caseRevocationTakesEffect();

  for (const r of results) {
    console.log(JSON.stringify(r));
  }

  const summary = {
    experiment_id: 'E5-08-POLICY-CAPABILITY-BYPASS',
    environment: {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
    },
    harness_type: 'SIMULATED',
    harness_type_note:
      'The Capability/Policy enforcement layer (store.mjs) is a minimal deterministic rule evaluator, not a real PolicyEngine/CapabilityEngine (Phase 8/9 unstarted). Proves the enforcement logic for ADV-12/13/14, not that a real implementation behaves identically.',
    executed_cases: results.length,
    all_executed_pass: results.every((r) => r.pass === true),
    results,
  };
  writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));
  console.log(`\nSummary written to ${path.join(outDir, 'summary.json')}`);
  console.log(`All executed cases pass: ${summary.all_executed_pass}`);
}

await main();
