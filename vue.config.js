const path = require('path');
const { defineConfig } = require('@vue/cli-service');
const resolve = (dir) => path.join(__dirname, './', dir);

const arr = ['i', 'b', 'a', 'i', 'b', 'u'];

module.exports = defineConfig({
  configureWebpack: (config) => {
    // 调试JS
    config.devtool = 'source-map';
  },
  css: {
    // 查看CSS属于哪个css文件
    sourceMap: true
  },
  chainWebpack: (config) => {
    // 别名
    config.resolve.alias
      .set('@', resolve('src'));
  },
  devServer: { allowedHosts: ['.youbaobao.xyz', '.' + arr.join('') + '.com'] }
});
