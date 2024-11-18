const { ipcRenderer } = require('electron');
const { ChannelProfileType, ClientRoleType, LocalVideoStreamState,VideoViewSetupMode,RenderModeType, ScreenCaptureSourceType, VideoSourceType, createAgoraRtcEngine } = require('agora-electron-sdk');



const args = {
    targetSource: undefined,
    width: 1920,
    height: 1080,
    frameRate: 15,
    bitrate: 0,
    captureMouseCursor: true,
    windowFocus: false,
    excludeWindowList: [],
    highLightWidth: 0,
    highLightColor: 0xff8cbf26,
    enableHighLight: false,
}

exports.AgoraScreenShare = class AgoraScreenShare {
    askPermission(arg) {
        return ipcRenderer.invoke('ask-permission', arg);
    }
    /**
     * Step 1: initRtcEngine
     */
    async initRtcEngine(appId) {
        console.log('initRtcEngine====', appId);
        this.engine = createAgoraRtcEngine();
        console.log('==========engine===', this.engine);
        this.engine.initialize({
            appId: appId,
            logConfig: { filePath: 'agora.log' },
            // Should use ChannelProfileLiveBroadcasting on most of cases
            channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
        });
        this.engine.registerEventHandler(this);

        // Need granted the microphone and camera permission
        // await askMediaAccess(['microphone', 'camera', 'screen']);
        await this.askPermission({ type: 'microphone' });
        await this.askPermission({ type: 'camera' });
        await this.askPermission({ type: 'screen' });

        // Need to enable video on this case
        // If you only call `enableAudio`, only relay the audio stream to the target channel
        this.engine.enableVideo();

        // Start preview before joinChannel
        this.engine.startPreview();
        // this.setState({ startPreview: true });
        // this.getScreenCaptureSources();
    }

    setSource(source){
        args.targetSource = source;
    }

    /**
     * Step 2: joinChannel
     */
    joinChannel(channelId,token,uid) {
        if (!channelId) {
            console.log('channelId is invalid');
            return;
        }
        console.log('joinChannel====', channelId, token, uid);
        // start joining channel
        // 1. Users can only see each other after they join the
        // same channel successfully using the same app id.
        // 2. If app certificate is turned on at dashboard, token is needed
        // when joining channel. The channel name and uid used to calculate
        // the token has to match the ones used for channel join
        this.engine?.joinChannel(token, channelId, uid, {
            // Make myself as the broadcaster to send stream to remote
            clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        });
    }

    /**
     * Step 3-1: getScreenCaptureSources
     */
    getScreenCaptureSources = () => {
        return this.engine?.getScreenCaptureSources({ width: 1920, height: 1080 }, { width: 64, height: 64 }, true);
    };

    /**
     * Step 3-2: startScreenCapture
     */
    startScreenCapture = (viewEl) => {
        const { targetSource, width, height, frameRate, bitrate, captureMouseCursor, windowFocus, excludeWindowList, highLightWidth, highLightColor, enableHighLight } = args;

        if (!targetSource) {
            console.log('targetSource is invalid');
            return;
        }
        console.log('======startScreenCapture=====', targetSource);
        if (targetSource.type === ScreenCaptureSourceType.ScreencapturesourcetypeScreen) {
            this.engine?.startScreenCaptureByDisplayId(
                targetSource.sourceId,
                {},
                {
                    dimensions: { width, height },
                    frameRate,
                    bitrate,
                    captureMouseCursor,
                    excludeWindowList,
                    excludeWindowCount: excludeWindowList.length,
                    highLightWidth,
                    highLightColor,
                    enableHighLight,
                },
            );
        } else {
            this.engine?.startScreenCaptureByWindowId(
                targetSource.sourceId,
                {},
                {
                    dimensions: { width, height },
                    frameRate,
                    bitrate,
                    windowFocus,
                    highLightWidth,
                    highLightColor,
                    enableHighLight,
                },
            );
        }
        console.log('=======setupLocalVideo=====',viewEl);
        this.engine?.setupLocalVideo({
            sourceType: VideoSourceType.VideoSourceScreen,
            renderMode: RenderModeType.RenderModeFit,
            setupMode: VideoViewSetupMode.VideoViewSetupRemove,
            view: viewEl,
        })
    };

    /**
     * Step 3-2 (Optional): updateScreenCaptureParameters
     */
    updateScreenCaptureParameters = () => {
        const { width, height, frameRate, bitrate, captureMouseCursor, windowFocus, excludeWindowList, highLightWidth, highLightColor, enableHighLight } = args;
        this.engine?.updateScreenCaptureParameters({
            dimensions: { width, height },
            frameRate,
            bitrate,
            captureMouseCursor,
            windowFocus,
            excludeWindowList,
            excludeWindowCount: excludeWindowList.length,
            highLightWidth,
            highLightColor,
            enableHighLight,
        });
    };

    /**
     * Step 3-5: stopScreenCapture
     */
    stopScreenCapture = () => {
        this.engine?.stopScreenCapture();
    };
    /**
     * Step 4: leaveChannel
     */
    leaveChannel() {
        this.engine?.leaveChannel();
    }

    /**
     * Step 5: releaseRtcEngine
     */
    releaseRtcEngine() {
        this.engine?.unregisterEventHandler(this);
        this.engine?.release();
    }

    onJoinChannelSuccess(connection, elapsed) {
        console.log('onJoinChannelSuccess', 'connection', connection); 
    }

    onLeaveChannel(connection, stats) {
        console.log('onLeaveChannel', 'connection', connection, 'stats', stats);
     
    }

    onUserJoined(connection, remoteUid, elapsed) {
        console.log('onUserJoined====',remoteUid);
        // const { uid2 } = state;
        // if (connection.localUid === uid2 || remoteUid === uid2) {
        //     // ⚠️ mute the streams from screen sharing
        //     this.engine?.muteRemoteAudioStream(uid2, true);
        //     this.engine?.muteRemoteVideoStream(uid2, true);
        //     return;
        // }
    }
    onLocalVideoStateChanged(source, state, error) {
        console.log('onLocalVideoStateChanged', 'source', source, 'state', state, 'error', error);
    }
};
