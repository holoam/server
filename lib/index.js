import express from "express";
import morgan from "morgan";
import semver from "semver";
import config from "./config";
import { AppFinder } from "./finders/app";
import { ReleaseFinder } from "./finders/release";
import { Update } from "./models/update";

const app = express(),
    apps = new AppFinder(config.updates),
    releases = new ReleaseFinder(config.updates);

app.use(morgan());

app.get('/apps', function(req, res) {
    res
        .status(200)
        .set({ 'Content-Type': 'application/json; charset=utf-8' })
        .json(Array.from(apps.apps()));
});

app.get('/apps/:app', function(req, res) {
    const app = apps.app(req.params.app);

    if (app === null) {
        return res.status(404).end();
    }

    const updates = Array.from(releases.releases(app)).map(release => new Update(app, release, `${config.scheme}://${config.host}:${config.port}/apps`));

    res
        .status(200)
        .set({ 'Content-Type': 'application/json; charset=utf-8' })
        .json(updates);
});

app.get('/apps/:app/:version', function(req, res) {
    const app = apps.app(req.params.app);

    if (app === null) {
        return res.status(404).end();
    }

    const updates = Array.from(releases.releases(app))
        .filter(release => semver.gt(release.version, req.params.version))
        .sort((a, b) => semver.gt(a.version, b.version) ? 1 : (semver.lt(a.version, b.version) ? -1 : 0));

    if (updates.length === 0) {
        return res.status(204).end();
    }

    res
        .status(200)
        .set({ 'Content-Type': 'application/json; charset=utf-8' })
        .json(new Update(app, updates[0], `${config.scheme}://${config.host}:${config.port}/apps`));
});

app.get('/apps/:app/:version/update', function(req, res) {
    const app = apps.app(req.params.app);

    if (app === null) {
        return res.status(404).end();
    }

    const release = releases.release(app, req.params.version);

    if (release === null) {
        return res.status(404).end();
    }

    res.download(ReleaseFinder.path(config.updates, app.name, release.version, "update.zip"), "update.zip");
});

app.listen(config.port);
