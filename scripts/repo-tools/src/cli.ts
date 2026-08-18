#!/usr/bin/env node
import path from 'node:path';
import process from 'node:process';
import {
  EXIT_OK,
  EXIT_USAGE_ERROR,
  EXIT_VALIDATION_FAILED,
  EXIT_VERIFY_BLOCKED,
  VALIDATOR_NAMES,
  type ValidatorName,
  type ValidatorResult,
} from './lib/types.js';
import {
  contextStalenessValidator,
  refreshContext,
} from './validators/context-staleness.js';
import { derivedProjectionConsistencyValidator } from './validators/derived-projection-consistency.js';
import { evidenceProvenanceValidator } from './validators/evidence-provenance.js';
import { okfConformanceValidator } from './validators/okf-conformance.js';
import { packageBoundaryValidator } from './validators/package-boundary.js';
import { packageExportsValidator } from './validators/package-exports.js';
import { repositoryPolicyValidator } from './validators/repository-policy.js';
import { researchIntegrityValidator } from './validators/research-integrity.js';
import { schemaContractValidator } from './validators/schema-contract.js';
import { writeFacts } from './lib/facts-writer.js';
import { checkNodeBaseline } from './lib/toolchain.js';

const VALIDATORS = {
  'schema-contract': schemaContractValidator,
  'package-boundary': packageBoundaryValidator,
  'context-staleness': contextStalenessValidator,
  'okf-conformance': okfConformanceValidator,
  'package-exports': packageExportsValidator,
  'repository-policy': repositoryPolicyValidator,
  'research-integrity': researchIntegrityValidator,
  'derived-projection-consistency': derivedProjectionConsistencyValidator,
  'evidence-provenance': evidenceProvenanceValidator,
} as const satisfies Record<
  ValidatorName,
  (options: { rootDir: string }) => Promise<ValidatorResult>
>;

const USAGE = `repo-tools — LabLaunchPad Agent SDK repository validators

Usage:
  repo-tools validate [<validator>...] [--json]
  repo-tools smoke [--json]
  repo-tools context check [--json]
  repo-tools context refresh
  repo-tools facts write

Validators:
${VALIDATOR_NAMES.map((name) => `  ${name}`).join('\n')}

Exit codes:
  0  all checks passed
  1  at least one check failed
  2  usage error
  3  VERIFY_BLOCKED — checks did not run; the environment cannot produce evidence

Validation commands refuse to run on a Node version other than \`.nvmrc\`'s
baseline, because a green run on the wrong version is not evidence. Pass
\`--allow-toolchain-mismatch\` to proceed anyway; the run is then explicitly
not evidence.

\`context refresh\` rewrites cache hashes and must never run in CI: auto-refresh
would rubber-stamp drift instead of reporting it.

\`facts write\` regenerates every GENERATED:START/END region from its canonical
fact and must never run in CI, for the same reason: it would rubber-stamp
drift into agreement instead of reporting it via
\`validate derived-projection-consistency\`.
`;

async function main(argv: readonly string[]): Promise<number> {
  const rootDir = process.env.REPO_ROOT ?? path.resolve(import.meta.dirname, '../../..');
  const json = argv.includes('--json');
  const allowMismatch = argv.includes('--allow-toolchain-mismatch');
  const positional = argv.filter((argument) => !argument.startsWith('--'));
  const [command, ...rest] = positional;

  switch (command) {
    case 'validate':
      if (!(await enforceToolchain(rootDir, allowMismatch))) return EXIT_VERIFY_BLOCKED;
      return runValidators(rootDir, selectValidators(rest), json);

    case 'smoke':
      if (!(await enforceToolchain(rootDir, allowMismatch))) return EXIT_VERIFY_BLOCKED;
      return runValidators(rootDir, ['package-exports'], json);

    case 'context': {
      const subcommand = rest[0];
      if (subcommand === 'check') {
        if (!(await enforceToolchain(rootDir, allowMismatch))) return EXIT_VERIFY_BLOCKED;
        return runValidators(rootDir, ['context-staleness'], json);
      }
      if (subcommand === 'refresh') {
        const outcome = await refreshContext(rootDir);
        for (const file of outcome.refreshed) console.log(`refreshed  ${file}`);
        for (const file of outcome.unresolved) console.error(`unresolved ${file}`);
        console.log(
          `\n${String(outcome.refreshed.length)} refreshed, ${String(outcome.unresolved.length)} unresolved`,
        );
        return outcome.unresolved.length > 0 ? EXIT_VALIDATION_FAILED : EXIT_OK;
      }
      console.error(`Unknown context subcommand: ${String(subcommand)}\n\n${USAGE}`);
      return EXIT_USAGE_ERROR;
    }

    case 'facts': {
      const subcommand = rest[0];
      if (subcommand === 'write') {
        const outcome = await writeFacts(rootDir);
        for (const file of outcome.updated) console.log(`updated    ${file}`);
        for (const file of outcome.unchanged) console.log(`unchanged  ${file}`);
        for (const failure of outcome.failed) {
          console.error(`failed     ${failure.file}: ${failure.error}`);
        }
        console.log(
          `\n${String(outcome.updated.length)} updated, ${String(outcome.unchanged.length)} unchanged, ${String(outcome.failed.length)} failed`,
        );
        return outcome.failed.length > 0 ? EXIT_VALIDATION_FAILED : EXIT_OK;
      }
      console.error(`Unknown facts subcommand: ${String(subcommand)}\n\n${USAGE}`);
      return EXIT_USAGE_ERROR;
    }

    default:
      console.error(USAGE);
      return command === undefined ? EXIT_USAGE_ERROR : EXIT_USAGE_ERROR;
  }
}

function selectValidators(requested: readonly string[]): ValidatorName[] {
  if (requested.length === 0) return [...VALIDATOR_NAMES];

  const selected: ValidatorName[] = [];
  for (const name of requested) {
    if (!VALIDATOR_NAMES.includes(name as ValidatorName)) {
      throw new Error(`Unknown validator: ${name}`);
    }
    selected.push(name as ValidatorName);
  }
  return selected;
}

/**
 * Gate every validation run on the declared Node baseline before it can
 * produce a trustworthy verdict. Returns true when the run may proceed.
 *
 * A mismatch yields VERIFY_BLOCKED, not FAIL and not PASS: the checks did not
 * run, so their outcome is unknown rather than good or bad. `--allow-toolchain-mismatch`
 * exists for deliberate local exploration and still refuses to call the run
 * evidence.
 */
async function enforceToolchain(
  rootDir: string,
  allowMismatch: boolean,
): Promise<boolean> {
  const check = await checkNodeBaseline(rootDir);
  if (check.ok) return true;

  console.error(
    `VERIFY_BLOCKED  toolchain  expected Node ${check.expected} (.nvmrc), running ${check.actual}`,
  );
  console.error(
    "        .context/state/runtime.json: 'A green run on a Node version other than the baseline is not evidence.'",
  );

  if (!allowMismatch) {
    console.error(
      '        Use the baseline Node, or pass --allow-toolchain-mismatch for a run that is explicitly NOT evidence.',
    );
    return false;
  }

  console.error(
    '        --allow-toolchain-mismatch set: continuing, but this run is NOT evidence.',
  );
  return true;
}

async function runValidators(
  rootDir: string,
  names: readonly ValidatorName[],
  json: boolean,
): Promise<number> {
  const results: ValidatorResult[] = [];
  for (const name of names) {
    results.push(await VALIDATORS[name]({ rootDir }));
  }

  if (json) {
    console.log(JSON.stringify({ rootDir, results }, null, 2));
  } else {
    report(results);
  }

  return results.some((entry) => entry.status === 'FAIL')
    ? EXIT_VALIDATION_FAILED
    : EXIT_OK;
}

function report(results: readonly ValidatorResult[]): void {
  for (const entry of results) {
    const stats = entry.stats
      ? Object.entries(entry.stats)
          .map(([key, value]) => `${key}=${String(value)}`)
          .join(' ')
      : '';
    console.log(
      `${entry.status === 'PASS' ? 'PASS' : 'FAIL'}  ${entry.validator}  ${stats}`,
    );

    for (const finding of entry.findings) {
      console.log(`      ${finding.rule}`);
      console.log(`        ${finding.message}`);
      if (finding.path !== undefined) console.log(`        at ${finding.path}`);
    }
  }

  const failed = results.filter((entry) => entry.status === 'FAIL').length;
  console.log(
    `\n${String(results.length - failed)}/${String(results.length)} validators passed`,
  );
}

try {
  process.exitCode = await main(process.argv.slice(2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = EXIT_USAGE_ERROR;
}
