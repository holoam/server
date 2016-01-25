import { app, BrowserWindow, ipcMain as IPC, autoUpdater } from "electron";
import { electron as config } from "./package.json";

config.switches.forEach(sw => app.commandLine.appendSwitch(sw));

app.on('window-all-closed', () => app.quit());

app.on('ready', () => {
    let mainWindow = new BrowserWindow(config.window);

    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.openDevTools({ detach: true });

    mainWindow.on('closed', () => mainWindow = null);

    IPC.on("start-updater", (_, url) => autoUpdater.setFeedURL(`${url}/apps/${app.getName()}/${app.getVersion()}`));
    IPC.on("check-for-update", () => autoUpdater.checkForUpdates());

    const send = (event, args) =>  mainWindow.webContents.send(event, args);

    const events = ["error", "checking-for-update", "update-available", "update-not-available", "update-downloaded"];

    events.forEach(event => autoUpdater.on(event, (_, ...args) => send(event, args)));
});
