import pkgcloud from "pkgcloud";

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
        return async ctx => {
            ctx.attachment("update.zip");
            ctx.body = await this.client.download({ container: app.name, remote: release.version + "/" + name });
        };
    }
}
