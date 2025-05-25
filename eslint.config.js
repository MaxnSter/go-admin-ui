import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'

export default [
  // JavaScript 基础配置
  js.configs.recommended,
  
  // Vue 3 配置
  ...vue.configs['flat/recommended'],
  
  // Node.js 脚本配置
  {
    files: ['scripts/**/*.{js,cjs}', '*.config.{js,cjs}'],
    languageOptions: {
      globals: {
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        exports: 'readonly'
      }
    },
    rules: {
      'no-console': 'off'
    }
  },
  
  // TypeScript 配置
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': typescript
    },
    rules: {
      ...typescript.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn'
    }
  },
  
  // Vue 文件配置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vue.configs.base.languageOptions.parser,
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      vue: vue,
      '@typescript-eslint': typescript
    },
    rules: {
      ...vue.configs['flat/recommended'].rules,
      ...typescript.configs.recommended.rules,
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'off',
      'vue/html-self-closing': ['error', {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn'
    }
  },
  
  // 通用规则
  {
    files: ['**/*.{js,ts,vue}'],
    rules: {
      // 基础规则
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': 'off', // 由 TypeScript 处理
      'no-undef': 'off', // 由 TypeScript 处理
      
      // 代码质量
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      
      // 代码风格
      'comma-dangle': ['error', 'never'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      
      // 禁用一些过于严格的规则
      'no-useless-escape': 'warn',
      'no-useless-catch': 'warn'
    }
  },
  
  // 忽略文件
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'public/**',
      '**/*.d.ts',
      'auto-imports.d.ts',
      'components.d.ts',
      'src/utils/generator/render.js',
      'src/components/FormGenRender/slots/*.js'
    ]
  }
] 