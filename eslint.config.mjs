// Single flat ESLint config for the whole monorepo.
// Shared TypeScript rules everywhere; extra React rules scoped to the frontend.

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // Files ESLint should never look at.
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', 'backend/prisma/migrations/**'],
  },

  // Base recommended rule sets.
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Backend = Node environment.
  {
    files: ['backend/**/*.ts'],
    languageOptions: { globals: { ...globals.node } },
  },

  // Frontend = browser + React.
  {
    files: ['frontend/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // Generated shadcn/ui primitives: allow exporting variants next to components.
  {
    files: ['frontend/src/components/ui/**/*.{ts,tsx}'],
    plugins: { 'react-refresh': reactRefresh },
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },

  // Shared rule tweaks for all TS files.
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
    },
  },

  // Turn off rules that conflict with Prettier (must be last).
  prettier,
);
