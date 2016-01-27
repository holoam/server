const IPC = require('electron').ipcRenderer,
    urlGroup = document.getElementById("group-url"),
    urlIcon = document.getElementById("icon-url"),
    url = document.getElementById("neutron-url"),
    versionGroup = document.getElementById("group-version"),
    versionIcon = document.getElementById("icon-version"),
    version = document.getElementById("neutron-version"),
    startBtn = document.getElementById("start"),
    checkBtn = document.getElementById("check"),
    pre = document.getElementById("results");

const startUpdater = () => {
    if (!url.value || !version.value) {
        if (!url.value) {
            urlGroup.classList.remove("has-success");
            urlGroup.classList.add("has-error");

            urlIcon.classList.remove("glyphicon-ok");
            urlIcon.classList.add("glyphicon-remove");
        }

        if (!version.value) {
            versionGroup.classList.remove("has-success");
            versionGroup.classList.add("has-error");

            versionIcon.classList.remove("glyphicon-ok");
            versionIcon.classList.add("glyphicon-remove");
        }

        return;
    } else {
        urlGroup.classList.remove("has-error");
        urlGroup.classList.add("has-success");

        versionGroup.classList.remove("has-error");
        versionGroup.classList.add("has-success");

        urlIcon.classList.remove("glyphicon-remove");
        urlIcon.classList.add("glyphicon-ok");

        versionIcon.classList.remove("glyphicon-remove");
        versionIcon.classList.add("glyphicon-ok");
    }

    url.disabled = true;
    version.disabled = true;
    startBtn.disabled = true;
    checkBtn.disabled = false;

    IPC.send("start-updater", [url.value, version.value]);
};

const checkForUpdate = () => IPC.send("check-for-update");
const clearLog = () => pre.innerHTML = '';

const handle = (event, args) => {
    console.log(event, args);

    pre.innerHTML = `# ${event}\n${JSON.stringify(args, null, 2)}\n\n${pre.innerHTML}`;
};

const events = ["error", "checking-for-update", "update-available", "update-not-available", "update-downloaded"];

events.forEach(event => IPC.on(event, (_, args) => handle(event, args)));
