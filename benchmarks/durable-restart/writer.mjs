// Throwaway E5 harness — not part of any @lablaunchpad/* package.
// Writes a checkpoint header row + N chunk rows inside one SQLite
// transaction, with a delay between chunk writes, so the parent process
// (run-e5.mjs) has a real window in which to SIGKILL this process mid-write.
import { DatabaseSync } from 'node:sqlite';
import { writeFileSync } from 'node:fs';

const [, , dbPath, checkpointId, chunkCountArg, delayMsArg] = process.argv;
const nChunks = Number(chunkCountArg);
const delayMs = Number(delayMsArg);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const db = new DatabaseSync(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS checkpoints (
    id TEXT PRIMARY KEY,
    status TEXT,
    expected_chunks INTEGER
  );
  CREATE TABLE IF NOT EXISTS checkpoint_chunks (
    checkpoint_id TEXT,
    seq INTEGER,
    payload TEXT,
    PRIMARY KEY (checkpoint_id, seq)
  );
`);
// Sentinel: written once the process has actually reached the point of
// opening the transaction, so the orchestrator can distinguish "killed
// before the writer even started" from "killed mid-transaction" instead of
// guessing from wall-clock delay alone (Node/ESM startup overhead is not
// negligible under a shared container).
writeFileSync(`${dbPath}.started`, String(Date.now()));

db.exec('BEGIN IMMEDIATE');
db.prepare('INSERT INTO checkpoints (id, status, expected_chunks) VALUES (?, ?, ?)').run(
  checkpointId,
  'writing',
  nChunks,
);
const insertChunk = db.prepare(
  'INSERT INTO checkpoint_chunks (checkpoint_id, seq, payload) VALUES (?, ?, ?)',
);

for (let i = 0; i < nChunks; i++) {
  insertChunk.run(checkpointId, i, 'x'.repeat(50000));
  await sleep(delayMs);
}

db.prepare('UPDATE checkpoints SET status = ? WHERE id = ?').run(
  'complete',
  checkpointId,
);
db.exec('COMMIT');
writeFileSync(`${dbPath}.committed`, String(Date.now()));
db.close();
process.exit(0);
