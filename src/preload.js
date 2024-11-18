const { contextBridge, ipcRenderer,systemPreferences } = require('electron');
const AgoraSDK = require('agora-electron-sdk');


// 暴露 API
// contextBridge.exposeInMainWorld('Agora', {
//     sendMessage: (channel, data) => ipcRenderer.send(channel, data),
//     receiveMessage: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
// });

contextBridge.exposeInMainWorld('tuwanNapi', {
    AgoraSDK: AgoraSDK,
    askPermission:async function(arg){
        if (
            systemPreferences.getMediaAccessStatus(arg.type) === 'not-determined'
          ) {
            console.log('main process request handler:' + JSON.stringify(arg));
            return await systemPreferences.askForMediaAccess(arg.type);
        }
    }
});