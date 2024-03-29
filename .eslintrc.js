/**
 * 如果觉得规则不合适, 可以在rules中对规则进行覆盖
 * 配置规则 http://eslint.org/docs/user-guide/configuring (可切换为中文)
 * "off" or 0 - turn the rule off
 * "warn" or 1 - turn the rule on as a warning (doesn’t affect exit code)
 * "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
 */

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 5,
    sourceType: 'module',
  },
  env: {
    browser: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  plugins: [
    'html',
    'jest',
    'no-for-of-loops',
  ],
  settings: {
    'html/html-extensions': [
      '.html',
      '.vue',
    ],
  },
  globals: {
    $: true,
    page: true,
    browser: true,
    console: true,
  },
  // add your custom rules here
  rules: {
    'import/no-extraneous-dependencies': 0,
    'no-var': 0,
    'object-shorthand': 0,
    'vars-on-top': 0,
    'prefer-arrow-callback': 0,
    'func-names': 0,
    'no-restricted-properties': 0,
    'no-continue': 0,
    'no-param-reassign': 0,
    'prefer-destructuring': 0,
    'prefer-rest-params': 0,
    'no-restricted-syntax': 0,
    'no-prototype-builtins': 0,
    'consistent-return': 0,
    'prefer-template': 0,
    'prefer-spread': 0,
  },
};
