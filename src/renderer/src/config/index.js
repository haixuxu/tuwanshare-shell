

// export const isChatTest = /(test|localhost)/.test(location.origin);
export const isChatTest = true;


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


// const SocketPort = isChatTest?2124:2122;
export const ChatConfig = {
    appid: isChatTest ? "a73424976c8642f09324dfeafb28bc60" : "eabb3d230d1a4f20bed7b17602283a93",
    IRTCAppid: isChatTest ? "630880f423bd92018cc674dd" : "6308738a2bf0e6018591d5f3",
    zegoAppid: isChatTest ? 79363342 : 2075239002,
    TRTCAppid: isChatTest ? 1600016174 : 1600055619,
    // TRTCAppid: isChatTest ? 1600016174 : 1600023991,
    maxUID: 800000000,
    emptyPng: "https://res.tuwan.com/templet/play/chat/v2/images/empty.png",
    defaultHead: 'https://uc.tuwan.com/images/noavatar_1.jpg',
    testHat: "",
    textColor: '#333',
    isUpScroll: false,
    urlapi: "chatroom",
    domain: isChatTest ? "https://y-test.tuwan.com" : window.location.origin,
    xuanyanDefaultText: "点击这里可以填写队长宣言哦~",
    uidPrefix: "cli_",
    rose: 'https://img3.tuwandata.com/uploads/play/1898151532696070.png',
    YSD_PID : isChatTest ? "203321" : "203319",
    YSD_APP_KEY : isChatTest ? "4059144a3ace4a23a351ca3f96e6693d" : "6166c2e4e9404ab8826db07406de1fde",
}

let localAppId = window.localStorage.getItem('appId') || '';

export const RTC_CONFIG = {
  enableSDKLogging: true,
  enableSDKDebugLogging: false,
  // Get your own App ID at https://dashboard.agora.io/
  appId: localAppId,
  // Please refer to https://docs.agora.io/en/Agora%20Platform/token
  token: '',
  channelId: 'testdcg',
  uid: 0,
  logFilePath: '',
};



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
    },
    shareScreenGetInfo(){
        return yapiDomain+"/sharescreen/getInfo"
    },
        /**
     * 申请屏幕共享
     * @param {*} cid 
     */
        shareScreenApply(cid){
            return yapiDomain + `/sharescreen/apply?format=jsonp&id=${cid}`;
        },
    shareScreenOpenShare(cid){
        return yapiDomain + `/sharescreen/openShare?format=jsonp&id=${cid}`;
    },
       /**
     * 断开共享：主持断开、自己取消
     * @param {*} cid 大厅ID/小厅ID
     * @param {*} uid 被操作的用户id（uid>0：主持拒绝；uid=0：自己取消；）
     */
       shareScreenCloseShare(cid, uid){
        return yapiDomain + `/sharescreen/closeShare?format=jsonp&id=${cid}&uid=${uid}`;
    },
}