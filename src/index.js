// This file is the entry point for the Electron application.

// const { app, BrowserWindow } = require('electron')
const { Menu, shell } = require('electron');
const { app, protocol, BrowserWindow, session } = require('electron');
const path = require('path');
const pkg = require('../package.json');
const checkUpdate = require('./update');
require('./ipc');

function createMainWindow() {
    const win = new BrowserWindow({
        width: 500,
        height: 400,
        frame: false,
        icon: 'assets/tuwan.png',
        webPreferences: {
            contextIsolation: true,
            // nodeIntegration: true,
            partition: 'persist:diandianuser', // 持久化分区，数据会存储到磁盘,
            preload: path.join(__dirname, 'preload.js'), // 预加载脚本
        },
    });

    if (process.env.NODE_ENV !== 'development') {
        // Load production build
        // win.loadFile(`${__dirname}/renderer/dist/index.html`);
        win.loadURL(`https://y-test.tuwan.com/ddclient`);
    } else {
        // Load vite dev server page
        console.log('Development mode');
        // win.loadURL(`https://y-test.tuwan.com/diandianele`);
        win.loadURL('http://localhost:5173/');
        // win.loadURL('http://192.168.3.198:5173/');
        // 打开 DevTools
        win.webContents.openDevTools();
    }
    setTimeout(()=>{
        checkUpdate(win);  // 检查更新
    },3000);
}

// 设置关于窗口的选项
app.setAboutPanelOptions({
    applicationName: '点点工具',
    applicationVersion: '1.0.0',
    copyright: '©2024 tuwan',
    version: pkg.version,
    website: 'https://y.tuwan.com',
});


app.whenReady().then(() => {
    // 设置应用名称
    app.setName(pkg.name);

    require('./autocookie');

    // 创建菜单
    const menuTemplate = [
        {
            label: '帮助',
            submenu: [
                {
                    label: '关于',
                    click: () => {
                        // 在 macOS 上调用默认的关于窗口
                        app.showAboutPanel();
                    },
                },
            ],
        },
    ];

    // // 设置应用菜单
    // const menu = Menu.buildFromTemplate(menuTemplate);
    // Menu.setApplicationMenu(menu);

    // 隐藏默认菜单
    Menu.setApplicationMenu(null);

    // 注册自定义协议
    // protocol.registerHttpProtocol("app", (request, callback) => {
    //   const url = request.url.replace("app://", "http://localhost:5173/");
    //   console.log('url====',url);
    //   callback({ url });
    // });

    createMainWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
