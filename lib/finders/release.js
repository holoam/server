import fs from "fs";
import path from "path";
import moment from "moment";
import q from "q";
import assert from "assert";
import App from "../models/app";
import ReleaseSerializer from "../serializers/release";

export default class ReleaseFinder {
    constructor(dir) {
        this.dir = dir;
        this.serializer = new ReleaseSerializer();
    }

    async release(app, name) {
        assert(app instanceof App, "app is not an instance of App");

        if (await ReleaseFinder.exists(this.dir, app, name) === false) {
            return null;
        }

        return this.serializer.unserialize(await ReleaseFinder.factory(this.dir, app, name));
    }

    async releases(app) {
        assert(app instanceof App, "app is not an instance of App");

        try {
            const releases = await q.ninvoke(fs, "readdir", path.join(this.dir, app.name));

            return q.all(releases.map(async release => this.serializer.unserialize(await ReleaseFinder.factory(this.dir, app, release))))
        } catch (e) {
            return [];
        }
    }

    static async exists(dir, app, name) {
        return q.ninvoke(fs, "stat", path.join(dir, app.name, name))
            .then(stats => stats.isDirectory())
            .catch(() => false);
    }

    static async factory(dir, app, name) {
        const filepath = path.join(dir, app.name, name, 'notes');

        return q.ninvoke(fs, "stat", filepath)
            .then(stats => {
                if (stats.isFile() === true) {
                    const notes = fs.readFileSync(filepath).toString('utf8'),
                        date = moment(stats.mtime).format();

                    return { name, notes, date };
                }

                return { name };
            })
            .catch(() => ({ name }));
    }
}
