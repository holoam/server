import fs from "fs";
import path from "path";
import q from "q";
import rmdir from "rmdir";

export default class LocalReleaseUploader {
    constructor(dir) {
        this.dir = dir;
    }

    async upload(app, release, file) {
        const buffer = new Buffer(release.notes || "");

        return q.ninvoke(fs, "mkdir", path.join(this.dir, app.name, release.version))
            .then(() => q.ninvoke(fs, "open", path.join(this.dir, app.name, release.version, "notes"), "w"))
            .then(fd => q.ninvoke(fs, "write", fd, buffer, 0, buffer.length).finally(() => q.ninvoke(fs, "close", fd)))
            .then(() => file.pipe(fs.createWriteStream(path.join(this.dir, app.name, release.version, "update.zip"))))
        ;
    }

    async remove(app, release) {
        return q.nfcall(rmdir, path.join(this.dir, app.name, release));
    }
}
