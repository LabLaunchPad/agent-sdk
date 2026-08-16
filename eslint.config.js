import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import importX from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores([
    '**/dist/**',
    '**/node_modules/**',
    '**/coverage/**',
    'tests/fixtures/**',
    'tmp/**',
    '.tmp/**',
  ]),

  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        projectService: {
          // eslint.config.js is not a member of any package tsconfig, and
          // allowJs is off, so the project service cannot find it on its own.
          allowDefaultProject: ['eslint.config.js'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { 'import-x': importX },
    rules: {
      /**
       * The load-bearing rule for ADR-0002. Under `moduleResolution: nodenext`
       * a relative import without an explicit `.js` extension type-checks fine
       * and then fails at runtime once the package is published. This catches it
       * at author time; the package-exports smoke test catches it again at
       * publish time.
       */
      'import-x/extensions': ['error', 'ignorePackages'],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Tooling targets Node by design and is never published, so it is exempt from
  // the runtime-neutrality rule enforced by package-boundary-validator.
  {
    files: ['scripts/**/*.ts', 'eslint.config.js', 'vitest.config.ts'],
    rules: {
      'no-console': 'off',
    },
  },
]);
