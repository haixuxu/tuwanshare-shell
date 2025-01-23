const { contextBridge, ipcRenderer } = require('electron');
// const { agoraApi } = require('./agorartc');
const diandianApi = require('./rpcapis/index');

const eventHandlers = {};

ipcRenderer.on('global-event', (event, data) => {
    const eventName = data.type;
    const handlers = eventHandlers[eventName] || [];
    handlers.forEach((fn) => fn(data));
});

contextBridge.exposeInMainWorld('tuwanNapi', {
    // agoraApi: agoraApi,
    diandianApi,
    registerEvent: (eventName, callback) => {
        if (!eventHandlers[eventName]) {
            eventHandlers[eventName] = [];
        }
        eventHandlers[eventName].push(callback);
    },
});
