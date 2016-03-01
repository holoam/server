import q from "q";
import pkgcloud from "pkgcloud";

export default class OpenstackAppUploader {
    constructor(username, password, authUrl, region) {
        this.client = pkgcloud.storage.createClient({
            provider: "openstack",
            username,
            password,
            authUrl,
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
