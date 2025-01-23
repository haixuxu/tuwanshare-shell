# dev

```bash
npm install
npm run start 
```

# build

```bash
npm install
npm run build
```


# diandian bridge api

```js

// 申请权限
exports.askPermission = function (arg) {
    return ipcRenderer.invoke('ask-permission', arg);
};
// 获取窗口进程ID
exports.getSourceProcessId = function (arg) {
    return ipcRenderer.invoke('getSourceProcessId', arg);
};
 // 创建窗口
exports.createWindow = function (args) {
    return ipcRenderer.invoke('createWindow', args);
};

// 调整窗口大小
exports.resizeWindow=function(args){
    return ipcRenderer.invoke('resizeWindow', args);
}

exports.getPkgJson=function(){
    return JSON.stringify(package);
}
// 控制窗口最大化，最小化，关闭
exports.windowControls = (action) => ipcRenderer.send('window-controls', action);

```