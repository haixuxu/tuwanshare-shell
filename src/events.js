const eventList = [
    'onActiveSpeaker',
    'onAudioDeviceStateChanged',
    'onAudioDeviceVolumeChanged',
    'onAudioEffectFinished',
    'onAudioMixingFinished',
    'onAudioMixingPositionChanged',
    'onAudioMixingStateChanged',
    'onAudioPublishStateChanged',
    'onAudioQuality',
    'onAudioRoutingChanged',
    'onAudioSubscribeStateChanged',
    'onAudioVolumeIndication',
    'onCameraReady',
    'onChannelMediaRelayStateChanged',
    'onClientRoleChanged',
    'onClientRoleChangeFailed',
    'onConnectionBanned',
    'onConnectionInterrupted',
    'onConnectionLost',
    'onConnectionStateChanged',
    'onEncryptionError',
    'onError',
    'onExtensionErrorWithContext',
    'onExtensionEventWithContext',
    'onExtensionStartedWithContext',
    'onExtensionStoppedWithContext',
    'onFirstLocalAudioFramePublished',
    'onFirstLocalVideoFrame',
    'onFirstLocalVideoFramePublished',
    'onFirstRemoteAudioFrame',
    'onFirstRemoteAudioDecoded',
    'onFirstRemoteVideoDecoded',
    'onFirstRemoteVideoFrame',
    'onJoinChannelSuccess',
    'onLastmileProbeResult',
    'onLastmileQuality',
    'onLeaveChannel',
    'onLocalAudioStateChanged',
    'onLocalAudioStats',
    'onLocalUserRegistered',
    'onLocalVideoStateChanged',
    'onLocalVideoStats',
    'onLocalVideoTranscoderError',
    'onNetworkQuality',
    'onNetworkTypeChanged',
    'onPermissionError',
    'onProxyConnected',
    'onRejoinChannelSuccess',
    'onRemoteAudioStateChanged',
    'onRemoteAudioStats',
    'onRemoteAudioTransportStats',
    'onRemoteSubscribeFallbackToAudioOnly',
    'onRemoteVideoStateChanged',
    'onRemoteVideoStats',
    'onRemoteVideoTransportStats',
    'onRequestToken',
    'onRhythmPlayerStateChanged',
    'onRtcStats',
    'onRtmpStreamingEvent',
    'onRtmpStreamingStateChanged',
    'onSnapshotTaken',
    'onStreamMessage',
    'onStreamMessageError',
    'onTokenPrivilegeWillExpire',
    'onTranscodingUpdated',
    'onUplinkNetworkInfoUpdated',
    'onUserEnableLocalVideo',
    'onUserEnableVideo',
    'onUserInfoUpdated',
    'onUserJoined',
    'onUserMuteAudio',
    'onUserMuteVideo',
    'onUserOffline',
    'onVideoDeviceStateChanged',
    'onVideoPublishStateChanged',
    'onVideoSizeChanged',
    'onVideoStopped',
    'onVideoSubscribeStateChanged',
    'onVideoRenderingTracingResult',
];


const eventHandler ={}

eventList.forEach(key=>{
    eventHandler[key]=function(...args){
        // console.log("event catch===",key,args);
        const event = new CustomEvent(key.replace(/^on/,''), { detail: [...args] });
        window.dispatchEvent(event); // 使用 window.dispatchEvent 派发事件
    };
});

// console.log('eventHandler===',eventHandler);

exports.eventHandler=eventHandler;
