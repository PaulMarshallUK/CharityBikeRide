import vuePlugin from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default [
  {
    files: ['**/*.vue'],
    plugins: {
      vue: vuePlugin,
      prettier: prettier
    },
    languageOptions: {
      parser: vuePlugin.parserVue,
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',
      'vue/multi-word-component-names': 'off',
      'prettier/prettier': 'error'
    }
  },
  {
    files: ['**/*.js'],
    plugins: {
      prettier: prettier
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',
      'prettier/prettier': 'error'
    }
  },
  prettierConfig
]
