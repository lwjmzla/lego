module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  // transform: {
  //   '^.+\\.vue$': 'vue-jest'
  // },
  watchPathIgnorePatterns: ['node_modules'],
  // !防止引入第三方库报错
  transformIgnorePatterns: [
    '/!node_modules\\/lodash-es/', '/!node_modules\\/rgb-hex/'
  ]
};
