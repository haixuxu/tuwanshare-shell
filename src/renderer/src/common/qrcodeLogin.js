import { MAIN_DOMAIN, isChatTest } from '../config';
import { globalState } from '../store';
import { packSendData_general } from '../utils/encryption';
import { QRCode } from '../utils/qrcode';
import { request } from '../utils/request';

let qrCode = '';
let qrCodeInstance = null;
let _renderQrCodeHandler = null;

export function renderQrCode() {
    if (globalState.uid) return;
    const qrJson = {
        c: qrCode,
    };
    const content = packSendData_general(qrJson);
    request.get(`https://user${isChatTest ? '-test' : ''}.` + MAIN_DOMAIN + '/api/method/qrcode?data=' + encodeURIComponent(content)).then((response) => {
        if (response.code != 1037) {
            if (response.code != 0 && response.code != -1001) {
                qrCode = response.data;

                if (qrCodeInstance == null) {
                    qrCodeInstance = new QRCode('qrcode', {
                        text: qrCode,
                        width: 200,
                        height: 200,
                        colorDark: '#000000',
                        colorLight: '#ffffff',
                        correctLevel: QRCode.CorrectLevel.H,
                    });
                } else {
                    qrCodeInstance.clear();
                    qrCodeInstance.makeCode(qrCode);
                }
            } else {
                if (response.code == 0) {
                    window.location.reload();
                }
            }
        }

        _renderQrCodeHandler = setTimeout(() => {
            renderQrCode();
        }, 2000);
    });
}
