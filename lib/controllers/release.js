export default class ReleaseController {
    constructor(appFinder, releaseFinder, releaseUploader, urlGenerator) {
        this.appFinder = appFinder;
        this.releaseFinder = releaseFinder;
        this.urlGenerator = urlGenerator;
        this.releaseUploader = releaseUploader;
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

        ctx.assert(app, 404, `The '${name}' app does not exist`);

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

    async addAction(ctx, name, data, file) {
        ctx.assert(data.version, 400);
        ctx.assert(file, 400);

        const app = await this.appFinder.app(name);

        ctx.assert(app, 404, `The '${name}' app does not exist`);

        const release = await this.releaseFinder.release(app, data.version);

        ctx.assert(!release, 409, `The '${data.version}' release for the '${name}' app already exists`);

        try {
            await this.releaseUploader.upload(app, data, file);

            ctx.status = 200;
            ctx.set("Content-Type", "application/json; charset=utf-8");
            ctx.body = {
                ...data,
                url: this.urlGenerator.generateDownloadReleaseUrl(app, data),
                links: {
                    download: this.urlGenerator.generateDownloadReleaseUrl(app, data),
                    api: this.urlGenerator.generateReleaseUrl(app, data)
                }
            };
        } catch (e) {
            ctx.status = 500;
        }
    }

    async removeAction(ctx, name, version) {
        const app = await this.appFinder.app(name);

        ctx.assert(app, 404, `The '${name}' app does not exist`);

        const release = await this.releaseFinder.release(app, version);

        ctx.assert(release, 404, `The '${version}' release for the '${name}' app does not exist`);

        try {
            await this.releaseUploader.remove(app, version);

            ctx.status = 204;
            ctx.set("Content-Type", "application/json; charset=utf-8");
        } catch (e) {
            ctx.status = 500;
        }
    }
}
