import { globalState } from "../store";

// @ts-ignore
const JSEncrypt = window.JSEncrypt;

export function encrypt(a) {
    var c = globalState.publicKey,
        b = new JSEncrypt();
    b.setPublicKey(c);
    return b.encrypt(a);
}
export function encrypt_general(a) {
    var c = globalState.publicKey,
        b = new JSEncrypt();
    b.setPublicKey(c);
    return b.encrypt(a);
}
export function packSendData_general(a) {
    a = "||tuwan|" + JSON.stringify(a);
    return encrypt_general(a);
}
export function packSendData(a) {
    a = "||tuwan|" + JSON.stringify(a);
    return encrypt(a);
}

