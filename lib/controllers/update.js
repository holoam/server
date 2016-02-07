import semver from "semver";

export default class UpdateController {
    constructor(appFinder, releaseFinder, urlGenerator, downloader) {
        this.appFinder = appFinder;
        this.releaseFinder = releaseFinder;
        this.urlGenerator = urlGenerator;
        this.downloader = downloader;
    }

    async nextAction(ctx, name, version) {
        const app = await this.appFinder.app(name);

        ctx.assert(app, 404, `The '${name}' app does not exist`);

        const releases = (await this.releaseFinder.releases(app))
            .filter(release => semver.gt(release.version, version))
            .sort((a, b) => semver.gt(a.version, b.version) ? -1 : (semver.lt(a.version, b.version) ? 1 : 0));

        if (releases.length === 0) {
            ctx.status = 204;
            return;
        }

        ctx.status = 200;
        ctx.set("Content-Type", "application/json; charset=utf-8");
        ctx.body = {
            ...releases[0],
            url: this.urlGenerator.generateDownloadReleaseUrl(app, releases[0])
        };
    }

    async downloadReleaseAction(ctx, name, version) {
        const app = await this.appFinder.app(name);

        ctx.assert(app, 404, `The '${name}' app does not exist`);

        const release = await this.releaseFinder.release(app, version);

        ctx.assert(release, 404, `The '${version}' release for the '${name}' app does not exist`);

        ctx.attachment("update.zip");
        ctx.body = await this.downloader.download(app, release, "update.zip");
    }
}
