// electron.cjs

const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

// Remove the default menu bar
Menu.setApplicationMenu(null);

async function createWindow() {
  const splash = new BrowserWindow({
    width: 600,
    height: 400,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    show: true,
  });

  splash.center();
  
  const splashPath = path.join(app.getAppPath(), 'build', 'splash.html');
  console.log('Splash path =', splashPath);   // for debugging
  await splash.loadFile(splashPath);

  const win = new BrowserWindow({
    width: 900,
    height: 700,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // ✅ Declare startUrl BEFORE using it
  const startUrl = process.env.ELECTRON_START_URL
    || `file://${path.join(app.getAppPath(), 'build', 'index.html')}`;

  console.log("Loading URL:", startUrl); // Now this is valid

  await win.loadURL(startUrl);

  // ✅ Fallback timeout if ready-to-show doesn't fire
  setTimeout(() => {
    if (!win.isVisible()) {
      splash.destroy();
      win.show();
    }
  }, 10000);

  win.once('ready-to-show', () => {
    setTimeout(() => {
      splash.destroy();
      win.show();
    }, 3000);
  });
}

// IPC handlers
ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile']
  });
  return canceled ? null : filePaths[0];
});

ipcMain.handle('dialog:saveFile', async (event, { dataBuffer, defaultPath }) => {
  const { canceled, filePath } = await dialog.showSaveDialog({ defaultPath });
  if (!canceled && filePath) {
    await fs.promises.writeFile(filePath, Buffer.from(dataBuffer));
    return filePath;
  }
  return null;
});

ipcMain.handle('file:read', async (event, filePath) => {
  return fs.promises.readFile(filePath);
});

// App lifecycle
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
