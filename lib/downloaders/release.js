import path from "path";
import fs from "fs";
import LocalReleaseDownloader from "./local/release";
import AzureReleaseDownloader from "./azure/release";

export default class ReleaseDownloader {
    constructor(config) {
        switch (config.storage) {
            case "local":
                this.downloader = new LocalReleaseDownloader(config.local.directory);
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
