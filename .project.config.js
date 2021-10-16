const childProcess = require("child_process");
const { pascalCase } = require('change-case');
const dayjs = require("dayjs");
const pkg = require('./package.json');

const config = {
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/mock': {
        target: 'http://localhost:10086',
        changeOrigin: true,
        pathRewrite: {
          '^/mock': '/mock',
        },
      },
      '/api': {
        target: 'http://localhost:1008611',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api',
        },
      },
    },
  },
  // 方便动态取值，优先级高于.env.* 的定义
  env: {
    BUILD_ENV: process.env.BUILD_ENV, // eg. dev | test | uat | pre | prod
    BUILD_TARGET: process.env.BUILD_TARGET,
    BUNDLE_ANALYZER: process.env.BUNDLE_ANALYZER,
    GENERATE_SOURCEMAP: process.env.GENERATE_SOURCEMAP || process.env.BUILD_ENV !== 'prod',
  },
  meta: {
    name: pascalCase(pkg.name),
    version: pkg.version,
  }
}

module.exports = config;

