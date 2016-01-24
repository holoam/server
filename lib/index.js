import Koa from "koa";
import logger from "koa-logger";
import json from "koa-json";
import route from "koa-route";
import fs from "fs";
import config from "./config";
import AppFinder from "./finders/app";
import ReleaseFinder from "./finders/release";
import UrlGenerator from './utils/urlGenerator';
import AppController from './controllers/app';

const app = new Koa(),
    urlGenerator = new UrlGenerator(`${config.scheme}://${config.host}:${config.port}/apps`),
    appFinder = new AppFinder(config.updates),
    releaseFinder = new ReleaseFinder(config.updates),
    appController = new AppController(appFinder, releaseFinder, urlGenerator);

app.use(logger());
app.use(json());

app.use(route.get('/apps', function *() {
    yield appController.listAction(this);
}));

app.use(route.get('/apps/:app', function *(app) {
    yield appController.showAction(this, app);
}));

app.use(route.get('/apps/:app/:version', function *(app, version) {
    yield appController.releaseAction(this, app, version);
}));

app.use(route.get('/apps/:app/:version/download', function *(app, version) {
    yield appController.downloadReleaseAction(this, app, version);
}));

app.listen(config.port);
