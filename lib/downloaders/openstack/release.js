import pkgcloud from "pkgcloud";

export default class OpenstackReleaseDownloader {
    constructor(username, password, authUrl, region) {
        this.client = pkgcloud.storage.createClient({
            provider: "openstack",
            username,
            password,
            authUrl,
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
