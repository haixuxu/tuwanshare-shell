const { contextBridge, ipcRenderer } = require('electron');
// const { agoraApi } = require('./agorartc');
const diandianApi = require('./rpcapis/index');

contextBridge.exposeInMainWorld('tuwanNapi', {
    // agoraApi: agoraApi,
    diandianApi
});
