const IPC = require('electron').ipcRenderer,
    field = document.getElementById("neutron-url"),
    startBtn = document.getElementById("start"),
    checkBtn = document.getElementById("check"),
    pre = document.getElementById("results");

const startUpdater = () => {
    field.disabled = true;
    startBtn.disabled = true;
    checkBtn.disabled = false;

    IPC.send("start-updater", document.getElementById("neutron-url").value);
};

const checkForUpdate = () => IPC.send("check-for-update");
const clearLog = () => pre.innerHTML = '';

const handle = (event, args) => {
    console.log(event, args);

    pre.innerHTML = `# ${event}\n${JSON.stringify(args, null, 2)}\n\n${pre.innerHTML}`;
};

const events = ["error", "checking-for-update", "update-available", "update-not-available", "update-downloaded"];

events.forEach(event => IPC.on(event, (_, args) => handle(event, args)));
