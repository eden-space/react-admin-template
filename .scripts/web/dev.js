/**
 * 为了与生产行为一致（参考build.js注释）此处用 BUILD_ENV 接管 NODE_ENV 并对其重新赋值
 */
if (!process.env.BUILD_ENV && process.env.NODE_ENV) {
  process.env.BUILD_ENV = process.env.NODE_ENV;
}

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', (error) => {
  throw error;
});

// check
require('../utils/checkers');

const open = require('open');
const address = require('address');
const webpack = require('webpack');
const portFinder = require('portfinder');
const WebpackDevServer = require('webpack-dev-server');

const config = require('../config');
const webpackDevConfig = require('./webpack/webpack.dev.config');
const { printInstructions } = require('../utils/printer');
const compiler = webpack(webpackDevConfig);

portFinder
  .getPortPromise({
    port: config.devServer.port,
  })
  .then((port) => {
    const server = new WebpackDevServer({
      port,
      host: config.devServer.host,
      // open: true, // 默认为false，本项目不启用，下面需要定制逻辑
      // hot: true, // 默认为true，启用webpack.HotModuleReplacementPlugin()
      liveReload: false, // devServer.hot 配置项必须禁用
      proxy: config.devServer.proxy,
      historyApiFallback: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
        logging: 'error',
        progress: true,
      },
    }, compiler);

    server.start();

    let firstTapDone = false;
    const localUrl = `http://localhost:${port}`;
    const networkUrl = `http://${address.ip()}:${port}`;

    compiler.hooks.done.tap('done', () => {
      setTimeout(() => {
        printInstructions(localUrl, networkUrl);
      }, 500);

      if (!firstTapDone) {
        firstTapDone = true;
        open(localUrl);
      }
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
