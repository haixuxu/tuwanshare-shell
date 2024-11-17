

export const isChatTest = /test/.test(location.origin);


let papiDomain = "",
    yapiDomain = "",
    userDomain = "",
    apiDomain = "",
    uDomain = "";
export const MAIN_DOMAIN = "tuwan.com"; //location.host.split(".").splice(-2).join(".")
if (isChatTest) {
    papiDomain = 'https://papi-test.' + MAIN_DOMAIN;
    yapiDomain = 'https://yapi-test.' + MAIN_DOMAIN;
    apiDomain = 'https://api-test.' + MAIN_DOMAIN;
    uDomain = 'https://u-test.' + MAIN_DOMAIN;
    userDomain = 'https://user-test.' + MAIN_DOMAIN;
} else {
    papiDomain = 'https://papi.' + MAIN_DOMAIN;
    yapiDomain = 'https://yapi.' + MAIN_DOMAIN;
    apiDomain = 'https://api.' + MAIN_DOMAIN;
    userDomain = 'https://user.' + MAIN_DOMAIN;
    uDomain = 'https://u.' + MAIN_DOMAIN;
}


export let ChatUrls = {
    getRoomList: function(fromplat) {
        return yapiDomain + "/Chatroom/getList?ver=10&from=" + fromplat
    },
    getChannelUserNum: function(cid) {
        return yapiDomain + "/Chatroom/getChannelUserNum?ver=9&cid=" + cid
    },
    getOrderRoomList: function() {
        return yapiDomain + '/Chatroom/getOrderRoom'
    },
    getWebInfo: function(channel) {
        return papiDomain + "/Agora/webinfo?apiver=2&channel=" + channel
    },
    getUsersInfo: function(accounts) {
        return papiDomain + "/Chatroom/getuserinfo?avatar=1&uids=" + accounts
    },
    getUsersInfoFrom: function(from, uid) {
        return papiDomain + "/Chatroom/getuserinfo?requestfrom=" + from + "&uids=" + uid;
    },
    getChatList: function() {
        return papiDomain + "/Chatroom/getListV6?ver=13"
    },
    regUserinfo() {
        return userDomain + '/api/method/userinfo'
    },

    getChatList2: function(param = {
        navid: 0,
        cid: 0
    }) {
        return papiDomain + "/Chatroom/getPcList?ver=13&format=jsonp&navid=" + param.navid + "&cid=" + param.cid
    },
    getPcInfo(cid) {
        return papiDomain + "/Chatroom/getPcInfo?cid=" + cid + "&format=jsonp"
    },

    uploadImage: function() {
        return yapiDomain + "/User/uploadImage"
    },
    kicking: function(roomChannel, uid) { //踢人
        return uDomain + "/Agora/kicking?channel=" + roomChannel + "&uid=" + uid
    },
    getSelfUserInfo: function() {
        return apiDomain + "/playteach/?data=getuserinfo&format=jsonp"
    },
    payDiamond: function(params) {
        return papiDomain + "/Diamond/giftMore?" + params
    },
    payBaobox: function(params) {
        return papiDomain + "/Treasure/buy?format=jsonp&" + params
    },
    miaoJie: function() {
        return yapiDomain + "/Lists/getChatQuickList"
    },
    loveTuijian: function() {
        return yapiDomain + "/Chatroom/giftRec"
    },
    biaoBai: function() {
        return apiDomain + "/playteach/?data=getconfession&format=jsonp"
    },
    leaveChannel: function() {
        return uDomain + "/Agora/leave"
    },
    search: function(kw) {
        return apiDomain + "/playteach/?type=play&data=search&format=jsonp&kw=" + kw
    },
    addordelmaixu: function(channel, uid, type) {
        return uDomain + "/Agora/putMCDescList?roomid=" + channel + "&uid=" + uid + "&type=" + type
    },
    getmaixu: function(channel) {
        return uDomain + "/Agora/getMCDescList?roomid=" + channel
    },
    getGiftRank: function() {
        return yapiDomain + "/Chatroom/getGiftRank?typeid=2&stime=1537977600&etime=1538928000"
    },
    getMoney: function() {
        return papiDomain + "/Teacher/getMoney"
    },
    kaiheiLive: function(cid) {
        return yapiDomain + "/Live/stream?cid=" + cid + "&platform=1"
    },
    getProgram: function(cid, uids) {
        return yapiDomain + "/Chatroom/getProgram?cid=" + cid + "&uids=" + uids
    },
    getBossRoomList: function() {
        return yapiDomain + "/Chatroom/getBossRoomList"
    },
    runFleet: function(cid, fid, port) {
        return papiDomain + "/Chatroom/runFleet?cid=" + cid + "&fid=" + fid + "&port=" + port
    },
    getFleetUsers: function(cid, typeid) {
        return papiDomain + "/Chatroom/getFleetUsers?cid=" + cid + "&typeid=" + typeid
    },
    dismissFleet: function(cid, port) {
        return papiDomain + "/Chatroom/dismiss?cid=" + cid + "&port=" + port
    },
    giftCidRank: function(giftid, cid, day, limit, param) {
        limit = limit || 10;
        return yapiDomain + "/Chatroom/giftCidRank?giftid=" + giftid + "&cid=" + cid + "&day=" + day + "&limit=" + limit + (param != "" ? param : "")
    },
    giftCidRank2: function(giftid, cid, day, limit, type) {
        limit = limit || 10;
        return yapiDomain + "/Chatroom/giftCidRank?giftid=" + giftid + "&cid=" + cid + "&day=" + day + "&limit=" + limit + "&type=" + type
    },
    getGiftLists(cid, navid) {
        return papiDomain + '/Teacher/giftLists?format=jsonp&platform=0&cid=' + cid + '&navid=' + navid
    },
    getHaveGift() {
        return papiDomain + "/Teacher/haveGift?mode=2&format=jsonp"
    },
    getFleetReward() {
        return papiDomain + "/Chatroom/fleetReward?format=jsonp"
    },
    getPublishInfo(cid, isBind) {
        return papiDomain + "/Chatroom/getPublishInfo?format=jsonp&cid=" + cid + "&sports=" + (isBind ? 1 : 0)
    },
    giveGift(urlParam) {
        return papiDomain + "/Teacher/giveGift?" + urlParam
    },
    uploadVoiceLog(cid, uid, time, timesamp) {
        return yapiDomain + "/Voicesendlog/addVoicelog?cid=" + cid + '&uid=' + uid + '&time=' + time + '&timesamp=' + timesamp + '&platform=1'
    },
    getTeacherList(cid) {
        return yapiDomain + "/Lists/getTeacherList?cid=" + cid + "&format=jsonp";
    },
    inviteShareInfo() {
        return yapiDomain + "/Activity/inviteShareInfo?format=jsonp"
    }
}