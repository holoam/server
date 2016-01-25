import fs from "fs";
import path from "path";
import moment from "moment";
import q from "q";
import assert from "assert";
import App from "../../models/app";
import pkgcloud from "pkgcloud";
import { Readable } from "stream";

export default class LocalReleaseFinder {
    constructor(account, key) {
        this.client = pkgcloud.storage.createClient({
            provider: "azure",
            storageAccount: account,
            storageAccessKey: key
        });
    }

    async release(app, name) {
        assert(app instanceof App, "app is not an instance of App");

        try {
            const releases = await this.releases(app);

            return releases.find(release => release.name === name);
        } catch (e) {
            return null
        }
    }

    async releases(app) {
        assert(app instanceof App, "app is not an instance of App");

        try {
            const files = await q.ninvoke(this.client, "getFiles", app.name);

            let releases = {},
                promises = [];

            files.forEach(file => {
                const parts = file.name.split("/"),
                    release = parts[0];

                if (release && !releases[release]) {
                    releases[release] = { name: release };
                }

                if (parts[1] === "notes") {
                    const deferred = q.defer();

                    promises.push(deferred.promise);

                    try {
                        const notes = this.client.download({ container: file.container, remote: file.name });
                        let contents = "";

                        notes.on("data", buffer => contents += buffer.toString());
                        notes.on("end", () => {
                            releases[release].notes = contents;

                            deferred.resolve();
                        });
                    } catch (e) {
                        deferred.resolve();
                    }
                }
            });

            return q.all(promises).then(() => Object.values(releases));
        } catch (e) {
            return [];
        }
    }
}
