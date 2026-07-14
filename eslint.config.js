// ESLint flat config (ESLint 9+).
// Braille-Reference is a single-file project during the adoption phase.
// The rest of the JavaScript will move to js/ when the full file-split
// milestone runs (see docs/decisions/001-single-file-structure.md).
// js/braille-data.js was extracted early, as a minimal, partial step, so
// the braille data set and its conversion helpers could be unit tested
// (see work 050); it and its test file use ES module syntax, unlike a
// hand-written script-mode inline script. This config applies to *.js
// and js/**/*.js but ignores count.js (third-party GoatCounter script)
// and node_modules.
//
// Browser globals come from the `globals` package so the no-undef rule
// catches real undefined references without a hand-kept list. Test files
// also need Node globals, since Vitest runs them under Node.

import globals from 'globals';

export default [
  {
    ignores: ['count.js', 'node_modules/**'],
  },
  {
    files: ['js/**/*.js'],
    ignores: ['js/**/*.test.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      'no-unused-vars': ['error', { caughtErrorsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'eqeqeq': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
    },
  },
  {
    files: ['js/**/*.test.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'no-unused-vars': ['error', { caughtErrorsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'eqeqeq': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
    },
  },
];
