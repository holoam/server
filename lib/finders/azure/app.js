import fs from "fs";
import path from "path";
import q from "q";
import pkgcloud from "pkgcloud";


export default class AzureAppFinder {
    constructor(account, key) {
        this.client = pkgcloud.storage.createClient({
            provider: 'azure',
            storageAccount: account,
            storageAccessKey: key
        });
    }

    async app(name) {
        return { name };
    }

    async apps() {
        try {
            const containers = await q.ninvoke(this.client, "getContainers");

            return q.all(containers.map(async container => await this.app(container.name))).then(apps => apps.filter(app => !!app));
        } catch (e) {
            return [];
        }
    }
}
