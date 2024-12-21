// This file is the entry point for the Electron application.
const WindowManager = require('node-window-manager').windowManager;
// const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron');
const fs = require('fs');
const { Menu } = require("electron");
const { systemPreferences } = require('electron');
const { app, protocol, BrowserWindow, session } = require('electron');
const path = require('path');
const pkg = require('../package.json');


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

ipcMain.handle("getSourceProcessId",async (event,args)=>{
    console.log(JSON.stringify(args));
    const windows = WindowManager.getWindows();
    for(var item of windows){
        if(item.id===args.sourceId){
            return item.processId;
        }
    }
    return "";
});

let currentEnv = 'production'; // 默认环境
let mainWindow;
// 重启应用
function restartApp() {
    app.relaunch(); // 重新启动应用
    app.exit(0); // 退出当前实例
  }
// 创建菜单模板
function createMenuTemplate() {
    return [
      {
        label: '环境设置',
        submenu: [
          {
            label: '正式环境',
            type: 'radio',
            checked: currentEnv === 'production',
            click: () => {
              currentEnv = 'production';
              saveEnv();
              restartApp();
            },
          },
          {
            label: '测试环境',
            type: 'radio',
            checked: currentEnv === 'testing',
            click: () => {
              currentEnv = 'testing';
              saveEnv();
              restartApp();
            },
          },
          {
            label: '开发环境',
            type: 'radio',
            checked: currentEnv === 'development',
            click: () => {
              currentEnv = 'development';
              saveEnv();
              restartApp();
            },
          },
        ],
      },
      {
        label: '其他',
        submenu: [
          { role: 'reload' }, // 刷新
          { role: 'quit' },   // 退出
          {
            label: 'devTools',
            click: () => {
                mainWindow.webContents.openDevTools();
            },
         },
         {
            label: 'about',
            click: () => {
                // 在这里可以打开一个关于窗口或显示对话框
                // 这里使用一个简单的对话框
                const { dialog } = require('electron');
                dialog.showMessageBox(mainWindow);
            },
        },
        ],
      },
    ];
  }

  // 保存当前环境到文件
function saveEnv() {
    fs.writeFileSync(path.join(app.getPath('userData'), 'env.json'), JSON.stringify({ env: currentEnv }));
  }
  
  // 读取环境配置
  function loadEnv() {
    const filePath = path.join(app.getPath('userData'), 'env.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath));
      currentEnv = data.env || 'production';
    }
  }

function createWindow() {
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        "icon": "assets/tuwan.png",
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            partition: 'persist:diandianuser', // 持久化分区，数据会存储到磁盘,
            preload: path.join(__dirname, 'preload.js'), // 预加载脚本
        },
    });

    require('./autocookie');
    if(currentEnv==="production"){
        win.loadURL(`https://y-test.tuwan.com/diandianele?env=1`);
    }else if(currentEnv==="testing"){
        win.loadURL(`https://y-test.tuwan.com/diandianele2?env=2`);
    }else{
        // Load vite dev server page
        console.log('Development mode');
        win.loadURL('http://192.168.3.198:5173/');
        // 打开 DevTools
        win.webContents.openDevTools(); 
    }
    mainWindow = win;

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
    loadEnv();
    const menu = Menu.buildFromTemplate(createMenuTemplate());
    Menu.setApplicationMenu(menu);
    // // 设置应用菜单
    // const menu = Menu.buildFromTemplate(menuTemplate);
    // Menu.setApplicationMenu(menu);
    
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
