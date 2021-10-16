const fs = require('fs');
const path = require('path');

const rootDirectory = fs.realpathSync(process.cwd());
const moduleFileExtensions = ['js', 'jsx', 'ts', 'tsx'];
const resolvePath = (relativePath, root = rootDirectory) => path.resolve(root, relativePath);
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`)),
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

const buildTarget = process.env.BUILD_TARGET;
const distDir = resolvePath('dist');

module.exports = {
  // global
  appBuildPath: distDir,
  appRootPath: resolvePath('.'),
  appRootPkgJson: resolvePath('package.json'),
  appJsConfig: resolvePath('jsconfig.json'),
  appTsConfig: resolvePath('tsconfig.json'),
  appEslintConfig: resolvePath('.eslintrc.js'),
  appNodeModules: resolvePath('node_modules'),

  // electron
  appElectronTsConfig: resolvePath('tsconfig.main.json'),
  appElectronConfigPath: resolvePath('electron.config.js'),
  appElectronEntryDir: resolvePath('main'),
  appElectronDevEntryFile: resolveModule(resolvePath, 'main/index.dev'),
  appElectronEntryFile: resolveModule(resolvePath, 'main/index'),
  appElectronPublicAssetsPath: resolvePath('public/main'),
  appElectronDistPath: resolvePath('main', distDir),
  appElectronDistPublicPath: resolvePath('main/public', distDir),
  appElectronReleasePath: resolvePath('release'),

  // web
  favicon: resolvePath('public/render/favicon.ico'),
  spriteSvgPath: resolvePath('src/assets/svg-sprite'),
  globalLessVarsAndMixins: resolvePath('src/styles/less-vars/*.less'),
  appWebTsConfig: resolvePath('tsconfig.render.json'),
  appWebEntryDir: resolvePath('src'),
  appWebEntryFile: resolveModule(resolvePath, 'src/index'),
  appWebPublicAssetsPath: resolvePath('public/render'),
  appWebHtmlTpl: resolvePath('public/render/index.html'),
  appWebDllPath: resolvePath('node_modules/.cache/dll-plugin'),
  appWebDistPath: buildTarget === 'electron' ? resolvePath('render', distDir) : distDir,
};
