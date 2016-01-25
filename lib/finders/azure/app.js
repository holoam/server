import fs from "fs";
import path from "path";
import q from "q";
import pkgcloud from "pkgcloud";
import { Container } from "pkgcloud/lib/pkgcloud/azure/storage/container";

export default class AzureAppFinder {
    constructor(account, key) {
        this.client = pkgcloud.storage.createClient({
            provider: "azure",
            storageAccount: account,
            storageAccessKey: key
        });
    }

    async app(name) {
        if (name instanceof Container) {
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

            return q.all(containers.map(async container => await this.app(container))).then(apps => apps.filter(app => !!app));
        } catch (e) {
            return [];
        }
    }
}
