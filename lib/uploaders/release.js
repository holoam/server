import fs from "fs";
import LocalReleaseUploader from "./local/release";
import AmazonReleaseUploader from "./amazon/release";
import AzureReleaseUploader from "./azure/release";
import OpenstackReleaseUploader from "./openstack/release";

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

            case "openstack":
                this.uploader = new OpenstackReleaseUploader(config.openstack.username, config.openstack.password, config.openstack.auth_url, config.openstack.region);
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
