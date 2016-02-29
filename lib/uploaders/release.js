import fs from "fs";
import LocalReleaseUploader from "./local/release";
import AmazonReleaseUploader from "./amazon/release";
import AzureReleaseUploader from "./azure/release";

export default class ReleaseUploader {
    constructor(config) {
        switch (config.storage) {
            case "local":
                this.uploader = new LocalReleaseUploader(config.local.directory);
                break;

            case "amazon":
                this.uploader = new AmazonReleaseUploader(config.amazon.key, config.amazon.secret, config.amazon.region);
                break;

            case "azure":
                this.uploader = new AzureReleaseUploader(config.azure.account, config.azure.key);
                break;
        }
    }

    async upload(app, release, file) {
        if (file.readable === false) {
            file = fs.createReadStream(file.path);
        }

        return this.uploader.upload(app, release, file);
    }

    async remove(app, release) {
        return this.uploader.remove(app, release);
    }
}
