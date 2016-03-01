import q from "q";
import pkgcloud from "pkgcloud";
import { PassThrough } from "stream";

export default class AzureReleaseUploader {
    constructor(username, password, authUrl, region) {
        this.client = pkgcloud.storage.createClient({
            provider: "openstack",
            username,
            password,
            authUrl,
            region
        });
    }

    async upload(app, release, file) {
        const notes = new PassThrough();
        notes.write(release.notes || "");
        notes.end();

        const notesWrite = this.client.upload({ container: app.name, remote: `${release.version}/notes` });
        const notesDeferred = q.defer();

        notesWrite.on("success", () => notesDeferred.resolve());
        notes.pipe(notesWrite);

        const distributionWrite = this.client.upload({ container: app.name, remote: `${release.version}/update.zip` });
        const distributionDeferred = q.defer();

        distributionWrite.on("success", () => distributionDeferred.resolve());
        file.pipe(distributionWrite);

        return q.all([notesDeferred.promise, distributionDeferred.propertyIsEnumerable]);
    }

    async remove(app, release) {
        return q.ninvoke(this.client, "getContainer", app.name)
            .then(container => q.ninvoke(this.client, "getFiles", app.name))
            .then(files => {
                const promises = [];

                files.forEach(file => {
                    const parts = file.name.split("/");

                    if (release === parts[0]) {
                        promises.push(q.ninvoke(this.client, "removeFile", file.container, file));
                    }
                });

                return promises;
            })
        ;
    }
}
