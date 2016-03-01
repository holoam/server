import "babel-polyfill";
import expect from "expect";
import Router from "koa-router";
import App from "../../../lib/models/app";
import AppController from "../../../lib/controllers/app";
import UrlGenerator from "../../../lib/utils/urlGenerator";

describe("AppController", () => {
    let finder, controller, app, context, generator, baseUrl, router;

    beforeEach(() => { app = new App("todo"); });
    beforeEach(() => {
        finder = {
            apps: async () => [app],
            app: async name => (name === app.name ? app : null)
        };
    });
    beforeEach(() => { baseUrl = "http://baseUrl"; });
    beforeEach(() => { router = new Router(); });
    beforeEach(() => { generator = new UrlGenerator(baseUrl, router); });
    beforeEach(() => { controller = new AppController(finder, generator); });
    beforeEach(() => {
        context = {
            headers: {},
            set: function (key, value) {
                this.headers[key] = value;
            },
            assert: function (condition, status, message) {
                if (!condition) {
                    this.status = status;
                    this.body = message;

                    throw new Error();
                }
            }
        };
    });

    it("lists apps", async () => {
        await controller.listAction(context);

        expect(context.status).toEqual(200);
        expect(context.headers).toEqual({ "Content-Type": "application/json; charset=utf-8" });
        expect(context.body).toEqual([{
            ...app,
            links: {
                api: generator.generateAppUrl(app)
            }
        }]);
    });

    it("shows defined app", async () => {
        await controller.showAction(context, "todo");

        expect(context.status).toEqual(200);
        expect(context.headers).toEqual({ "Content-Type": "application/json; charset=utf-8" });
        expect(context.body).toEqual({
            ...app,
            links: {
                api: generator.generateAppUrl(app)
            }
        });
    });

    it("show undefined app", async () => {
        const spy = expect.spyOn(context, "assert").andCallThrough();

        try {
            await controller.showAction(context, "tata");
        } catch (e) {}

        expect(spy).toHaveBeenCalledWith(null, 404, "The 'tata' app does not exist");
    });
});
