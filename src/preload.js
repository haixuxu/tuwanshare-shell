const { contextBridge, ipcRenderer } = require('electron');
const { AgoraScreenShare } = require('./agorartc');

const shareScreenSvc = new AgoraScreenShare();


contextBridge.exposeInMainWorld('tuwanNapi', {
    getScreenCaptureSources:async function(){
        const list = await shareScreenSvc.getScreenCaptureSources();
        console.log('list====',list);
        return list;
    },
    initRtcEngine:async function(appId){
        await shareScreenSvc.initRtcEngine(appId);
    },
    startScreenCapture: async function (targetSource,viewEl) {
        await shareScreenSvc.setState({ targetSource: targetSource });
        await shareScreenSvc.startScreenCapture(viewEl);
    },
    stopScreenCapture: async function () {
        await shareScreenSvc.stopScreenCapture();
    },
    joinChannel(channel, token, uid){
        return shareScreenSvc.joinChannel(channel, token, uid);
    },
    async leaveChannel(){
        await shareScreenSvc.leaveChannel();
        await shareScreenSvc.releaseRtcEngine();
    },
});
