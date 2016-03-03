import LocalReleaseDownloader from "./local/release";
import AmazonReleaseDownloader from "./amazon/release";
import AzureReleaseDownloader from "./azure/release";
import GithubReleaseDownloader from "./github/release";
import OpenstackReleaseDownloader from "./openstack/release";

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

            case "github":
                this.downloader = new GithubReleaseDownloader(config.github.token, config.github.owner, config.github.repositories);
                break;

            case "openstack":
                this.downloader = new OpenstackReleaseDownloader(config.openstack.username, config.openstack.password, config.openstack.auth_url, config.openstack.region);
                break;
        }
    }

    async download(app, release, name) {
        return this.downloader.download(app, release, name);
    }
}
