import fs from "fs";
import path from "path";
import moment from "moment";
import { Release } from "../models/release";
import { App } from "../models/app";
import { AppFinder } from "../finders/app";

export class ReleaseFinder {
    constructor(dir) {
        this.dir = dir;
    }

    release(app, name) {
        if (app instanceof App === false) {
            throw new Error('Not an instance of App');
        }

        if (ReleaseFinder.exists(this.dir, app, name) === false) {
            return null;
        }

        return ReleaseFinder.factory(this.dir, app, name);
    }

    *releases(app) {
        if (app instanceof App === false) {
            throw new Error('Not an instance of App');
        }

        if (AppFinder.exists(this.dir, app.name) === false) {
            return null;
        }

        const releases = fs.readdirSync(AppFinder.path(this.dir, app.name));

        while (releases.length) {
            yield ReleaseFinder.factory(this.dir, app, releases.shift());
        }
    }

    static exists(dir, app, name) {
        const stats = fs.statSync(ReleaseFinder.path(dir, app, name));

        return stats.isDirectory();
    }

    static path(dir, app, name, ...tail) {
        const head = path.join(AppFinder.path(dir, app.name), name);

        if (tail.length === 0) {
            return head;
        }

        return path.join(head, ...tail);
    }

    static factory(dir, app, name) {
        const path = ReleaseFinder.path(dir, app, name, 'notes'),
            stats = fs.statSync(path);
        let notes, date;

        if (stats.isFile() === true) {
            notes = fs.readFileSync(path).toString('utf8');
            date = moment(stats.mtime).format();
        }

        return new Release(name, notes, date);
    }
}
