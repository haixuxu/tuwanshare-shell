import { globalState } from "../store";
import { request } from "../utils/request";

export function getRSAkey() {
    return request.get(location.protocol + "//user.tuwan.com/api/method/getpkey").then((res)=>{
        if (1037 == res.code) {
            globalState.publicKey = res.data;
        } else {
            globalState.publicKey = "";
        }
    })
}
