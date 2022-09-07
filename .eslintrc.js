module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    semi: ['warn', 'always'],
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'no-use-before-define': 'off',
    'vuejs-accessibility/label-has-for': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'vuejs-accessibility/mouse-events-have-key-events': 'off',
    'vue/no-useless-template-attributes': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'no-unused-vars': 'off',
    'no-param-reassign': 'off',
    'import/no-cycle': 'off',
    'linebreak-style': 'off', // 回车换行风格
    'import/prefer-default-export': 'off',
    'prefer-object-spread': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-restricted-properties': 'off',
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
    'operator-assignment': ['error', 'always'],
    'arrow-body-style': 'off',
    'no-underscore-dangle': 'off',
    'no-async-promise-executor': 'off',
    'no-shadow': 'off',
    'vue/no-multi-spaces': 'error', // 不允许有多余的空格
    'vue/html-end-tags': 'error',
    'vue/no-spaces-around-equal-signs-in-attribute': ['error'],
    'vue/html-closing-bracket-newline': ['error', { // 多行 html 结束符需要换行
      singleline: 'never',
      multiline: 'always'
    }],
    'vue/html-indent': ['error', 2, {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true,
      ignores: ['VExpressionContainer']
    }],
    'vue/html-closing-bracket-spacing': ['error', {
      startTag: 'never',
      endTag: 'never',
      selfClosingTag: 'always'
    }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'max-len': ['error', { code: 150 }],
    'vue/max-attributes-per-line': 'off'
  }
};
