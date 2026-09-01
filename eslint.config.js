// ESLint 9 requires a flat config, and the repo had none — `npm run lint` has
// been erroring out rather than linting anything.
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';

export default [
  { ignores: ['dist/**', 'node_modules/**', 'dist-ssr'] },
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh, react },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Without this, no-unused-vars cannot see components referenced only
      // from JSX and reports every one of them as dead.
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'error',
      // The app is one large file of components; this rule is about fast
      // refresh ergonomics, not correctness.
      'react-refresh/only-export-components': 'off',
      // Empty catch blocks are used deliberately for storage and network
      // fallbacks that must not break the page.
      'no-empty': ['error', { allowEmptyCatch: true }],
      // Catch params are deliberately unused in the storage and network
      // fallbacks that must never break the page.
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }],
      // Both were deferred as warnings when this config landed and are now
      // fixed, so they are errors again and cannot regress quietly.
      'react-hooks/static-components': 'error',
      'react-hooks/set-state-in-effect': 'error',
    },
  },
  {
    // The Netlify functions run on the server and use its globals.
    files: ['netlify/**/*.mjs', 'scripts/**/*.mjs'],
    languageOptions: { globals: { ...globals.node, Netlify: 'readonly' } },
  },
];
