export default class SessionStorage {

    constructor(session) {
        this.session = window.sessionStorage;
        this.localsession = window.localStorage;
        this.instance = null;
        this.storeKeys = {
            recchannel: "RecChannelInfo",
            channels: "channels",
            users: "users",
            paidanAnchors: "paidanAnchors",
            selfuser: "selfuser",
            voiceLog: 'voiceLog',
            historyTag: 'historyTag',
            mainVolume: 'mainVolume', // 主音量，就是开麦闭麦按钮旁边那个调节音量的那个值
            upSeatSwitch: 'upSeatSwitch', // 主音量，就是开麦闭麦按钮旁边那个调节音量的那个值
        }
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new SessionStorage(window.sessionStorage);
        }
        return this.instance
    }
    valueType(value) {
        return Object.prototype.toString.call(value);
    }
    setItem(key, value) {
        const vType = this.valueType(value);
        let type = "";
        if (vType === "[object Array]") {
            type = "array";
        } else if (vType === "[object Object]") {
            type = "object";
        } else if (vType === "[object String]") {
            type = "string";
        } else if (vType === "[object Map]") {
            type = "map";
        } else if (vType === "[object Boolean]") {
            type = "bool";
        }
        const saveValue = {
            "type": type,
            "value": value
        };

        const _value = JSON.stringify(saveValue);
        this.session.setItem(key, _value);
        if (type == "") {
            return null
        }
    }

    getItem(key) {
        const valuestring = this.session.getItem(key);
        if (valuestring) {
            const _tempJson = JSON.parse(valuestring);
            return _tempJson.value
        }
        return null;
    }

    getMainVolume() {
        // const val = this.session.getItem(this.storeKeys.mainVolume);
        const val = this.localsession.getItem(this.storeKeys.mainVolume);
        if (val == undefined) {
            return 100
        }

        return Number(val)
    }

    setMainVolume(val) {
        // this.session.setItem(this.storeKeys.mainVolume, val);
        this.localsession.setItem(this.storeKeys.mainVolume, val);
    }

    getUpSeatSwitch() {
        return this.session.getItem(this.storeKeys.upSeatSwitch);
    }

    setUpSeatSwitch(val) {
        this.session.setItem(this.storeKeys.upSeatSwitch, val);
    }

    getHistoryTag(){
        return JSON.parse(this.localsession.getItem(this.storeKeys.historyTag))
    }

    setHistoryTag(tags) {
        this.localsession.setItem(this.storeKeys.historyTag, JSON.stringify(tags))
    }

    removeHistoryTag(){
        this.localsession.removeItem(this.storeKeys.historyTag);
    }


    setPaidanAnchors(anchors) {
        this.setItem(this.storeKeys.paidanAnchors, anchors)
    }
    getPaidanAnchors() {
        return this.getItem(this.storeKeys.paidanAnchors);
    }

    addArrayItem(key, type, value) {
        let tempValue = this.getItem(key);
        tempValue.push(value);
        this.setItem(key, tempValue)
    }

    addObjectItem(key, type, _key, value) {
        let tempValue = this.getItem(key) || {};
        tempValue[_key] = value;
        this.setItem(key, tempValue)
    }

    async addUserInfo(user) {
        const uid = user.uid * 1;
        let users = this.getItem(this.storeKeys.users) || {};
        if (users[uid]) {
            users[uid] = Object.assign(users[uid], user)
        } else {
            users[uid] = user;
        }
        this.setItem(this.storeKeys.users, users)
    }

    async addUsersInfo(users) {
        let _users = this.getItem(this.storeKeys.users) || {};

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const uid = user.uid * 1;
            if (_users[uid]) {
                _users[uid] = Object.assign(_users[uid], user)
            } else {
                _users[uid] = user;
            }
        }

        this.setItem(this.storeKeys.users, _users)
    }

    getUserInfo(uid) {
        const users = this.getItem(this.storeKeys.users);
        if (users == null) return null;
        return users[uid * 1]
    }
    getChannelInfo(channel) {
        const channels = this.getChannels();
        return channels[channel]
    }
    getRecChannel() {
        return this.getItem(this.storeKeys.recchannel)
    }

    setRecChannel(room) {
        this.setItem(this.storeKeys.recchannel, room)
    }

    setChannels(channels) {
        this.setItem(this.storeKeys.channels, channels)
    }
    getChannels() {
        return this.getItem(this.storeKeys.channels)
    }

    setSelfUser(person) {
        this.setItem(this.storeKeys.selfuser, person)
    }
    getSelfUser() {
        return this.getItem(this.storeKeys.selfuser)
    }
    addVoiceLog(data) {
        let logs = [];
        const valuestring = this.localsession.getItem(this.storeKeys.voiceLog);
        if (valuestring) {
            logs = JSON.parse(valuestring);
        }

        logs.push(data);
        // const saveValue = {
        //     "type": 'array',
        //     "value": data
        // };
        const _value = JSON.stringify(logs);
        this.localsession.setItem(this.storeKeys.voiceLog, _value);
    }
    getVoiceLog() {
        // return this.getItem(this.storeKeys.voiceLog);//
        const valuestring = this.localsession.getItem(this.storeKeys.voiceLog);
        if (valuestring) {
            const _tempJson = JSON.parse(valuestring);
            return _tempJson
        }
        return null;
    }
    removeVoiceLog() {
        this.localsession.removeItem(this.storeKeys.voiceLog);
    }

    setBaseUrl(data) {
        const _value = JSON.stringify(data);
        this.localsession.setItem('base-url', _value);
    }
    getBaseUrl() {
        const value = this.localsession.getItem('base-url');
        return JSON.parse(value)
    }

    getSongOrderList(){
        const value = this.localsession.getItem('songOrderList');
        return JSON.parse(value)
    }
    setSongOrderList(data){
        this.localsession.setItem("songOrderList",JSON.stringify(data))
    }

    getGiftEffectSwithState(){
        return this.localsession.getItem('giftEffectSwith') === 'true'
    }
    setGiftEffectSwithState(value){
        this.localsession.setItem("giftEffectSwith", value) // true为屏蔽，false为不屏蔽
    }

    getBgmFirstShow(){
        return this.localsession.getItem('bgmFirstShow');
    }
    setBgmFirstShow(){
        this.localsession.setItem("bgmFirstShow", '1')
    }

    setGoldMagicAnimIgnore(state){
        this.localsession.setItem("goldMagicAnimIgnore", state)
    }

    getGoldMagicAnimIgnore(){
        return this.localsession.getItem('goldMagicAnimIgnore');
    }
}


export const sessionStore = SessionStorage.getInstance();