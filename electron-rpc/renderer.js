const { ipcRenderer } = require('electron');

class RPCRenderer {
    // 调用主进程的方法
    async call(method, ...args) {
        try {
            const response = await ipcRenderer.invoke('rpc-call', method, ...args);
            if (response && response.error) {
                throw new Error(response.error);
            }
            return response;
        } catch (err) {
            console.error(`RPC Error: ${err.message}`);
            throw err;
        }
    }
}

module.exports = RPCRenderer;
