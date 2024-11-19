<script>
    import { thumbImageBufferToBase64 } from '../utils/thumbImage';

    export let sources = [];

    export let closeModal;

    function onCloseHandle() {
        closeModal && closeModal();
    }

    function clickItem(item) {
        console.log('item=====');
        closeModal(null, item);
    }
</script>

<div class="shadow_container">
    <div class="common_modal_content deatil_modal_content">
        <div class="common_modal_close" on:click={onCloseHandle} role="presentation"></div>
        <div class="target_modal_content">
            <div class="target_list">
                {#each sources as item}
                    <div class="target_item" on:click={() => clickItem(item)} role="presentation">
                        <div class="targetitem-title">{item.sourceName}/{item.sourceId}</div>
                        <div class="targetitem-body">
                            <img src={thumbImageBufferToBase64(item.thumbImage)} alt="" />
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
