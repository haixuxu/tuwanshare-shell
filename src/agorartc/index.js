
const { ChannelProfileType, ClientRoleType, LocalVideoStreamState, VideoViewSetupMode, RenderModeType, ScreenCaptureSourceType, VideoSourceType, createAgoraRtcEngine } = require('agora-electron-sdk');
const { eventHandler } = require("./events");

let engine = null;

// enableLoopbackRecording

exports.agoraApi = {
    types: { ChannelProfileType, ClientRoleType, LocalVideoStreamState, VideoViewSetupMode, RenderModeType, ScreenCaptureSourceType, VideoSourceType },
 
    async initRtcEngine(opts) {
        engine = createAgoraRtcEngine();
        engine.initialize(opts);
        engine.registerEventHandler(eventHandler);
    },
    releaseRtcEngine() {
        engine?.unregisterEventHandler(eventHandler);
        engine?.release();
        engine = null;
    },
    async callEngine(apiName, ...args) {
        if (!engine) {
            throw Error('请先初始化engine');
        }
        if (!engine[apiName]) {
            throw Error('engine.' + apiName + '不存在');
        }
        console.log('call agora engine===',apiName,args);
        return engine[apiName].apply(engine, args);
    },

};

