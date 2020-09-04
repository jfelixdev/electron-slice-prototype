// Modules to control application life and create native browser window
const { app, BrowserWindow, screen, ipcMain } = require('electron')
const path = require('path')

let mainWindow, maxWindow;
function createWindow(windowDisplay) {
  const WINDOW_WIDTH = 620;
  const WINDOW_HEIGHT = 744;
  let displayBounds = windowDisplay.bounds;
  let windowX = displayBounds.x + ((displayBounds.width - WINDOW_WIDTH) / 2);
  let windowY = displayBounds.y + ((displayBounds.height - WINDOW_HEIGHT) / 2);
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    x: windowX,
    y: windowY,
    useContentSize: true,
    minHeight: 300,
    minWidth: 300,
    autoHideMenuBar: true,
    frame: true,
    show: false,
    alwaysOnTop: true,
    //backgroundColor: '#808080',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  console.log(process.argv0)

  //Show the window after it's finished loading
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    // Avoid window creation on bottom when created on blur (sorta a workaround I guess but it works)
    mainWindow.setAlwaysOnTop(false);
  })

  //Need to close the window on maximize and create a new frameless window
  mainWindow.on('maximize', function () {
    let currentDisplay = screen.getDisplayMatching(mainWindow.getBounds());
    mainWindow.hide();
    createMaxWindow(currentDisplay);
    mainWindow.close();
  })
}

function createMaxWindow(windowDisplay) {
  // Create the browser window.
  maxWindow = new BrowserWindow({
    width: windowDisplay.workAreaSize.width,
    height: windowDisplay.workAreaSize.height,
    minWidth: windowDisplay.workAreaSize.width,
    minHeight: windowDisplay.workAreaSize.height,
    x: windowDisplay.bounds.x,
    y: windowDisplay.bounds.y,
    autoHideMenuBar: true,
    frame: false,
    transparent: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  // and load the index.html of the app.
  maxWindow.loadFile('index.html')

  //Show the window after it's finished loading
  maxWindow.once('ready-to-show', () => {
    maxWindow.show()
  })

  // Hide the window and create a framed window
  maxWindow.changeUnmax = function(){
    if(maxWindow.isVisible){
      let currentDisplay = screen.getDisplayMatching(maxWindow.getBounds());
      maxWindow.hide();
      createWindow(currentDisplay);
      maxWindow.close();
    }
  }

  // Hide/destroy the window on blur
  maxWindow.on('blur', function(){
    maxWindow.changeUnmax()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  //Create Initial window in the display containing the cursor
  createWindow(screen.getDisplayNearestPoint(screen.getCursorScreenPoint()))

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


// ********************************************************************************
// Main Process Code
// ********************************************************************************

// Catch unmaximize event from renderer and unmax the window
ipcMain.on('click-window-unmaximize', function (event, arg) {
  if (maxWindow.isVisible()) {
    maxWindow.changeUnmax()
  }
});