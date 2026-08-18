import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';
import {
  type Finding,
  type ValidatorOptions,
  type ValidatorResult,
  result,
} from '../lib/types.js';
import { collectFiles, readJson } from '../lib/workspace.js';

const run = promisify(execFile);

/**
 * M4 — evidence identity.
 *
 * `.context/evidence/*.json` receipts are decision-critical: `.context/research/
 * reconciliation/phase-gate.json` cites them, and its `lock_state` is what
 * answers "may Phase 2 implementation begin". Tracing that chain (M4.2) found
 * that no executable code consumes them - the consumer is an agent reading
 * JSON - so this validator cannot make a gate reject bad evidence. What it can
 * do, and what the chain actually needs, is ensure a receipt states enough
 * about its own production for a reader to judge it, and that what it states
 * is true of this repository.
 *
 * Deliberately discovery-based, not registry-based. F008 showed a registry is
 * itself a surface that can be silently narrowed; a directory convention has
 * no such configuration to omit. Every `.json` under `.context/evidence/` is
 * decision-critical by virtue of where it sits, so a new receipt is covered
 * the moment it is added rather than when someone remembers to register it.
 *
 * `UNKNOWN` is a first-class value throughout: a receipt that honestly records
 * an unknown toolchain passes, while one that omits the field entirely fails.
 * The rule being protected is that a reader can distinguish "we know this ran
 * on Node 24.19.0" from "we never recorded what it ran on" - collapsing those
 * two into a blank field is what makes unverified evidence look verified
 * (I-EVIDENCE-004).
 */

const UNKNOWN = 'UNKNOWN';
const SHA40 = /^[0-9a-f]{40}$/;
const PRODUCER_KINDS = new Set(['CI', 'LOCAL', 'AGENT_SESSION', UNKNOWN]);

/**
 * Freshness is a property of the claim, not a universal timestamp rule
 * (M4 §10). A phase receipt records what a phase did at a revision; that stays
 * true forever and must not be invalidated by later commits. A receipt
 * asserting something about the current tree is only meaningful at the
 * revision it was produced from.
 */
const CLAIM_SCOPES = new Set(['HISTORICAL', 'CURRENT_HEAD']);

interface Provenance {
  readonly claim_scope?: string;
  readonly producer?: { readonly kind?: string; readonly id?: string };
  readonly repository?: { readonly sha?: string; readonly ref?: string };
  readonly toolchain?: Readonly<Record<string, string>>;
  readonly recorded_at?: string;
}

interface Receipt {
  readonly provenance?: Provenance;
}

export async function evidenceProvenanceValidator(
  options: ValidatorOptions,
): Promise<ValidatorResult> {
  const { rootDir } = options;
  const findings: Finding[] = [];

  const evidenceDir = path.join(rootDir, '.context', 'evidence');
  const receipts = (await collectFiles(evidenceDir, ['.json'])).sort();

  let checked = 0;
  let shaVerified = 0;
  let unknownFields = 0;

  for (const absolute of receipts) {
    const relative = path.relative(rootDir, absolute).split(path.sep).join('/');
    checked += 1;

    let receipt: Receipt;
    try {
      receipt = await readJson<Receipt>(absolute);
    } catch (error) {
      findings.push({
        rule: 'evidence-provenance/unreadable',
        message: `${relative} could not be parsed as JSON: ${String(error)}`,
        path: relative,
      });
      continue;
    }

    const provenance = receipt.provenance;
    if (!provenance) {
      findings.push({
        rule: 'evidence-provenance/missing-provenance',
        message: `${relative} is a decision-critical receipt with no \`provenance\` block. It cannot state which revision, environment or producer its claims came from, so a reader cannot tell a verified claim from an unverified one.`,
        path: relative,
      });
      continue;
    }

    const scope = provenance.claim_scope;
    if (scope === undefined || !CLAIM_SCOPES.has(scope)) {
      findings.push({
        rule: 'evidence-provenance/invalid-claim-scope',
        message: `${relative}: provenance.claim_scope is ${JSON.stringify(scope)}; expected one of ${[...CLAIM_SCOPES].join(', ')}. Freshness is a property of the claim - a receipt must say whether it describes a moment in history or the current tree.`,
        path: relative,
      });
    }

    const kind = provenance.producer?.kind;
    if (kind === undefined || !PRODUCER_KINDS.has(kind)) {
      findings.push({
        rule: 'evidence-provenance/invalid-producer',
        message: `${relative}: provenance.producer.kind is ${JSON.stringify(kind)}; expected one of ${[...PRODUCER_KINDS].join(', ')}. CI evidence and local evidence are not interchangeable, so a receipt must say which it is.`,
        path: relative,
      });
    }

    for (const field of ['recorded_at', 'toolchain'] as const) {
      if (provenance[field] === undefined) {
        findings.push({
          rule: 'evidence-provenance/missing-field',
          message: `${relative}: provenance.${field} is absent. Record ${UNKNOWN} rather than omitting it - an omitted field is indistinguishable from one nobody thought about.`,
          path: relative,
        });
      }
    }

    const sha = provenance.repository?.sha;
    if (sha === undefined) {
      findings.push({
        rule: 'evidence-provenance/missing-sha',
        message: `${relative}: provenance.repository.sha is absent. Record ${UNKNOWN} if the producing revision was never captured.`,
        path: relative,
      });
      continue;
    }

    if (sha === UNKNOWN) {
      unknownFields += 1;
      continue;
    }

    if (!SHA40.test(sha)) {
      findings.push({
        rule: 'evidence-provenance/malformed-sha',
        message: `${relative}: provenance.repository.sha "${sha}" is neither ${UNKNOWN} nor a full 40-character commit id. An abbreviated or invented revision cannot be resolved by a reader.`,
        path: relative,
      });
      continue;
    }

    // A recorded revision that does not exist in this repository is worse than
    // no revision: it looks checkable and is not. Catches a fabricated sha and
    // a receipt carried over from a different repository.
    const resolves = await commitExists(rootDir, sha);
    if (!resolves) {
      findings.push({
        rule: 'evidence-provenance/unresolvable-sha',
        message: `${relative}: provenance.repository.sha ${sha} does not resolve to a commit in this repository. Evidence that names a revision nobody can check is not evidence.`,
        path: relative,
      });
      continue;
    }
    shaVerified += 1;

    if (scope === 'CURRENT_HEAD') {
      const head = await revParse(rootDir, 'HEAD');
      if (head !== undefined && head !== sha) {
        findings.push({
          rule: 'evidence-provenance/stale-current-head-claim',
          message: `${relative}: provenance.claim_scope is CURRENT_HEAD but its revision ${sha} is not HEAD (${head}). A claim about the current tree made at an older revision does not describe the current tree.`,
          path: relative,
        });
      }
    }
  }

  return result('evidence-provenance', findings, {
    receipts: checked,
    shaVerified,
    unknownProvenance: unknownFields,
  });
}

async function commitExists(rootDir: string, sha: string): Promise<boolean> {
  try {
    const { stdout } = await run('git', ['cat-file', '-t', sha], { cwd: rootDir });
    return stdout.trim() === 'commit';
  } catch {
    return false;
  }
}

async function revParse(rootDir: string, ref: string): Promise<string | undefined> {
  try {
    const { stdout } = await run('git', ['rev-parse', ref], { cwd: rootDir });
    return stdout.trim();
  } catch {
    return undefined;
  }
}
