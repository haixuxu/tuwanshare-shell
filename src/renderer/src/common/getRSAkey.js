import { globalState } from "../store";

export function getRSAkey() {
    
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: "get",
            url: location.protocol + "//user.tuwan.com/api/method/getpkey",
            dataType: "jsonp",
            jsonp: "callback",
            success: function (a) {
                if (1037 == a.code) {
                    globalState.publicKey = a.data;
                } else {
                    globalState.publicKey = "";
                }
                resolve();
            },
        });
    })
}
