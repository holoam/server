import semver from 'semver';
import send from "koa-send";
import path from "path";

export default class AppController {
    constructor(appFinder, releaseFinder, urlGenerator, config) {
        this.appFinder = appFinder;
        this.releaseFinder = releaseFinder;
        this.urlGenerator = urlGenerator;
        this.config = config;
    }

    async listAction(ctx) {
        ctx.status = 200;
        ctx.set('Content-Type', 'application/json; charset=utf-8');
        ctx.body = await this.appFinder.apps();
    }

    async showAction(ctx, appName) {
        const app = await this.appFinder.app(appName);

        ctx.assert(app, 404, "App not found.");

        ctx.status = 200;
        ctx.set('Content-Type', 'application/json; charset=utf-8');
        ctx.body = (await this.releaseFinder.releases(app))
            .map(release => ({
                ...release,
                url: this.urlGenerator.generateDownloadReleaseUrl(app, release)
            }));
    }

    async releaseAction(ctx, appName, version) {
        const app = await this.appFinder.app(appName);

        ctx.assert(app, 404, "App not found.");

        const releases = (await this.releaseFinder.releases(app))
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

    async downloadReleaseAction(ctx, appName, version) {
        const app = await this.appFinder.app(appName);

        ctx.assert(app, 404, "App not found.");

        const release = await this.releaseFinder.release(app, version);

        ctx.assert(release, 404, "Release not found.");

        return await send(ctx, "update.zip", {
            root: path.join(this.config.updates, app.name, release.version)
        });
    }
}
