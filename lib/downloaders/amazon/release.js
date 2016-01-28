import pkgcloud from "pkgcloud";
import { Writable } from "stream";

export default class AmazonReleaseDownloader {
    constructor(key, secret, region) {
        this.client = pkgcloud.storage.createClient({
            provider: "amazon",
            keyId: key,
            key: secret,
            region
        });
    }

    async download(app, release, name) {
        return this.client.download({ container: app.name, remote: release.version + "/" + name });
    }
}
