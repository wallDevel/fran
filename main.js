const {app, BrowserWindow} = require('electron') // gets electron
const path = require('path') // path operations
const url = require('url') // url operations

let mainWindow // create variable for main window

// creates a new window
function createWindow() {
  // Create the browser window with default width and height.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // load the default index.html of the application.
  mainWindow.loadURL('file://'+__dirname+'/app/main.html')

  // mainWindow.loadURL(url.format({
  //   pathname: path.join(__dirname, 'app', 'index.html'),
  //   protocol: 'file',
  //   slashes: true
  // }))

  // Open the DevTools
  mainWindow.webContents.openDevTools()

  // event emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null // main window gets null
  })
}

app.on('ready', createWindow) // if application is ready creates new main window

// called when every window gets closed
app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if(mainWindow === null){
    createWindow()
  }
})