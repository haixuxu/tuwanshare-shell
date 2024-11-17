const { ipcMain } = require('electron');

class RPCMain {
    constructor() {
        this.methods = {};
        this.init();
    }

    // 初始化 IPC 监听
    init() {
        ipcMain.handle('rpc-call', async (event, method, ...args) => {
            if (this.methods[method]) {
                try {
                    return await this.methods[method](...args);
                } catch (err) {
                    return { error: err.message };
                }
            } else {
                return { error: `Method "${method}" not found.` };
            }
        });
    }

    // 注册方法
    register(method, handler) {
        if (typeof handler !== 'function') {
            throw new Error('Handler must be a function');
        }
        this.methods[method] = handler;
    }
}

module.exports = RPCMain;
