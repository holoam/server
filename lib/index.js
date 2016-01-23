import Koa from "koa";
import logger from "koa-logger";
import json from "koa-json";
import route from "koa-route";
import send from "koa-send";
import semver from "semver";
import fs from "fs";
import config from "./config";
import { AppFinder } from "./finders/app";
import { ReleaseFinder } from "./finders/release";
import { Update } from "./models/update";

const app = new Koa(),
    apps = new AppFinder(config.updates),
    releases = new ReleaseFinder(config.updates);

app.use(logger());
app.use(json());

app.use(route.get('/apps', function *() {
    this.status = 200;
    this.set('Content-Type', 'application/json; charset=utf-8');
    this.body = Array.from(apps.apps());
}));

app.use(route.get('/apps/:app', function *(app) {
    app = apps.app(app);

    if (app === null) {
        this.status = 404;
        return;
    }

    this.status = 200;
    this.set('Content-Type', 'application/json; charset=utf-8');
    this.body = Array.from(releases.releases(app))
        .map(release => new Update(app, release, `${config.scheme}://${config.host}:${config.port}/apps`));
}));

app.use(route.get('/apps/:app/:version', function *(app, version) {
    app = apps.app(app);

    if (app === null) {
        this.status = 404;
        return;
    }

    const updates = Array.from(releases.releases(app))
        .filter(release => semver.gt(release.version, version))
        .sort((a, b) => semver.gt(a.version, b.version) ? 1 : (semver.lt(a.version, b.version) ? -1 : 0));

    if (updates.length === 0) {
        this.status = 204;
        return;
    }

    this.status = 200;
    this.set('Content-Type', 'application/json; charset=utf-8');
    this.body = new Update(app, updates[0], `${config.scheme}://${config.host}:${config.port}/apps`);
}));

app.use(route.get('/apps/:app/:version/download', function *(app, version) {
    app = apps.app(app);

    if (app === null) {
        this.status = 404;
        return;
    }

    const release = releases.release(app, version);

    if (release === null) {
        this.status = 404;
        return;
    }

    yield send(this, "update.zip", { root: ReleaseFinder.path(config.updates, app, release.version) });
}));

app.listen(config.port);
