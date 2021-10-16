process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.env.BUILD_TARGET = 'electron';

process.on('unhandledRejection', (error) => {
  throw error;
});

// check
require('../utils/checkers');

const chalk = require('chalk');
const address = require('address');
const webpack = require('webpack');
const electron = require('electron');
const portFinder = require('portfinder');
const { spawn } = require('child_process');
const WebpackDevServer = require('webpack-dev-server');

const config = require('../config');
const paths = require('../config/paths');
const webpackMainProdConfig = require('./webpack/webpack.prod.config');
const webpackDevConfig = require('../web/webpack/webpack.dev.config');
const { printStatsLog, printElectronLog, printInstructions } = require('../utils/printer');
const { devServer } = config;

let electronProcess = null;
let isElectronManualRestarting = false;
let hotMiddleware = null;

function startRenderServer() {
  return new Promise(async (resolve, reject) => {
    const compiler = webpack(webpackDevConfig);

    portFinder
      .getPortPromise({
        port: devServer.port,
      })
      .then((port) => {
        devServer.port = port;

        const server = new WebpackDevServer({
          port,
          host: devServer.host,
          // hot: true, // 默认即为true，启用webpack.HotModuleReplacementPlugin()
          proxy: devServer.proxy,
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
            resolve();
          }
        });
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

function startElectron() {
  return new Promise((resolve) => {
    electronProcess = spawn(electron, ['--inspect=5858', paths.appElectronDistPath], {
      env: Object.assign({}, process.env, {
        RENDER_DEV_HOST_NAME: devServer.host === '0.0.0.0' ? 'localhost' : config.devServer.host,
        RENDER_DEV_PORT: devServer.port,
      }),
    });

    electronProcess.stdout.on('data', (data) => {
      printElectronLog(data, 'cyan');
    });

    electronProcess.stderr.on('data', (data) => {
      printElectronLog(data, 'red');
    });

    electronProcess.on('close', (code) => {
      if (!isElectronManualRestarting) {
        process.exit(code || 1);
      }
    });

    resolve();
  });
}

function startMainWatcher() {
  return new Promise((resolve, reject) => {
    webpackMainProdConfig.entry.index.unshift(paths.appElectronDevEntryFile);

    let firstTapDone = false;
    const compiler = webpack(webpackMainProdConfig);

    compiler.hooks.watchRun.tapAsync('watch-run', (compilation, done) => {
      printStatsLog('Main', chalk.cyan.bold('Main process compiling...'));
      if (hotMiddleware) {
        hotMiddleware.publish({ action: 'compiling' });
      }
      done();
    });

    compiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err);
        return;
      }
      printStatsLog('Main', stats);
    });

    compiler.hooks.done.tap('done', (stats) => {
      if (hotMiddleware) {
        hotMiddleware.publish({ action: 'reload' });
      }

      if (stats.hasErrors()) {
        if (!firstTapDone) {
          printStatsLog('Main', stats);
          firstTapDone = true;
          reject(stats);
        }
        return;
      }

      if (electronProcess && electronProcess.kill) {
        isElectronManualRestarting = true;

        process.kill(electronProcess.pid);

        startElectron().then(() => {
          setTimeout(() => {
            isElectronManualRestarting = false;
          }, 10000);
        });
      }

      if (!firstTapDone) {
        firstTapDone = true;
        resolve();
      }
    });
  });
}

async function start() {
  await startMainWatcher();
  printStatsLog('Main', chalk.green('Main Process Ready'));

  await startRenderServer();
  printStatsLog('Render', chalk.green('Render Process Ready'));

  await startElectron();
  printStatsLog('Electron', chalk.green('Electron Process Ready'));
}

start()
  .then(() => {
    printStatsLog('APP', chalk.green('All Ready'));
  })
  .catch(() => {
    printStatsLog(
      'Unknown',
      chalk.red('启动失败！请检查startRenderServer、startMainWatcher、startElectron是否有异常'),
    );
    process.exit(1);
  });
