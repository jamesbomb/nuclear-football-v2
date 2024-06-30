import { app, BrowserWindow, ipcMain } from 'electron'
const { exec } = require('child_process')

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
    fullscreen: true
  })
  mainWindow.webContents.on('new-window', (e) => e.preventDefault())
  mainWindow.removeMenu()

  if (app.isPackaged) {
    await mainWindow.loadFile('./index.html')
  } else {
    // eslint-disable-next-line no-undef
    await mainWindow.loadURL(`http://localhost:${WDS_PORT}`)
    mainWindow.webContents.openDevTools({ mode: 'right' })
  }
  mainWindow.show()
}

app.on('window-all-closed', () => {
  app.quit()
  // if (process.platform !== 'darwin') {
  //     app.quit()
  // }
})

app.on('ready', createWindow)

// eslint-disable-next-line no-unused-vars
ipcMain.on('shutdown', (event) => {
  exec('sudo /sbin/shutdown -h +1', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error shutting down: ${error.message}`)
      return
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`)
      return
    }
    console.log(`Shutdown stdout: ${stdout}`)
  })
})
