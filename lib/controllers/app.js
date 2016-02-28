export default class AppController {
    constructor(appFinder, urlGenerator) {
        this.appFinder = appFinder;
        this.urlGenerator = urlGenerator;
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
}
