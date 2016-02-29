export default class AppController {
    constructor(appFinder, appUploader, urlGenerator) {
        this.appFinder = appFinder;
        this.urlGenerator = urlGenerator;
        this.appUploader = appUploader;
    }

    async listAction(ctx) {
        ctx.status = 200;
        ctx.set("Content-Type", "application/json; charset=utf-8");
        ctx.body = (await this.appFinder.apps())
            .map(app => ({
                ...app,
                links: {
                    api: this.urlGenerator.generateAppUrl(app)
                }
            }));
    }

    async showAction(ctx, name) {
        const app = await this.appFinder.app(name);

        ctx.assert(app, 404, `The '${name}' app does not exist`);

        ctx.status = 200;
        ctx.set("Content-Type", "application/json; charset=utf-8");
        ctx.body = {
            ...app,
            links: {
                api: this.urlGenerator.generateAppUrl(app)
            }
        };
    }

    async addAction(ctx, data) {
        const app = await this.appFinder.app(data.name);

        ctx.assert(!app, 409, `The '${data.name}' app already exists`);

        try {
            await this.appUploader.upload(data.name);

            ctx.status = 200;
            ctx.set("Content-Type", "application/json; charset=utf-8");
            ctx.body = {
                ...data,
                links: {
                    api: this.urlGenerator.generateAppUrl(data)
                }
            };
        } catch (e) {
            ctx.status = 500;
        }
    }

    async removeAction(ctx, name) {
        const app = await this.appFinder.app(name);

        ctx.assert(app, 404, `The '${name}' app does not exist`);

        try {
            await this.appUploader.remove(name);

            ctx.status = 204;
            ctx.set("Content-Type", "application/json; charset=utf-8");
        } catch (e) {
            ctx.status = 500;
        }
    }
}
