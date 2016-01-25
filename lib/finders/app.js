import fs from "fs";
import path from "path";
import q from "q";
import LocalAppFinder from "./local/app";
import AzureAppFinder from "./azure/app";

export default class AppFinder {
    constructor(config, serializer) {
        this.serializer = serializer;

        switch (config.storage) {
            case "local":
                this.finder = new LocalAppFinder(config.local.directory);
                break;

            case "azure":
                this.finder = new AzureAppFinder(config.azure.account, config.azure.key);
                break;
        }
    }

    async app(name) {
        const app = await this.finder.app(name);

        if (app === null) {
            return null;
        }

        return this.serializer.unserialize(name);
    }

    async apps() {
        const apps = await this.finder.apps();

        return apps.map(app => this.serializer.unserialize(app));
    }
}
