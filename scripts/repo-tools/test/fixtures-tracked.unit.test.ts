import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = path.resolve(import.meta.dirname, '../../..');

/**
 * Regression guard for a defect CI caught on the very first run.
 *
 * `.gitignore` carried a blanket `dist/` rule, which silently swallowed
 * `tests/fixtures/exports/no-smoke/.../dist/index.js`. The fixture existed on
 * the machine that created it, so the suite passed locally; in CI the file had
 * never been committed, the package looked unbuilt, and the validator returned
 * a different finding than the test asserted.
 *
 * A fixture git cannot see is a fixture that only works where it was written.
 */
describe('test fixtures', () => {
  it('are all tracked by git', () => {
    const ignored = execFileSync(
      'git',
      ['status', '--ignored', '--porcelain', 'tests/fixtures'],
      { cwd: ROOT, encoding: 'utf8' },
    )
      .split('\n')
      .filter((line) => line.startsWith('!!'))
      .map((line) => line.slice(3).trim());

    expect(ignored).toEqual([]);
  });

  it('include the built fixture the package-exports validator depends on', () => {
    const tracked = execFileSync('git', ['ls-files', 'tests/fixtures/exports/no-smoke'], {
      cwd: ROOT,
      encoding: 'utf8',
    });

    expect(tracked).toContain('packages/published/dist/index.js');
  });
});
