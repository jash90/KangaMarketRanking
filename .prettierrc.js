/**
 * Prettier Configuration
 *
 * Code formatting rules optimized for React Native development.
 * Follows industry standards and React Native best practices.
 */

module.exports = {
  // Line length
  printWidth: 100,

  // Indentation
  tabWidth: 2,
  useTabs: false,

  // Quotes and semicolons
  singleQuote: true,
  semi: true,

  // Trailing commas (ES5 compatible)
  trailingComma: 'es5',

  // Brackets and spaces
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',

  // JSX
  jsxSingleQuote: false,

  // End of line
  endOfLine: 'lf',

  // Prose wrap (markdown, comments)
  proseWrap: 'preserve',

  // React Native specific
  overrides: [
    {
      files: '*.{ts,tsx}',
      options: {
        parser: 'typescript',
      },
    },
    {
      files: '*.{js,jsx}',
      options: {
        parser: 'babel',
      },
    },
  ],
};
