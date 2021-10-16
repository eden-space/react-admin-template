const chalk = require('chalk');
const { printName, printEnvironment } = require('./printer');
const { nodeVersionCheck, nodeEnvCheck } = require('./functions');

// logo
printName();

// Node Version
nodeVersionCheck();

// NODE_ENV
nodeEnvCheck();

console.log(chalk.gray(` 本次运行参数:`));
// env
printEnvironment();
console.log();
