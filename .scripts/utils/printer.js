const os = require('os');
const chalk = require('chalk');
const figlet = require('figlet');
const { capitalCase } = require('change-case');
const { execSync } = require('./functions');
const {
  name,
  version,
  gitBranch,
  gitCommitHash,
  enginesRequired,
} = require('../config');
const buildTarget = process.env.BUILD_TARGET;

function printName() {
  const cols = process.stdout.columns;
  try {
    if (cols < 104) {
      console.log(` ${chalk.yellowBright(capitalCase(name))}`);
      console.log();
    } else {
      console.log(chalk.grey(figlet.textSync(capitalCase(name))));
    }
  } catch (err) {
    console.log(err);
  }
}

function printEnvironment() {
  console.log(chalk.cyan(` name: ${chalk.yellow(name)}`));
  console.log(chalk.cyan(` version: ${chalk.yellow(version)}`));
  console.log(chalk.cyan(` branch: ${chalk.yellow(gitBranch)}`));
  console.log(
    chalk.cyan(
      ` last commit: ${chalk.yellow(`${execSync('git log -1 --pretty=%s%b')}`)}${chalk.grey(`(${gitCommitHash})`)}`,
    ),
  );

  console.log(
    chalk.cyan(
      ` NODE_ENV: ${chalk.yellow(
        process.env.NODE_ENV,
      )}${chalk.grey('(development|test|production)')}`,
    ),
  );
  console.log(
    chalk.cyan(
      ` BUILD_ENV: ${chalk.yellow(process.env.BUILD_ENV)}${chalk.grey('(自定义，打包脚本无关)')}`,
    ),
  );
  console.log(chalk.cyan(` buildTarget: ${chalk.yellow(buildTarget)}${chalk.grey('(web|electron)')}`));

  console.log(chalk.cyan(` Node.js: ${chalk.yellow(process.version)}${chalk.grey(`(${enginesRequired.node})`)}`));
  console.log(
    chalk.cyan(
      ` OS: ${chalk.yellow(os.userInfo().username, os.type(), os.platform(), os.arch())}`,
    ),
  );
}

function printInstructions(localUrl, networkUrl) {
  console.log();
  console.log(chalk.cyan(' Server running at:'));
  console.log(` ${chalk.bold(`${chalk.green('✔')} Local:`)}   ${chalk.blue(localUrl)}`);
  console.log(` ${chalk.bold(`${chalk.green('✔')} Network:`)} ${chalk.blue(networkUrl)}`);
  console.log();
  console.log('Note that the development build is not optimized.');
  console.log(
    `To create a production build, run ${chalk.cyan('npm run build')} for browser, run ${chalk.cyan(
      'npm run package',
    )} for electron.`,
  );
  console.log();
}

function printStatsLog(proc, data) {
  let log = '';

  log += chalk.green.bold(`┏ ${proc} Process ${new Array(28 - proc.length).join('-')}`);
  log += '\n';

  if (typeof data === 'object') {
    data
      .toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
      })
      .split(/\r?\n/)
      .forEach((line) => {
        line = line.replace(/\r?\n/gm, '');
        if (line) {
          log += '  ' + line + '\n';
        }
      });
  } else {
    log += `  ${data}\n`;
  }

  log += chalk.green.bold(`┗ ${new Array(36 + 1).join('-')}`) + '\n';

  console.log(log);
}

function printElectronLog(data, color) {
  let log = '';
  data = data.toString().split(/\r?\n/);
  data.forEach((line) => {
    line = line.replace(/\r?\n/gm, '').trim();
    if (line) {
      log += `  ${line}\n`;
    }
  });

  if (/[0-9A-z]+/.test(log)) {
    console.log(
      chalk[color].bold('┏ Electron ---------------------------') +
        '\n' +
        log.replace(/^(\r?\n)*/, '').replace(/(\r?\n)*&/, '') +
        chalk[color].bold('┗ ------------------------------------'),
    );
  }
}

module.exports = {
  printName,
  printEnvironment,
  printInstructions,
  printStatsLog,
  printElectronLog,
};
