import semver from 'semver';
import send from "koa-send";

export default class AppController {
    constructor(appFinder, releaseFinder, urlGenerator) {
        this.appFinder = appFinder;
        this.releaseFinder = releaseFinder;
        this.urlGenerator = urlGenerator;
    }

    *listAction(ctx) {
        ctx.status = 200;
        ctx.set('Content-Type', 'application/json; charset=utf-8');
        ctx.body = Array.from(this.appFinder.apps())
            .map(app => ({...app}));
    }

    *showAction(ctx, appName) {
        const app = this.appFinder.app(appName);

        if (app === null) {
            ctx.status = 404;
            return;
        }

        ctx.status = 200;
        ctx.set('Content-Type', 'application/json; charset=utf-8');
        ctx.body = Array.from(this.releaseFinder.releases(app))
            .map(release => ({
                ...release,
                url: this.urlGenerator.generateDownloadReleaseUrl(app, release)
            }));
    }

    *releaseAction(ctx, appName, version) {
        const app = this.appFinder.app(appName);

        if (app === null) {
            ctx.status = 404;
            return;
        }

        const releases = Array.from(this.releaseFinder.releases(app))
            .filter(release => semver.gt(release.version, version))
            .sort((a, b) => semver.gt(a.version, b.version) ? 1 : (semver.lt(a.version, b.version) ? -1 : 0));

        if (releases.length === 0) {
            ctx.status = 204;
            return;
        }

        ctx.status = 200;
        ctx.set('Content-Type', 'application/json; charset=utf-8');
        ctx.body = {
            ...releases[0],
            url: this.urlGenerator.generateDownloadReleaseUrl(app, releases[0])
        };
    }

    *downloadReleaseAction(ctx, appName, version) {
        const app = this.appFinder.app(appName);

        if (app === null) {
            ctx.status = 404;
            return;
        }

        const release = this.releaseFinder.release(app, version);

        if (release === null) {
            ctx.status = 404;
            return;
        }

        yield send(ctx, "update.zip", {
            root: this.ReleaseFinder.path(config.updates, app, release.version)
        });
    }
}
