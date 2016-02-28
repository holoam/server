export default class ReleaseController {
    constructor(appFinder, releaseFinder, urlGenerator) {
        this.appFinder = appFinder;
        this.releaseFinder = releaseFinder;
        this.urlGenerator = urlGenerator;
    }

    async listAction(ctx, name) {
        const app = await this.appFinder.app(name);

        ctx.assert(app, 404, `The '${name}' app does not exist`);

        ctx.status = 200;
        ctx.set("Content-Type", "application/json; charset=utf-8");
        ctx.body = (await this.releaseFinder.releases(app))
            .map(release => ({
                ...release,
                url: this.urlGenerator.generateDownloadReleaseUrl(app, release),
                links: {
                    download: this.urlGenerator.generateDownloadReleaseUrl(app, release),
                    api: this.urlGenerator.generateReleaseUrl(app, release)
                }
            }));
    }

    async showAction(ctx, name, version) {
        const app = await this.appFinder.app(name);

        ctx.assert(app, 404, `App ${name} does not exist`);

        const release = await this.releaseFinder.release(app, version);

        ctx.assert(release, 404, `The '${version}' release for the '${name}' app does not exist`);

        ctx.status = 200;
        ctx.set("Content-Type", "application/json; charset=utf-8");
        ctx.body = {
            ...release,
            url: this.urlGenerator.generateDownloadReleaseUrl(app, release),
            links: {
                download: this.urlGenerator.generateDownloadReleaseUrl(app, release),
                api: this.urlGenerator.generateReleaseUrl(app, release)
            }
        };
    }
}
