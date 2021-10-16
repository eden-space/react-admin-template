import path from 'path';
import url from 'url';
import electronLog from 'electron-log';
import { app, BrowserWindow, globalShortcut } from 'electron';
import { mark, performanceStart, performanceEnd } from './utils/performance';
import { APP_NAME, APP_VERSION } from './config';
// import { banShortcut } from './utils/functions';
import './config/menu';

const isDevelopment = process.env.NODE_ENV === 'development';

performanceStart();
mark('main-start');

process.on('unhandledRejection', (error) => {
  electronLog.error('An error occurred(unhandledRejection)', error);
  if (process.env.BUILD_ENV !== 'development') {
    app.quit();
  }
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null;

function createWindow() {
  mark('main-window-create-start');

  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 830,
    minHeight: 560,
    width: 830,
    height: 560,
    frame: true,
    show: true,
    transparent: false,
    backgroundColor: '#333',
    webPreferences: {
      webviewTag: true,
      webSecurity: false,
      nodeIntegration: true, // 加载第三方网页强烈建议置为false。
      contextIsolation: !isDevelopment, // 自Electron 12将默认为true。
      preload: path.resolve(
        __dirname,
        isDevelopment ? '../public/main/statics/preload.js' : 'public/statics/preload.js',
      ),
    },
  });

  const originUa = mainWindow.webContents.getUserAgent();
  mainWindow.webContents.setUserAgent(`${originUa} ${APP_NAME}/${APP_VERSION}`);

  mark('main-window-source-load-start');

  const { RENDER_DEV_HOST_NAME, RENDER_DEV_PORT } = process.env;
  // 此处不做容错判断，无意义。如果不改启动方式不会出错，如果改了启动方式则默认知道如何关联
  const origin = `${RENDER_DEV_HOST_NAME as string}:${RENDER_DEV_PORT as string}`;

  const options = {
    protocol: isDevelopment ? 'http' : 'file',
    pathname: isDevelopment ? origin : path.join(__dirname, '../render/index.html'),
    slashes: true,
  };

  mainWindow.loadURL(url.format(options)).then(() => {
    electronLog.info(`Main Window Load Success: http://${origin}`);
    electronLog.info(process.env.APP_NAME);
  }).catch((err) => {
    console.error(err);
  });

  mainWindow.on('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.center();
    }
    mark('main-window-create-end');
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mark('main-window-source-load-end');
    try {
      // const list = getMarks();
      // console.log('performance:', JSON.stringify(list, null, 2));
    } catch (err) {
      electronLog.error(err);
    }

    performanceEnd();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // ipcMain.handle('prefers-color-scheme:toggle', () => {
  //   if (nativeTheme.shouldUseDarkColors) {
  //     nativeTheme.themeSource = 'light';
  //   } else {
  //     nativeTheme.themeSource = 'dark';
  //   }
  //   return nativeTheme.shouldUseDarkColors;
  // });
  //
  // ipcMain.handle('prefers-color-scheme:system', () => {
  //   nativeTheme.themeSource = 'system';
  // });

  // setTimeout(() => {
  //   mainWindow?.webContents?.reloadIgnoringCache();
  // }, 5000);

  if (process.env.BUILD_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    console.log('activate');
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}).catch((err) => {
  console.error(err);
});

app.on('browser-window-focus', () => {
  console.log('browser-window-focus');
  // banShortcut();
});

app.on('browser-window-blur', () => {
  console.log('browser-window-blur');
  // 注销所有快捷键
  globalShortcut.unregisterAll();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  console.log('window-all-closed');
  // 注销所有快捷键
  globalShortcut.unregisterAll();

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  // 注销所有快捷键
  globalShortcut.unregisterAll();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

mark('main-end');
