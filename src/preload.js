const { contextBridge, ipcRenderer } = require('electron');
const { agoraApi } = require('./agorartc');

contextBridge.exposeInMainWorld('tuwanNapi', {
    agoraApi: agoraApi,
});
