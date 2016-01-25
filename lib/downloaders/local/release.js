import path from "path";
import fs from "fs";

export default class LocalReleaseDownloader {
    constructor(dir) {
        this.dir = dir;
    }

    async download(app, release, name) {
        return fs.createReadStream(path.join(this.dir, app.name, release.version, name));
    }
}
