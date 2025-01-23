const { autoUpdater } = require('electron-updater');
const { ipcMain } = require('electron');

/**
 * -1 检查更新失败 0 正在检查更新 1 检测到新版本，准备下载 2 未检测到新版本 3 下载中 4 下载完成
 **/
// 负责向渲染进程发送信息
function Message(mainWindow, data) {
    console.log('message======================', data);
    mainWindow.webContents.send('global-event', { type: 'appupdate', data: data });
}
// 更新应用的方法
module.exports = (mainWindow) => {
    console.log('check update=====');
    // 在下载之前将autoUpdater的autoDownload属性设置成false，通过渲染进程触发主进程事件来实现这一设置(将自动更新设置成false)
    autoUpdater.autoDownload = false;
    //设置版本更新地址，即将打包后的latest.yml文件和exe文件同时放在
    //http://xxxx/test/version/对应的服务器目录下,该地址和package.json的publish中的url保持一致
    // https://sm2.35dinghuo.com/download/

    const channelname = require('../package.json').channelname;
    const channel = channelname || 'taole';

    const UPDATE_SERVER = 'https://apk.tuwan.com/app/ddclient/upgrade/exe/';
    autoUpdater.setFeedURL(UPDATE_SERVER);
    // 当更新发生错误的时候触发。
    autoUpdater.on('error', (err) => {
        if (err.message.includes('sha512 checksum mismatch')) {
            Message(mainWindow, {
                key: 'update-error',
                error: -1,
                message: 'sha512校验失败',
            });
        }
    });
    // 当开始检查更新的时候触发
    autoUpdater.on('checking-for-update', (event, arg) => {
        Message(mainWindow, {
            key: 'checking-for-update',
            error: 0,
            message: '正在检查是否有更新',
        });
    });
    // 发现可更新数据时
    autoUpdater.on('update-available', (event, arg) => {
        Message(mainWindow, {
            key: 'update-available',
            error: 1,
            message: '有新版本',
        });
    });
    // 没有可更新数据时
    autoUpdater.on('update-not-available', (event, arg) => {
        Message(mainWindow, {
            key: 'update-not-available',
            error: 2,
            message: '没有新版本',
        });
    });
    // 下载监听
    autoUpdater.on('download-progress', (progressObj) => {
        Message(mainWindow, {
            key: 'download-progress',
            error: 3,
            value: progressObj,
            message: '正在下载中...',
        });
    });
    // 下载完成
    autoUpdater.on('update-downloaded', () => {
        Message(mainWindow, {
            key: 'update-downloaded',
            error: 4,
            message: '下载完成',
        });
    });

    ipcMain.on('client-update', (ev, data) => {
        const { type } = data;
        if (type == 'check') {
            // 执行更新检查
            autoUpdater.checkForUpdates().catch((err) => {
                console.log('网络连接问题', err);
            });
        } else if (type == 'confirm-update') {
            // 退出并安装
            autoUpdater.quitAndInstall();
        } else if (type == 'confirm-downloadUpdate') {
            // 手动下载更新文件
            autoUpdater.downloadUpdate();
        }
    });
    autoUpdater.checkForUpdates();
};
