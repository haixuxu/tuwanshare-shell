<script>
  import { renderQrCode } from "../common/qrcodeLogin";

  import { onMount } from "svelte";

  onMount(()=>{
        renderQrCode();
    })
</script>

<main>
 <div id="qrcodelogin">
      <div class="qrcode-wraper">
          <div id="qrcode"></div>
          <div id="tips">请使用点点APP扫码登录</div>
      </div>
 </div>
</main>

<style lang="scss">

  #qrcodelogin{

    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #tips{
    text-align: center;
  }
</style>
