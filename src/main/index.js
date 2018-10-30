import { app, BrowserWindow } from 'electron'
var scrape = require('website-scraper');
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  let u1 = "file:///C:/Users/adrian/Downloads/8%20tratamientos%20de%20belleza%20con%20huevo%20para%20tu%20piel%20y%20cabello%20-%20Mejor%20con%20Salud.html"
  let u = "file:///C:/Users/adrian/Downloads/Must-Have%20Social%20Meta%20Tags%20for%20Twitter,%20Google+,%20Facebook%20and%20More%20-%20Moz.html"
  let i = 'http://localhost';
  // let b = new BrowserWindow()
  // b.loadURL(u)
  // b.webContents.on('did-finish-load', () => {
  //   const options = {
  //     urls: [i],
  //     directory: 'd:/axx4',
  //     onResourceSaved: (resource) => {
  //       console.log(resource.url);
  //       console.log(resource.filename);
  //     },
  //     onResourceError: (resource, err) => {
  //       console.log(`Resource ${resource} was not saved because of ${err}`);
  //     },
  //   }
  //   scrape(options, (error, result) => {
  //     b.destroy();
  //   });
  // })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
