
// preload.cjs

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile:    ()       => ipcRenderer.invoke('dialog:openFile'),
  saveFile:    opts     => ipcRenderer.invoke('dialog:saveFile', opts),
  readFile:    filePath => ipcRenderer.invoke('file:read', filePath),
});
