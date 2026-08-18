// E5-DURABLE-RESTART — throwaway orchestrator, not part of any
// @lablaunchpad/* package (Phase 2 has not started; this validates an
// environmental claim, not SDK code). See research/benchmarks/E5-DURABLE-RESTART.md.
import { spawn } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';
import { existsSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'runs');
mkdirSync(outDir, { recursive: true });

const NCHUNKS = 6;
const DELAY_PER_CHUNK_MS = 40;
// Total in-transaction duration is roughly NCHUNKS * DELAY_PER_CHUNK_MS =
// 240ms, once the process has actually started. First pass (see this
// script's own git history / E5-RESULT.md) found Node/ESM child-process
// startup overhead under this container was itself close to 80ms, larger
// than expected — these delays were widened, and the .started/.committed
// sentinel files added, specifically because that first pass produced an
// uninformative all-ROLLED_BACK_CLEANLY result that couldn't distinguish
// "never reached the transaction" from "SQLite protected us mid-transaction".
const trials = [10, 100, 150, 180, 200, 220, 250, 300, 400, 600, 1000];

const results = [];

for (let t = 0; t < trials.length; t++) {
  const killAfterMs = trials[t];
  const dbPath = path.join(outDir, `trial-${t}.db`);
  for (const ext of ['', '-journal', '-wal', '-shm', '.started', '.committed']) {
    const p = dbPath + ext;
    if (existsSync(p)) rmSync(p);
  }
  const checkpointId = `cp-${t}`;

  const child = spawn(
    process.execPath,
    [
      path.join(__dirname, 'writer.mjs'),
      dbPath,
      checkpointId,
      String(NCHUNKS),
      String(DELAY_PER_CHUNK_MS),
    ],
    { stdio: 'ignore' },
  );

  child.on('error', (err) => {
    console.error(`trial ${t} child process error:`, err);
  });

  await new Promise((resolve) => setTimeout(resolve, killAfterMs));
  const alreadyExited = child.exitCode !== null;
  if (!alreadyExited) child.kill('SIGKILL');
  await Promise.race([
    new Promise((resolve) => child.on('exit', resolve)),
    new Promise((resolve) => setTimeout(resolve, 3000)),
  ]);

  let outcome;
  try {
    const db2 = new DatabaseSync(dbPath);
    const integrity = db2.prepare('PRAGMA integrity_check').get();
    let header;
    try {
      header = db2.prepare('SELECT * FROM checkpoints WHERE id = ?').get(checkpointId);
    } catch {
      header = undefined;
    }
    let chunkCountFound = 0;
    if (header) {
      const row = db2
        .prepare('SELECT COUNT(*) as n FROM checkpoint_chunks WHERE checkpoint_id = ?')
        .get(checkpointId);
      chunkCountFound = Number(row.n);
    }
    let verdict;
    if (!header) {
      verdict = 'ROLLED_BACK_CLEANLY';
    } else if (header.status === 'complete' && chunkCountFound === NCHUNKS) {
      verdict = 'COMMITTED_CLEANLY';
    } else {
      verdict = 'CORRUPTED_PARTIAL_STATE';
    }
    outcome = {
      trial: t,
      killAfterMs,
      processExitedBeforeKillSignal: alreadyExited,
      transactionStarted: existsSync(`${dbPath}.started`),
      transactionCommittedBeforeKill: existsSync(`${dbPath}.committed`),
      integrityCheck: integrity.integrity_check,
      headerFound: Boolean(header),
      headerStatus: header ? header.status : null,
      chunkCountFound,
      expectedChunks: NCHUNKS,
      verdict,
    };
    db2.close();
  } catch (err) {
    outcome = {
      trial: t,
      killAfterMs,
      processExitedBeforeKillSignal: alreadyExited,
      verdict: 'DB_UNREADABLE_AFTER_KILL',
      error: String(err),
    };
  }
  results.push(outcome);
  console.log(JSON.stringify(outcome));
}

const summaryPath = path.join(outDir, 'summary.json');
writeFileSync(
  summaryPath,
  JSON.stringify(
    {
      environment: {
        node: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      nChunks: NCHUNKS,
      delayPerChunkMs: DELAY_PER_CHUNK_MS,
      trials: results,
    },
    null,
    2,
  ),
);
console.log(`\nSummary written to ${summaryPath}`);
