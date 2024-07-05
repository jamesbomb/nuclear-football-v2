import { app, BrowserWindow, ipcMain } from 'electron'
// const { exec } = require('child_process')
const path = require('path')

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    useContentSize: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
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
    // mainWindow.webContents.openDevTools({ mode: 'right' })
  }
  mainWindow.show()
}

app.on('window-all-closed', () => {
  app.quit()
  // if (process.platform !== 'darwin') {
  // app.quit()
  // }
})

app.on('ready', createWindow)

// eslint-disable-next-line no-unused-vars
ipcMain.on('close-app', (event) => {
  console.log('App will close in 10 seconds...')
  setTimeout(() => {
    app.quit()
    // exec('sudo shutdown -h now', (error, stdout, stderr) => {
    // if (error) {
    // console.error(`Error shutting down: ${error.message}`)
    // return
    // }
    // if (stderr) {
    // console.error(`Stderr: ${stderr}`)
    // return
    // }
    // console.log(`Shutdown stdout: ${stdout}`)
    // })
  }, 10000)
})
