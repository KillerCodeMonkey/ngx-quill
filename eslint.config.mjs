// @ts-check
import js from '@eslint/js'
import json from '@eslint/json'
import stylistic from '@stylistic/eslint-plugin'
import angular from 'angular-eslint'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(
  {
    ignores: ['.nx', 'coverage', 'dist', '.angular', 'node_modules']
  },

  {
    name: 'tsc options',
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['tsconfig.json', 'e2e/tsconfig.json', 'projects/ngx-quill/tsconfig.lib.json', 'projects/ngx-quill/tsconfig.spec.json'],
        tsconfigRootDir: __dirname
      }
    }
  },

  {
    name: 'angular ts recommended rules',
    files: ['**/*.ts'],
    plugins: {
      '@stylistic': stylistic
    },
    extends: [
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended
    ],
    rules: {
      '@angular-eslint/no-output-on-prefix': 'off',

      '@stylistic/no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxBOF: 0,
          maxEOF: 1
        }
      ],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'none',
            requireLast: true
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false
          },
          multilineDetection: 'brackets'
        }
      ],
      '@stylistic/object-property-newline': ['error'],
      '@stylistic/object-curly-newline': ['error'],
      '@stylistic/object-curly-spacing': ['error', 'always'],

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'parameter',
          format: ['camelCase'],
          filter: {
            regex: '^Quill$',
            match: false
          }
        }
      ]
    }
  },

  {
    name: 'angular template recommended rules',
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility
    ],
    rules: {
      '@angular-eslint/template/no-negated-async': 'off'
    }
  },

  {
    name: 'JS',
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    plugins: {
      js,
      '@stylistic': stylistic
    },
    extends: [js.configs.recommended, stylistic.configs['recommended']],
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      '@stylistic/no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxBOF: 0,
          maxEOF: 1
        }
      ],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'none',
            requireLast: true
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false
          },
          multilineDetection: 'brackets'
        }
      ],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/object-property-newline': ['error'],
      '@stylistic/object-curly-newline': ['error'],
      '@stylistic/object-curly-spacing': ['error', 'always']
    }
  },

  // lint JSON files
  {
    files: ['**/*.json'],
    plugins: {
      json,
      '@stylistic': stylistic
    },
    ignores: ['package-lock.json'],
    language: 'json/json',
    extends: [json.configs.recommended]
  },

  // lint JSONC files
  {
    files: ['**/*.jsonc'],
    plugins: {
      json,
      '@stylistic': stylistic
    },
    language: 'json/jsonc',
    extends: [json.configs.recommended]
  },

  // lint JSON5 files
  {
    files: ['**/*.json5'],
    plugins: {
      json,
      '@stylistic': stylistic
    },
    language: 'json/json5',
    extends: [json.configs.recommended]
  }
)
