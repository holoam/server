import q from "q";
import pkgcloud from "pkgcloud";

export default class AmazonAppUploader {
    constructor(key, secret, region) {
        this.client = pkgcloud.storage.createClient({
            provider: "amazon",
            keyId: key,
            key: secret,
            region
        });
    }

    async upload(name) {
        return q.ninvoke(this.client, "createContainer", name);
    }

    async remove(name) {
        return q.ninvoke(this.client, "destroyContainer", name);
    }
}
