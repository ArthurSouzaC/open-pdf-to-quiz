const path = require("path");
const { app, BrowserWindow } = require("electron");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { extractPDFContent, promptAi } = require("./tasks.js");

const isDev = process.env.IS_DEV == "true" ? true : false;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 650,
    autoHideMenuBar: true,
    resizable: false,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false
    },
  });

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../dist/index.html")}`
  );
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const upload = multer({});

const server = express();
const PORT = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());

server.post("/pdf", upload.single("input"), extractPDFContent);
server.post("/prompt", promptAi);

server.listen(PORT, () => {
  console.info(`Server running on http://localhost:${PORT}`);
});
