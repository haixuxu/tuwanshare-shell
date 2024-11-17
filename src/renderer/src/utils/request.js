import { ChatUrls } from "../config";
import { sessionStore } from "./sessionstore";

 class R {
    constructor(sessionStore) {
        this.instance = null;
        this.$ = window.jQuery;
        this.session = sessionStore
    }
    static getInstance(sessionStore) {
        if (!this.instance) {
            this.instance = new R(sessionStore);
        }
        return this.instance;
    }
    get(url, dataType = 'jsonp') {
        return new Promise((resolve, reject) => {
            const params = {
                url: url,
                type: "get",
                dataType: dataType,
                success: (response) => {
                    resolve(response)
                },
                timeout: 30000,
                error: (xmlhttpRequest, textStatus, errorThrown) => {
                    resolve({ error: -99 })
                    // reject()
                }
            }

            if (dataType === 'json') {
                params.xhrFields = {
                    withCredentials: true
                }
            }

            this.$.ajax(params)
        })
    }
    post(url, data, contentType) {
        return new Promise((resolve, reject) => {
            const params = {
                url: url.indexOf("?")!=-1 ? url+ "&format=json" :  url+ "?format=json",
                type: "POST",
                data: data,
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                success: function(response) {
                    resolve(response)
                }
            }

            if (contentType) {
                params.contentType = contentType
            }

            this.$.ajax(params)
        })
    }

    getBinary(url){
        return new Promise((resolve, reject)=>{

            var oReq = new XMLHttpRequest();
            oReq.open("GET", url, true);
            oReq.responseType = "arraybuffer";

            oReq.onload = function(oEvent) {
                var arrayBuffer = oReq.response;
                var byteArray = new Uint8Array(arrayBuffer);
                resolve(byteArray);
            };

            oReq.onerror = function (err){
                resolve({ error: -99 })
            }
            oReq.send();
        })
    }

    getUserInfo(uid, from = 'self', isSelf) {
        return new Promise((resolve, reject) => {
            let user = this.session.getUserInfo(uid);
            if (user && user.age && !isSelf) {
                resolve(user)
            } else {
                if (uid > 800000000) {
                    resolve(this.getYoukeInfo(uid))
                } else {
                    this.get(ChatUrls.getUsersInfoFrom(from, uid)).then(response => {
                        if (response.error == 0) {
                            const data = response["data"];
                            if (data.length > 0) {
                                user = data[0];
                                if (isSelf) {
                                    const mobile = response.mobile;
                                    user['mobile'] = mobile;
                                    this.session.setSelfUser(user);
                                }
                                this.session.addUserInfo(user);
                                resolve(user);
                            }
                        }
                    });
                }

            }
        })
    }

    getUsersInfo(uids, from="") {
        return new Promise((resolve, reject) => {
            this.get(ChatUrls.getUsersInfoFrom(from, uids)).then(response => {
                if (response.error == 0) {
                    const data = response["data"];
                    if (data.length > 0) {
                        this.session.addUsersInfo(data);
                    }
                    resolve(data);
                }
            })
        })
    }

    getYoukeInfo(uid) {
        return {
            uid: uid,
            nickname: "游客" + uid,
            avatar: "https://uc.tuwan.com/images/noavatar_1.jpg",
            medal: "",
            hat: "",
            teacher: 0,
            vip: 0,
            score: 5,
            viplevel: 0,
            vipuid: 0,
            vipicon: "",
            ordernum: 0,
            car: {},
            sex: 1,
            age: 20,
            services: [],
            tag: "",
            color: "#666",
            pendant: "",
            guard: []
        }
    }

}



export const request = R.getInstance(sessionStore)