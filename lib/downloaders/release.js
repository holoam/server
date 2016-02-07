import LocalReleaseDownloader from "./local/release";
import AmazonReleaseDownloader from "./amazon/release";
import AzureReleaseDownloader from "./azure/release";

export default class ReleaseDownloader {
    constructor(config) {
        switch (config.storage) {
            case "local":
                this.downloader = new LocalReleaseDownloader(config.local.directory);
                break;

            case "amazon":
                this.downloader = new AmazonReleaseDownloader(config.amazon.key, config.amazon.secret, config.amazon.region);
                break;

            case "azure":
                this.downloader = new AzureReleaseDownloader(config.azure.account, config.azure.key);
                break;
        }
    }

    async download(app, release, name) {
        return await this.downloader.download(app, release, name);
    }
}
