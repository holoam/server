import fs from "fs";
import path from "path";
import q from "q";
import rmdir from "rmdir";

export default class LocalAppUploader {
    constructor(dir) {
        this.dir = dir;
    }

    async upload(name) {
        return q.ninvoke(fs, "mkdir", path.join(this.dir, name));
    }

    async remove(name) {
        return q.nfcall(rmdir, path.join(this.dir, name));
    }
}
