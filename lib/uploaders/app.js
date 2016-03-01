import LocalAppUploader from "./local/app";
import AzureAppUploader from "./azure/app";
import AmazonAppUploader from "./amazon/app";
import OpenstackAppUploader from "./openstack/app";

export default class AppUploader {
    constructor(config) {
        switch (config.storage) {
            case "local":
                this.uploader = new LocalAppUploader(config.local.directory);
                break;

            case "amazon":
                this.uploader = new AmazonAppUploader(config.amazon.key, config.amazon.secret, config.amazon.region);
                break;

            case "azure":
                this.uploader = new AzureAppUploader(config.azure.account, config.azure.key);
                break;

            case "openstack":
                this.uploader = new OpenstackAppUploader(config.openstack.username, config.openstack.password, config.openstack.auth_url, config.openstack.region);
                break;
        }
    }

    async upload(name) {
        return this.uploader.upload(name);
    }

    async remove(name) {
        return this.uploader.remove(name);
    }
}
