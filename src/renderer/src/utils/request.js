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
                data:{
                    platform:150
                },
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


}



export const request = R.getInstance(sessionStore)