import fs from "fs";
import path from "path";
import App from "../models/app";

export default class AppFinder {
    constructor(dir) {
        this.dir = dir;
    }

    app(name) {
        if (AppFinder.exists(this.dir, name) === false) {
            return null;
        }

        return new App(name);
    }

    *apps() {
        const apps = fs.readdirSync(this.dir);

        while (apps.length) {
            yield AppFinder.factory(apps.shift());
        }
    }

    static exists(dir, name) {
        const stats = fs.statSync(AppFinder.path(dir, name));

        return stats.isDirectory();
    }

    static path(dir, name, ...tail) {
        const head = path.join(dir, name, ...tail);

        if (tail.length === 0) {
            return head;
        }

        return path.join(head, ...tail);
    }

    static factory(name) {
        return new App(name);
    }
}
