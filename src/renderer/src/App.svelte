<script>
  import Login from "./pages/login.svelte";
  import {onMount} from 'svelte';
  import { request } from "./utils/request";
  import { ChatUrls } from "./config";

  let isLogin = false;
  let loading = false;

  onMount(async () => {
      try {
         const res = await  request.get(ChatUrls.regUserinfo());
         console.log('res====',res);
        //  console.log(res);
      } catch (error) {
          
      }
  });
</script>

{#if loading === false}
  <div class="app-container">
    {#if isLogin}{:else}
      <Login></Login>
    {/if}
  </div>
{/if}

<style lang="scss">
</style>
