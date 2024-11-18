import { createModal } from "../utils/svelteWrap";
import TargetSource from "./TargetSource.svelte";


export const showTargetsModal = (props = {}) => {
    return createModal(TargetSource, props);
};
