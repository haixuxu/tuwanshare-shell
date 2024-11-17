// This file is the entry point for the Electron application.

// const { app, BrowserWindow } = require('electron')
const { app, protocol, BrowserWindow, session } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      partition: "persist:diandianuser", // 持久化分区，数据会存储到磁盘
    },
  });

  if (process.env.NODE_ENV !== "development") {
    // Load production build
    win.loadFile(`${__dirname}/renderer/dist/index.html`);
  } else {
    // Load vite dev server page
    console.log("Development mode");
    win.loadURL("app://index.html");
  }
}

app.whenReady().then(() => {
  // 注册自定义协议
  protocol.registerHttpProtocol("app", (request, callback) => {
    const url = request.url.replace("app://", "http://localhost:5173/");
    callback({ url });
  });

  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
