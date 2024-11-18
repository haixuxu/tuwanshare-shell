import { ChatConfig, ChatUrls, RTC_CONFIG } from "../../config";
import { askMediaAccess } from "../../utils/permissions";
import { request } from "../../utils/request";

const {
  ChannelProfileType,
  ClientRoleType,
  LocalVideoStreamState,
  ScreenCaptureSourceType,
  VideoSourceType,
  createAgoraRtcEngine,
} = window.tuwanNapi.AgoraSDK;

let state = {
  appId: ChatConfig.appId,
  enableVideo: true,
  channelId: "",
  token: "",
  uid: "",
  joinChannelSuccess: false,
  remoteUsers: [],
  startPreview: false,
  token2: "",
  uid2: 0,
  sources: [],
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
  startScreenCapture: false,
  publishScreenCapture: false,
};

export  class ScreenShare {
applyShare(cid){
    return request.get(ChatUrls.shareScreenApply(cid))
}

openShare(cid){
    // 自己结束的共享就是0
    return request.get(ChatUrls.shareScreenOpenShare(cid));
}
closeShare(cid){
  // 自己结束的共享就是0
  return request.get(ChatUrls.shareScreenCloseShare(cid, 0));
}
  /**
   * Step 1: initRtcEngine
   */
  async initRtcEngine(roomInfo) {
    // const { appId } = state;
    
    state.channelId= roomInfo.channel;
    state.token= roomInfo.token;
    state.uid= roomInfo.uid;

    this.engine = createAgoraRtcEngine();
    
    this.engine.initialize({
      appId: state.appId,
      logConfig: { filePath: RTC_CONFIG.logFilePath },
      // Should use ChannelProfileLiveBroadcasting on most of cases
      channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
    });
    this.engine.registerEventHandler(this);

    // Need granted the microphone and camera permission
    await askMediaAccess(["microphone", "camera", "screen"]);

    // Need to enable video on this case
    // If you only call `enableAudio`, only relay the audio stream to the target channel
    this.engine.enableVideo();

    // Start preview before joinChannel
    this.engine.startPreview();
    this.setState({ startPreview: true });

    this.getScreenCaptureSources();
  }

  setState(obj) {
    Object.keys(obj).forEach((key) => {
      state[key] = obj[key];
    });
  }

  /**
   * Step 2: joinChannel
   */
  joinChannel() {
    const { channelId, token, uid } = state;
    if (!channelId) {
      console.log("channelId is invalid");
      return;
    }

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
    const sources = this.engine?.getScreenCaptureSources(
      { width: 1920, height: 1080 },
      { width: 64, height: 64 },
      true
    );
    this.setState({
      sources,
      targetSource: sources?.at(0),
    });
  };

  /**
   * Step 3-2: startScreenCapture
   */
  startScreenCapture = () => {
    const {
      targetSource,
      width,
      height,
      frameRate,
      bitrate,
      captureMouseCursor,
      windowFocus,
      excludeWindowList,
      highLightWidth,
      highLightColor,
      enableHighLight,
    } = state;

    if (!targetSource) {
      console.log("targetSource is invalid");
      return;
    }

    if (
      targetSource.type ===
      ScreenCaptureSourceType.ScreencapturesourcetypeScreen
    ) {
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
        }
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
        }
      );
    }
    this.setState({ startScreenCapture: true });
  };

  /**
   * Step 3-2 (Optional): updateScreenCaptureParameters
   */
  updateScreenCaptureParameters = () => {
    const {
      width,
      height,
      frameRate,
      bitrate,
      captureMouseCursor,
      windowFocus,
      excludeWindowList,
      highLightWidth,
      highLightColor,
      enableHighLight,
    } = state;
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
   * Step 3-4: publishScreenCapture
   */
  publishScreenCapture = () => {
    const { channelId, token2, uid2 } = state;
    if (!channelId) {
      console.log("channelId is invalid");
      return;
    }
    if (uid2 <= 0) {
      console.log("uid2 is invalid");
      return;
    }

    // publish screen share stream
    this.engine?.joinChannelEx(
      token2,
      { channelId, localUid: uid2 },
      {
        autoSubscribeAudio: false,
        autoSubscribeVideo: false,
        publishMicrophoneTrack: false,
        publishCameraTrack: false,
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        publishScreenTrack: true,
      }
    );
  };

  /**
   * Step 3-5: stopScreenCapture
   */
  stopScreenCapture = () => {
    this.engine?.stopScreenCapture();
    this.setState({ startScreenCapture: false });
  };

  /**
   * Step 3-6: unpublishScreenCapture
   */
  unpublishScreenCapture = () => {
    const { channelId, uid2 } = state;
    this.engine?.leaveChannelEx({ channelId, localUid: uid2 });
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
    const { uid2 } = state;
    if (connection.localUid === uid2) {
      console.log("onJoinChannelSuccess","connection",
        connection,
        "elapsed",
        elapsed
      );
      this.setState({ publishScreenCapture: true });
      return;
    }
    // super.onJoinChannelSuccess(connection, elapsed);
  }

  onLeaveChannel(connection, stats) {
    console.log("onLeaveChannel", "connection", connection, "stats", stats);
    const { uid2 } = state;
    if (connection.localUid === uid2) {
      this.setState({ publishScreenCapture: false });
      return;
    }
    // const state2 = this.createState();
    delete state.sources;
    delete state.targetSource;
    // this.setState(state);
  }

  onUserJoined(connection, remoteUid, elapsed) {
    const { uid2 } = state;
    if (connection.localUid === uid2 || remoteUid === uid2) {
      // ⚠️ mute the streams from screen sharing
      this.engine?.muteRemoteAudioStream(uid2, true);
      this.engine?.muteRemoteVideoStream(uid2, true);
      return;
    }
    // super.onUserJoined(connection, remoteUid, elapsed);
  }

  onUserOffline(connection, remoteUid, reason) {
    const { uid2 } = state;
    if (connection.localUid === uid2 || remoteUid === uid2) return;
    // super.onUserOffline(connection, remoteUid, reason);
  }

  onLocalVideoStateChanged(source, state, error) {
    console.log(
      "onLocalVideoStateChanged",
      "source",
      source,
      "state",
      state,
      "error",
      error
    );
    if (source === VideoSourceType.VideoSourceScreen) {
      switch (state) {
        case LocalVideoStreamState.LocalVideoStreamStateStopped:
        case LocalVideoStreamState.LocalVideoStreamStateFailed:
          break;
        case LocalVideoStreamState.LocalVideoStreamStateCapturing:
        case LocalVideoStreamState.LocalVideoStreamStateEncoding:
          this.setState({ startScreenCapture: true });
          break;
      }
    }
  }
}
