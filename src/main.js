const { app, BrowserWindow, protocol, ipcMain } = require("electron");
const { exec } = require("child_process");
const path = require("node:path");

const isDev = process.env.NODE_ENV === 'development'
const devServerURL = process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    fullscreen: true,
  });

  if(isDev && devServerURL) {
    mainWindow.loadURL(devServerURL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../.vite/renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  if(isDev) {
    mainWindow.webContents.openDevTools();
  }

  // and load the index.html of the app.
  //if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
  //  mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  //} else {
  //  mainWindow.loadFile(
  //    path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
  //  );
  //}

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
  protocol.interceptFileProtocol("file", (request, callback) => {
    const url = request.url.substr(7); // Remove 'file://' from the start of the URL
    callback({ path: path.normalize(`${__dirname}/../${url}`) });
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  // Handle shutdown IPC message
  ipcMain.on("shutdown", (event) => {
    exec("sudo /sbin/shutdown -h +1", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error shutting down: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
      }
      console.log(`Shutdown stdout: ${stdout}`);
    });
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
