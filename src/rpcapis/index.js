const { ipcRenderer, BrowserWindow } = require('electron');

const path = require('path');
const package = require('../../package.json');

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

exports.resizeWindow = function (args) {
    // 调整窗口大小
    return ipcRenderer.invoke('resizeWindow', args);
};

exports.getPkgJson = function () {
    return JSON.stringify(package);
};

exports.windowControls = (action) => ipcRenderer.send('window-controls', action);

exports.checkUpdate = function () {
    ipcRenderer.send('client-update', { type: 'check' });
};
exports.downloadUpdate = function () {
    ipcRenderer.send('client-update', { type: 'confirm-downloadUpdate' });
};
exports.confirmUpdate = function () {
    ipcRenderer.send('client-update', { type: 'confirm-update' });
};
