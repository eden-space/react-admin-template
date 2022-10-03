/**
 * electron configuration
 * @description 目前仅暴露electron-builder的全量配置
 */
const path = require('path');
const builder = require('electron-builder');
const { pascalCase } =  require('change-case');
const { name: pkgName, version, author: { name: authorName, email: authorEmail } } = require(path.resolve(__dirname, './package.json'));
const ICON_ICO = path.resolve(__dirname, './public/main/icon/icon.ico');
const ICON_ICNS = path.resolve(__dirname, './public/main/icon/icon.icns');
const paths = require('./.scripts/config/paths');

const productName = pascalCase(pkgName);

/**
 * For electron-builder
 * https://www.electron.build/configuration/configuration#configuration
 * https://www.electron.build/auto-update.html#auto-updatable-targets
 */
const cliOptions = {
  // targets: builder.Platform.WINDOWS.createTarget(),
  targets: builder.Platform.MAC.createTarget(),
  config: {
    productName,
    buildVersion: version,
    appId: 'com.lottie.player',
    asar: true, // @todo 注意: 为便于调试默认设为了false，生产环境建议为true
    /** Inject properties to `package.json` **/
    // extraMetadata: {
    // 	'[key: string]': 'string',
    // },
    copyright: `Copyright © ${new Date().getFullYear()} ${productName}\n${authorName}<${authorEmail}>\nAll rights reserved`,
    /** 网速有问题使用镜像 **/
    electronDownload: {
    	mirror: 'https://npm.taobao.org/mirrors/electron/',
    },

    /**
     * `package.json` and `**\node_modules\**\*` only production dependencies will be copied
     * https://www.electron.build/configuration/contents.html#files
     * 此模板不需要copy node_modules，如有需要参考文档自行配置
     */
    files: ['dist', 'package.json', '!**/node_modules/**/*'],
    directories: {
      buildResources: 'dist/main/public/assets',
      output: path.join(paths.appElectronReleasePath, `${pkgName}-release-${version}`),
    },
    nsis: {
      oneClick: false,
      deleteAppDataOnUninstall: true,
      allowToChangeInstallationDirectory: true,
      artifactName: '${pkgName}_setup_${version}.${ext}',
    },
    win: {
      icon: ICON_ICO,
      /**
       * 注意: 启用`nsis`全程不可出现中文目录，包括但不限于【项目存放目录】、【`C:\Users\yourname\**`】目录
       * 因为报`could not find...`异常但文件又确实存在，所以这儿被坑了很久很久😂😂😂
       * !include: could not find: "D:\那一夜此处是中文\react-admin-template\node_modules\app-builder-lib\templates\nsis\include\StdUtils.nsh"
       */
      target: ['nsis'],
      // target: ['msi', 'nsis', 'zip'],
    },
    mac: {
      icon: ICON_ICNS,
      target: 'dmg',
      hardenedRuntime: true,
      gatekeeperAssess: true,
    },
    dmg: {
      icon: ICON_ICNS,
      background: path.resolve(process.cwd(), 'public/main/icon/bg.png'),
      contents: [
        { x: 160, y: 160, type: 'file' },
        { x: 440, y: 160, type: 'link', path: '/Applications' },
      ],
      window: {
        width: 600,
        height: 360,
      },
    },
  },
};

module.exports = {
  cliOptions,
};
