import q from "q";
import pkgcloud from "pkgcloud";

export default class OpenstackAppFinder {
    constructor(username, password, authUrl, region) {
        this.client = pkgcloud.storage.createClient({
            provider: "openstack",
            username,
            password,
            authUrl,
            region
        });
    }

    async app(name) {
        if (typeof name === "object") {
            return name;
        }

        try {
            await q.ninvoke(this.client, "getContainer", name);

            return { name };
        } catch (e) {
            return null;
        }
    }

    async apps() {
        try {
            const containers = await q.ninvoke(this.client, "getContainers");

            return q.all(containers.map(async container => await this.app(container)));
        } catch (e) {
            return [];
        }
    }
}
