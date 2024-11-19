const { contextBridge, ipcRenderer } = require('electron');
const { AgoraScreenShare } = require('./agorartc');

const shareScreenSvc = new AgoraScreenShare();


contextBridge.exposeInMainWorld('tuwanNapi', {
    async getScreenCaptureSources(){
        const list = await shareScreenSvc.getScreenCaptureSources();
        console.log('list====',list);
        return list;
    },
    async initRtcEngine(appId){
        await shareScreenSvc.initRtcEngine(appId);
    },
    async startScreenCapture (targetSource,viewEl) {
        await shareScreenSvc.setSource(targetSource);
        await shareScreenSvc.startScreenCapture(viewEl);
    },
    async stopScreenCapture () {
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
