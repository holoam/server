import Koa from "koa";
import logger from "koa-logger";
import json from "koa-json";
import route from "koa-route";
import send from "koa-send";
import semver from "semver";
import fs from "fs";
import config from "./config";
import AppFinder from "./finders/app";
import AppSerializer from "./serializers/app";
import ReleaseFinder from "./finders/release";
import ReleaseSerializer from "./serializers/release";
import UrlGenerator from "./utils/urlGenerator";
import AppController from "./controllers/app";
import ReleaseDownloader from "./downloaders/release";

const app = new Koa(),
    urlGenerator = new UrlGenerator(`${config.scheme}://${config.host}:${config.public_port}/apps`),
    appFinder = new AppFinder(config, new AppSerializer()),
    releaseFinder = new ReleaseFinder(config, new ReleaseSerializer()),
    downloader = new ReleaseDownloader(config),
    appController = new AppController(appFinder, releaseFinder, urlGenerator, downloader);

app.use(logger());
app.use(json());

app.use(route.get("/apps", function *() {
    yield appController.listAction(this);
}));

app.use(route.get("/apps/:app", function *(app) {
    yield appController.showAction(this, app);
}));

app.use(route.get("/apps/:app/:version", function *(app, version) {
    yield appController.releaseAction(this, app, version);
}));

app.use(route.get("/apps/:app/:version/update", function *(app, version) {
    yield appController.downloadReleaseAction(this, app, version);
}));

app.listen(config.private_port);

if (config.pid) {
    fs.writeFile(config.pid, process.pid);
}

process.on('SIGTERM', () => process.exit(0));
