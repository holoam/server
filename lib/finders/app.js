import fs from "fs";
import path from "path";
import q from "q";
import AppSerializer from "../serializers/app";

export default class AppFinder {
    constructor(dir) {
        this.dir = dir;
        this.serializer = new AppSerializer();
    }

    async app(name) {
        if (await AppFinder.exists(this.dir, name) === false) {
            return null;
        }

        return this.serializer.unserialize(name);
    }

    async apps() {
        const apps = await q.ninvoke(fs, "readdir", this.dir);

        return apps.map(app => this.serializer.unserialize(app));
    }

    static async exists(dir, name) {
        return q.ninvoke(fs, "stat", path.join(dir, name))
            .then(stats => stats.isDirectory())
            .catch(() => false);
    }
}
