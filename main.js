const {
  app,
  BrowserWindow,
  ipcMain
} = require("electron");

const path = require("path");

function createWindow() {

  const win =
    new BrowserWindow({

      width: 1200,

      height: 800,

      autoHideMenuBar: true,

      webPreferences: {

        preload: path.join(
          __dirname,
          "preload.js"
        ),

        contextIsolation: true,

        nodeIntegration: false
      }
    });

  win.loadFile("index.html");
}

ipcMain.removeHandler(
  "print-ticket"
);

ipcMain.handle(

  "print-ticket",

  async (_, html) => {

    const printWindow =
      new BrowserWindow({

        show: false
      });

    await printWindow.loadURL(

      "data:text/html;charset=utf-8," +

      encodeURIComponent(html)
    );

    printWindow.webContents.print({

      silent: true,

      printBackground: false
    });

    return true;
  }
);

app.whenReady().then(() => {

  createWindow();
});