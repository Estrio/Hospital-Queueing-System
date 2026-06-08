const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({

    fullscreen: true,

    autoHideMenuBar: true,

    webPreferences: {
      contextIsolation: true
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
});