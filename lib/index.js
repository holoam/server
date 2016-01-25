import Koa from "koa";
import logger from "koa-logger";
import json from "koa-json";
import route from "koa-route";
import send from "koa-send";
import semver from "semver";
import config from "./config";
import AppFinder from "./finders/app";
import AppSerializer from "./serializers/app";
import ReleaseFinder from "./finders/release";
import ReleaseSerializer from "./serializers/release";
import UrlGenerator from './utils/urlGenerator';
import AppController from './controllers/app';

const app = new Koa(),
    urlGenerator = new UrlGenerator(`${config.scheme}://${config.host}:${config.port}/apps`),
    appFinder = new AppFinder(config, new AppSerializer()),
    releaseFinder = new ReleaseFinder(config, new ReleaseSerializer()),
    appController = new AppController(appFinder, releaseFinder, urlGenerator, config);

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

app.use(route.get('/apps/:app/:version/update', function *(app, version) {
    yield appController.downloadReleaseAction(this, app, version);
}));

app.listen(config.port);
