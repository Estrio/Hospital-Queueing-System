const {
  app,
  BrowserWindow,
  ipcMain
} = require("electron");

const path = require("path");

function createWindow() {

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile("index.html");
}

// Guard against duplicate handler registration on hot reload
ipcMain.removeHandler("print-ticket");

ipcMain.handle("print-ticket", async (_, html) => {

  const printWindow = new BrowserWindow({ show: false });

  await printWindow.loadURL(
    "data:text/html;charset=utf-8," + encodeURIComponent(html)
  );

  await new Promise((resolve) => {
    printWindow.webContents.print(
      { silent: true, printBackground: false },
      (success, reason) => {
        // FIX #7: always close the hidden window after printing
        // to prevent memory leaks from accumulating hidden BrowserWindows
        printWindow.close();
        resolve({ success, reason });
      }
    );
  });

  return true;
});

app.whenReady().then(() => {
  createWindow();
});