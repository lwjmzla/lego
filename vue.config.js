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
  devServer: {
    allowedHosts: ['.youbaobao.xyz', '.' + arr.join('') + '.com']
    // headers: {
    //   'Access-Control-Allow-Origin': '*'
    // },
    // proxy: {
    //   '/oss': {
    //     target: 'http://183.6.74.73:38007',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       ['^' + '/oss']: ''
    //     }
    //   }
    // }
  }
});
