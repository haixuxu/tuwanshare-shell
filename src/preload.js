const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');
const diandianApi = require('./rpcapis/index');

let agoraApi;

if (os.platform() === 'linux') {
    console.log('当前操作系统是 Linux');
    agoraApi = {message:"unimplement!",types:{},initRtcEngine:function(){
        throw Error("Linux平台不支持!")
    }};
}else{
    agoraApi = require("./agorartc").agoraApi;
}
const eventHandlers = {};

ipcRenderer.on('global-event', (event, data) => {
    const eventName = data.type;
    const handlers = eventHandlers[eventName] || [];
    handlers.forEach((fn) => fn(data));
});

contextBridge.exposeInMainWorld('tuwanNapi', {
    agoraApi: agoraApi,
    diandianApi,
    registerEvent: (eventName, callback) => {
        if (!eventHandlers[eventName]) {
            eventHandlers[eventName] = [];
        }
        eventHandlers[eventName].push(callback);
    },
});
