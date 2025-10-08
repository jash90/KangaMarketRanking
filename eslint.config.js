/**
 * ESLint Configuration
 *
 * Production-ready linting rules for React Native with TypeScript.
 * Integrates Prettier and code quality rules with expo-config-expo base.
 */

const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  // Base Expo configuration (includes import plugin)
  ...expoConfig,

  // Prettier integration (must come after other configs to override)
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      prettier: require('eslint-plugin-prettier'),
    },
    rules: {
      // Prettier integration
      'prettier/prettier': 'warn',

      // TypeScript
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Code quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      complexity: ['warn', 20],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'warn',
    },
  },

  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.expo/**',
      'coverage/**',
      '**/*.config.js',
      'babel.config.js',
      'metro.config.js',
    ],
  },
]);
