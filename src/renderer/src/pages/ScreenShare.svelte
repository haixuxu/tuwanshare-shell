<script>
  import { onMount } from "svelte";
  import { ChatConfig, ChatUrls } from "../config";
  import { globalState, roomInfo } from "../store";
  import { initWebSocket } from "../common/socket";
  import { request } from "../utils/request";
  import showTips from "../utils/showtips";
  import {ScreenShare} from '../services/sharescreen/index.js';
  import {Loading} from '../services/loading.js';

  let userId = "";

  let appId = "";
  let channel = "";
  let token = "";
  let channelKey = "";
  let cid =0;

  let startShareing=false;
  // let publishing = false;

  const shareScreenSvc = new ScreenShare();

  onMount(() => {
    if (!globalState.uid) return;
    userId = globalState.uid;
    appId  = ChatConfig.appid;
    channel  = roomInfo.channel||roomInfo.error_msg;
    cid = roomInfo.cid;
    token  = roomInfo.token||roomInfo.error_msg;
    channelKey  = roomInfo.channelKey||roomInfo.error_msg;
    console.log("roomInfo===", roomInfo);
    if(!roomInfo.socketDomain)return;
    initWebSocket(roomInfo, handleWssMsg);
  });

  function handleWssMsg(msg){
  
    // 33 143
    if(msg.typeid===33&&msg.type===143){
      const { typeid, nickname, channelKey } = msg.data;
        window.sessionStorage.setItem('share_channelKey', channelKey);
        if(typeid == 'agree') {
          Loading.hide();
            window.$.DialogByZ.Confirm({
                Title: '投屏申请通过',
                Content: `点击【开始投屏】或大厅内【投屏】按钮即可开始投屏`,
                BtnL: '取消',
                BtnR: '开始投屏',
                FunL: function() {
                    window.$.DialogByZ.Close();
                },
                FunR: function(){
                    window.$.DialogByZ.Close();
                    startShareing = true;
                    confirmShare();
                }
            });
        } else if (typeid == 'reject') { // 主持结束了该用户的投屏
          showTips("主持拒绝了投屏");
            // shareScreen.handleCloseShareScreenSubChannel();
        }else if (typeid == 'close') { // 主持结束了该用户的投屏
          startOrClose();
            // shareScreen.handleCloseShareScreenSubChannel();
        }
    }
  }

  async function  confirmShare() {
   const res = await  shareScreenSvc.openShare(cid);
   if (res.error !== 0) {
      showTips(res.error_msg);
      return
    } 
    await shareScreenSvc.initRtcEngine(roomInfo);
    await shareScreenSvc.joinChannel();
    await shareScreenSvc.startScreenCapture();
    await shareScreenSvc.publishScreenCapture();
  }


  function startOrClose(){
    if(!startShareing){
     
      shareScreenSvc.applyShare(cid).then((res)=>{
        if(res.error!==0){
          showTips(res.error_msg);
          return;
        }
        Loading.show({text:"正在申请授权"});
      });
      return;
    }else{
      shareScreenSvc.closeShare(cid).then(async ()=>{
        startShareing=false;
         await shareScreenSvc.unpublishScreenCapture();
         await shareScreenSvc.leaveChannel();
         await shareScreenSvc.releaseRtcEngine();
      });
    }

    
  }
  function updateParams(){

  }

  // function publishOrNo(){
  //   if(!publishing){

  //   }else{

  //   }

  //   publishing = !publishing;
  // }
</script>

<div>
  <h3>登录成功</h3>

  <div class="form-info">当前大厅:{cid}</div>
  <!-- <div class="form-info">当前麦位:2</div> -->
  <div class="form-info">当前Uid:{userId}</div>
  <div class="form-info">AppId:{appId}</div>
  <div class="form-info">Channel:{channel}</div>
  <div class="form-info">channelKey:{channelKey}</div>
  <div class="form-info">Token:{token}</div>

  <button on:click={startOrClose}>{startShareing?'结束投屏':'开始投屏'}</button>
  <button on:click={updateParams}>更新参数</button>
  <!-- <button on:click={publishOrNo}>{publishing?'取消发布视频流':'发布视频流'}</button> -->
</div>
