import { defineConfig } from 'vitest/config';

/**
 * Vitest `projects` — the configuration model that replaced the removed
 * `workspace` config in Vitest 3.2. `vitest.workspace.*` files are prohibited
 * in this repository; see docs/architecture/TEST-TAXONOMY.md.
 *
 * Each project maps to one layer of the test taxonomy so a single layer can be
 * run in isolation: `pnpm test --project contract`.
 */
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['**/*.unit.test.ts'],
          exclude: ['**/node_modules/**', '**/dist/**', 'tests/fixtures/**'],
        },
      },
      {
        test: {
          name: 'contract',
          include: ['**/*.contract.test.ts'],
          exclude: ['**/node_modules/**', '**/dist/**', 'tests/fixtures/**'],
        },
      },
      {
        test: {
          name: 'integration',
          include: ['**/*.integration.test.ts'],
          exclude: ['**/node_modules/**', '**/dist/**', 'tests/fixtures/**'],
        },
      },
      {
        test: {
          name: 'adversarial',
          include: ['**/*.adversarial.test.ts'],
          exclude: ['**/node_modules/**', '**/dist/**', 'tests/fixtures/**'],
        },
      },
      {
        test: {
          name: 'portability',
          include: ['**/*.portability.test.ts'],
          exclude: ['**/node_modules/**', '**/dist/**', 'tests/fixtures/**'],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'json-summary'],
      include: ['packages/*/src/**', 'scripts/repo-tools/src/**'],
      // Reported, not gated. A threshold over a placeholder package measures
      // nothing; it is derived from a measured baseline in Phase 3.
      thresholds: undefined,
    },
  },
});
