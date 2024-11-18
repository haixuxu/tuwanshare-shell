/**
 * 创建 websocket, 监听消息
 * @param roomInfo
 */
export const initWebSocket = async (roomInfo, callback) => {
    console.log("initWebSocket==");
    const nowSocketDomain = roomInfo.socketDomain;
    const nowSocketPort = roomInfo.socketPort;
    const meId = roomInfo.uid;
    let _socketApi = "";
    if (nowSocketPort == "") {
        _socketApi = "wss://" + nowSocketDomain;
    } else {
        _socketApi = "wss://" + nowSocketDomain + ":" + nowSocketPort;
    }

    const time = roomInfo.time;
    const token = roomInfo.socketToken;
    // @ts-ignore
    const socket = window.io(_socketApi, { transports: ["websocket", "polling"] });
    // multi 这个参数为1 可以 不触发顶号
    let data = { room: 1, uid: meId, time: time, token: token, multi: 1, ver: 1 };
    // socket连接后以uid登录
    socket.on("connect", () => {
        console.log("connect===");
        socket.emit("login", data);
        let initData = {
            cid: roomInfo.cid,
            uid: roomInfo.uid,
            typeid: roomInfo.typeid,
            first: 1, // 不加这个 会导致两次进厅推送 必须加上
            method: ["setchannel", "wheatlist"],
        };
        socket.emit("initlist", initData);
    });
    console.log("initWebSocket==222");
    // 后端推送来消息时
    socket.on("new_msg", (msg) => {
        let msgObj;
        if (typeof msg == "object") {
            msgObj = msg;
        } else {
            msgObj = JSON.parse(msg);
        }
        callback(msgObj);
    });
    socket.on("error", function (err) {
        console.log("err=", err);
    });
};