<script>
	import { onMount } from 'svelte';
    import { thumbImageBufferToBase64 } from '../utils/thumbImage';

    export let thumbImage=null;

    let img="";

    onMount(()=>{
        setTimeout(()=>{
            img = thumbImageBufferToBase64(thumbImage);
        },100);
    })
</script>


<div class="source-img">
    {#if img}
       <img src={img}  alt=""/>
    {:else}
        loading
    {/if}
</div>