const { ipcRenderer, BrowserWindow } = require('electron');

const path = require('path');

// 申请权限
exports.askPermission = function (arg) {
    return ipcRenderer.invoke('ask-permission', arg);
};
// 获取窗口进程ID
exports.getSourceProcessId = function (arg) {
    return ipcRenderer.invoke('getSourceProcessId', arg);
};

exports.createWindow = function (args) {
    return ipcRenderer.invoke('createWindow', args);
};

exports.resizeWindow=function(args){
     // 调整窗口大小
    return ipcRenderer.invoke('resizeWindow', args);
}


exports.windowControls = (action) => ipcRenderer.send('window-controls', action);
