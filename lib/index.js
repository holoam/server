import Koa from "koa";
import logger from "koa-logger";
import json from "koa-json";
import route from "koa-route";
import send from "koa-send";
import semver from "semver";
import fs from "fs";
import config from "./config";
import AppFinder from "./finders/app";
import ReleaseFinder from "./finders/release";
import UrlGenerator from './utils/urlGenerator';

const app = new Koa(),
    urlGenerator = new UrlGenerator(`${config.scheme}://${config.host}:${config.port}/apps`),
    appFinder = new AppFinder(config.updates),
    releaseFinder = new ReleaseFinder(config.updates);

app.use(logger());
app.use(json());

app.use(route.get('/apps', function *() {
    this.status = 200;
    this.set('Content-Type', 'application/json; charset=utf-8');
    this.body = Array.from(appFinder.apps());
}));

app.use(route.get('/apps/:app', function *(app) {
    app = appFinder.app(app);

    if (app === null) {
        this.status = 404;
        return;
    }

    this.status = 200;
    this.set('Content-Type', 'application/json; charset=utf-8');
    this.body = Array.from(releaseFinder.releases(app))
        .map(release => ({
            ...release,
            url: urlGenerator.generateDownloadReleaseUrl(app, release)
        }));
}));

app.use(route.get('/apps/:app/:version', function *(app, version) {
    app = appFinder.app(app);

    if (app === null) {
        this.status = 404;
        return;
    }

    const releases = Array.from(releaseFinder.releases(app))
        .filter(release => semver.gt(release.version, version))
        .sort((a, b) => semver.gt(a.version, b.version) ? 1 : (semver.lt(a.version, b.version) ? -1 : 0));

    if (releases.length === 0) {
        this.status = 204;
        return;
    }

    this.status = 200;
    this.set('Content-Type', 'application/json; charset=utf-8');
    this.body = {
        ...releases[0],
        url: urlGenerator.generateDownloadReleaseUrl(app, releases[0])
    };
}));

app.use(route.get('/apps/:app/:version/download', function *(app, version) {
    app = appFinder.app(app);

    if (app === null) {
        this.status = 404;
        return;
    }

    const release = releaseFinder.release(app, version);

    if (release === null) {
        this.status = 404;
        return;
    }

    yield send(this, "update.zip", { root: ReleaseFinder.path(config.updates, app, release.version) });
}));

app.listen(config.port);
