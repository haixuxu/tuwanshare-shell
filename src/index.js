// This file is the entry point for the Electron application.

// const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron');
const { systemPreferences } = require('electron');
const { app, protocol, BrowserWindow, session } = require('electron');
const path = require('path');

ipcMain.handle('ask-permission', async (event, arg) => {
    if (process.platform !== 'darwin') {
        return;
    }
    console.log('=====', arg);
    if (systemPreferences.getMediaAccessStatus(arg.type) === 'not-determined') {
        return await systemPreferences.askForMediaAccess(arg.type);
    }
    return systemPreferences.getMediaAccessStatus(arg.type);
});



function createWindow() {
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            partition: 'persist:diandianuser', // 持久化分区，数据会存储到磁盘,
            preload: path.join(__dirname, 'preload.js'), // 预加载脚本
        },
    });

    require('./autocookie');
    if (process.env.NODE_ENV !== 'development') {
        // Load production build
        // win.loadFile(`${__dirname}/renderer/dist/index.html`);
        win.loadURL(`https://y-test.tuwan.com/diandianele`);
    } else {
        // Load vite dev server page
        console.log('Development mode');
        // win.loadURL(`https://y-test.tuwan.com/diandianele`);
        win.loadURL('http://localhost:5173/');
        // 打开 DevTools
        win.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    // 注册自定义协议
    // protocol.registerHttpProtocol("app", (request, callback) => {
    //   const url = request.url.replace("app://", "http://localhost:5173/");
    //   console.log('url====',url);
    //   callback({ url });
    // });

    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
