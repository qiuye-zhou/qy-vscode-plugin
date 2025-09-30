const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  {
    ignores: [
      'out/**',
      'dist/**',
      '**/*.d.ts'
    ]
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier: prettier,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE']
        },
        {
          selector: 'function',
          format: ['camelCase']
        },
        {
          selector: 'class',
          format: ['PascalCase']
        },
        {
          selector: 'interface',
          format: ['PascalCase']
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase']
        }
      ],
      'semi': ['error', 'never'], // 不要求分号
      'curly': 'warn',
      'eqeqeq': 'warn',
      'no-throw-literal': 'warn'
    }
  }
];