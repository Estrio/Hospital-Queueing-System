const {
  contextBridge,
  ipcRenderer
} = require("electron");

contextBridge.exposeInMainWorld(

  "electronAPI",

  {

    printTicket: (html) =>

      ipcRenderer.invoke(
        "print-ticket",
        html
      )
  }
);