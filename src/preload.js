const { contextBridge, ipcRenderer } = require('electron');
const AgoraSDK = require('agora-electron-sdk');

// 暴露 API
// contextBridge.exposeInMainWorld('Agora', {
//     sendMessage: (channel, data) => ipcRenderer.send(channel, data),
//     receiveMessage: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
// });

contextBridge.exposeInMainWorld('tuwanNapi', {
    AgoraSDK: AgoraSDK
});
