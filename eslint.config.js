// ESLint flat config (ESLint 9+).
// Braille-Reference is a single-file project during the adoption phase.
// JavaScript will move to js/ when the file-split milestone runs (see
// docs/decisions/001-single-file-structure.md). This config applies to
// *.js and js/**/*.js but ignores count.js (third-party GoatCounter
// script) and node_modules.
//
// Browser globals come from the `globals` package so the no-undef rule
// catches real undefined references without a hand-kept list.

import globals from 'globals';

export default [
  {
    ignores: ['count.js', 'node_modules/**'],
  },
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
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
];
