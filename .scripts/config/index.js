const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const { pascalCase } = require('change-case');
const childProcess = require('child_process');
const paths = require('./paths');
const { name, version, engines } = require(paths.appRootPkgJson);

let projectConfig = {};
const projectConfigPath = path.resolve(paths.appRootPath, '.project.config.js');
if (fs.existsSync(projectConfigPath)) {
  projectConfig = require(projectConfigPath);
}

// execSync
function execSync(cmd, options) {
  return childProcess.execSync(cmd, options).toString().trim();
}

module.exports = {
  // devServer
  devServer: {
    host: projectConfig.devServer.host ?? '0.0.0.0',
    port: projectConfig.devServer.port ?? 3000,
    proxy: { ...projectConfig.devServer.proxy }
  },

  output: {
    publicPath: process.env.BUILD_TARGET === 'electron' ? '' : '/',
  },

  // env
  bundleAnalyzer: process.env.BUNDLE_ANALYZER === '1',
  canUseSourceMap: process.env.GENERATE_SOURCEMAP === '1' || process.env.NODE_ENV !== 'production',

  // dll
  dllConfig: {
    entryKey: 'dll',
    filename: 'dll_scripts.js',
    library: 'dll_library',
    manifest: 'dll_manifest.json',
  },

  // 其他无关痛痒的参数
  name: pascalCase(name),
  version,
  enginesRequired: engines && engines.node ? engines : { ...engines, node: '>=10.13.0' },
  gitBranch: execSync('git rev-parse --abbrev-ref HEAD'),
  gitCommitHash: execSync('git show -s --format=%h'),
  buildTime: dayjs().format('YYYYMMDDHHmmss'),
};
