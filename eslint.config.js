import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'dist-ssr']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // Build tooling, tests, and the Netlify edge function run outside the
    // browser and outside the React component model.
    files: ['scripts/**/*.mjs', 'tests/**/*.js', 'netlify/**/*.js', '*.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.node, URLPattern: 'readonly' },
    },
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
