<script>
  import { onMount } from "svelte";
  import { ChatConfig, ChatUrls } from "../config";
  import { globalState, roomInfo } from "../store";

  let userId = "";

  let appId = "";
  let channel = "";
  let token = "";
  let channelKey = "";

  onMount(() => {
    if (!globalState.uid) return;
    userId = globalState.uid;
    appId  = ChatConfig.appid;
    channel  = roomInfo.channel||roomInfo.error_msg;
    token  = roomInfo.token||roomInfo.error_msg;
    channelKey  = roomInfo.channelKey||roomInfo.error_msg;
    console.log("roomInfo===", roomInfo);
  });
</script>

<div>
  <h3>登录成功</h3>

  <div class="form-info">当前大厅:157</div>
  <div class="form-info">当前麦位:2</div>
  <div class="form-info">当前Uid:{userId}</div>
  <div class="form-info">AppId:{appId}</div>
  <div class="form-info">Channel:{channel}</div>
  <div class="form-info">channelKey:{channelKey}</div>
  <div class="form-info">Token:{token}</div>
</div>
