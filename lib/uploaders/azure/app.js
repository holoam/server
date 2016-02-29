import q from "q";
import pkgcloud from "pkgcloud";

export default class AzureAppUploader {
    constructor(account, key) {
        this.client = pkgcloud.storage.createClient({
            provider: "azure",
            storageAccount: account,
            storageAccessKey: key
        });
    }

    async upload(name) {
        return q.ninvoke(this.client, "createContainer", name);
    }

    async remove(name) {
        return q.ninvoke(this.client, "destroyContainer", name);
    }
}
