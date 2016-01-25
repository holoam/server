import fs from "fs";
import path from "path";
import moment from "moment";
import q from "q";
import assert from "assert";
import App from "../models/app";
import LocalReleaseFinder from "./local/release";

export default class ReleaseFinder {
    constructor(config, serializer) {
        this.serializer = serializer;

        switch (config.storage) {
            case "local":
                this.finder = new LocalReleaseFinder(config.local.directory);
                break;
        }
    }

    async release(app, name) {
        const release = await this.finder.app(app, name);

        if (release === null) {
            return null;
        }

        return this.serializer.unserialize(release);
    }

    async releases(app) {
        const releases = await this.finder.releases(app);

        return releases.map(release => this.serializer.unserialize(release));
    }
}
