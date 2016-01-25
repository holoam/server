import fs from "fs";
import path from "path";
import q from "q";

export default class LocalAppFinder {
    constructor(dir) {
        this.dir = dir;
    }

    async app(name) {
        if (await this.exists(name) === false) {
            return null;
        }

        return { name };
    }

    async apps() {
        try {
            const apps = await q.ninvoke(fs, "readdir", this.dir);

            return q.all(apps.map(async app => await this.app(app))).then(apps => apps.filter(app => !!app));
        } catch (e) {
            return [];
        }
    }

    async exists(name) {
        try {
            const stats = await q.ninvoke(fs, "stat", path.join(this.dir, name));

            return stats.isDirectory();
        } catch (e) {
            return false;
        }
    }
}
