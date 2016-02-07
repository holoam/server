export default class AppController {
    constructor(appFinder) {
        this.appFinder = appFinder;
    }

    async listAction(ctx) {
        ctx.status = 200;
        ctx.set("Content-Type", "application/json; charset=utf-8");
        ctx.body = await this.appFinder.apps();
    }

    async showAction(ctx, name) {
        const app = await this.appFinder.app(name);

        ctx.assert(app, 404, `The '${name}' app does not exist`);

        ctx.status = 200;
        ctx.set("Content-Type", "application/json; charset=utf-8");
        ctx.body = app;
    }
}
