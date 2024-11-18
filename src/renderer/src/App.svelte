<script>
  import Login from "./pages/login.svelte";
  import { onMount } from "svelte";
  import { request } from "./utils/request";
  import { ChatUrls, isChatTest, MAIN_DOMAIN } from "./config";
  import { globalState, roomInfo } from "./store";
  import ScreenShare from "./pages/ScreenShare.svelte";

  let isLogin = false;
  let loading = true;

  onMount(async () => {
    try {
      const res = await request.get(ChatUrls.regUserinfo());
      console.log("res====", res);
      if (res?.data?.uid) {
        globalState.uid = res.data.uid;
    
        const webinfo = await request.get(
          ChatUrls.getWebInfo(globalState.channel)
        );
        Object.assign(roomInfo, webinfo.data);
        isLogin = true;
        loading = false;
      }else{
        loading = false;
        isLogin=false;
      }
      //  console.log(res);
    } catch (error) {}
  });

  function logout() {
    request.get(`https://user${isChatTest?'-test':''}.` + MAIN_DOMAIN + "/api/method/logout").then(()=>{
      location.reload();
    })
  }
</script>

{#if loading === false}
  <div class="app-container">
    {#if isLogin}

      <div class="opt-buttons">
        <button on:click={logout}>退出</button>
      </div>
      <ScreenShare></ScreenShare>
    {:else}
      <Login></Login>
    {/if}
  </div>
{/if}

<style lang="scss">
</style>
