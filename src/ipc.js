const { ipcMain, BrowserWindow, shell,screen } = require('electron');
const { Menu } = require('electron');
const path = require('path');
const { systemPreferences } = require('electron');

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
ipcMain.handle('getSourceProcessId', async (event, args) => {
    // console.log(JSON.stringify(args));
    // const windows = WindowManager.getWindows();
    // for(var item of windows){
    //     if(item.id===args.sourceId){
    //         return item.processId;
    //     }
    // }
    return '';
});

ipcMain.handle('createWindow', async (event, args) => {
    const windowOpts = args;
    const win = new BrowserWindow({
        width: windowOpts.width || 1024,
        height: windowOpts.height || 768,
        icon: 'assets/tuwan.png',
        frame: args.hasMenu ? true : false,
        webPreferences: {
            contextIsolation: true,  // 确保启用上下文隔离
            nodeIntegration: false,   // 推荐禁用 Node 集成
            // nodeIntegration: true,
            // webSecurity: false,
            // allowRunningInsecureContent: false,
            partition: 'persist:diandianuser', // 持久化分区，数据会存储到磁盘,
            preload: path.join(__dirname, './preload.js'), // 预加载脚本
        },
    });

    win.loadURL(windowOpts.url);
    win.webContents.openDevTools();
    if (args.defaultZoomFactor) {
        win.webContents.setZoomFactor(args.defaultZoomFactor); // 0.9 表示缩小到 90%
    }
    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
});

// 处理来自渲染进程的请求
ipcMain.on('window-controls', (event, action) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (action === 'minimize') {
        window.minimize();
    } else if (action === 'maximize') {
        // window.maximize();
        // const factor = window.webContents.getZoomFactor();
        if (window.isMaximized()) {
            window.webContents.setZoomFactor(0.9);
            window.unmaximize();
        } else {
            window.webContents.setZoomFactor(1);
            window.maximize();
        }
    } else if (action === 'close') {
        window.close();
    }
});
// 调整窗口大小
ipcMain.handle('resizeWindow', (event, args) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window.setSize(args.width, args.height); // 调整窗口大小

    centerWindow(window);
});


function centerWindow(win) {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize; // 获取主屏幕的可用工作区大小
    const winWidth = win.getBounds().width;   // 获取窗口当前的宽度
    const winHeight = win.getBounds().height;  // 获取窗口当前的高度

    const x = Math.round((width - winWidth) / 2);
    const y = Math.round((height - winHeight) / 2);

    win.setPosition(x, y); // 设置窗口位置为居中
}
