import pkgcloud from "pkgcloud";

export default class AzureReleaseDownloader {
    constructor(account, key) {
        this.client = pkgcloud.storage.createClient({
            provider: "azure",
            storageAccount: account,
            storageAccessKey: key
        });
    }

    async download(app, release, name) {
        return this.client.download({ container: app.name, remote: release.version + "/" + name });
    }
}
