const { RPCRenderer } = require("electron-rpc");

const rpcRenderer = new RPCRenderer();

export const syscallApi = {
  add: function (a, b) {
    return rpcRenderer.call("add", a, b);
  },
  multiply: function (a, b) {
    return rpcRenderer.call("multiply", a, b);
  },
};
