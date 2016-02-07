import "babel-polyfill";
import expect from "expect";
import UrlGenerator from "../../../lib/utils/urlGenerator";
import App from "../../../lib/models/app";
import Release from "../../../lib/models/release";
import AppController from "../../../lib/controllers/app";

describe("AppController", () => {
    let finder, controller, app, context;

    beforeEach(() => app = new App("todo"));
    beforeEach(() => finder = {
        apps: async () => [app],
        app: async name => (name === app.name ? app : null)
    });
    beforeEach(() => controller = new AppController(finder));
    beforeEach(() => context = {
        headers: {},
        set: function(key, value) {
            this.headers[key] = value;
        },
        assert: function(condition, status, message) {}
    });

    it("lists apps", async () => {
        await controller.listAction(context);

        expect(context.status).toEqual(200);
        expect(context.headers).toEqual({ "Content-Type": "application/json; charset=utf-8" });
        expect(context.body).toEqual([app]);
    });

    it("shows defined app", async () => {
        await controller.showAction(context, "todo");

        expect(context.status).toEqual(200);
        expect(context.headers).toEqual({ "Content-Type": "application/json; charset=utf-8" });
        expect(context.body).toEqual(app);
    });

    it("show undefined app", async () => {
        const spy = expect.spyOn(context, "assert").andCallThrough();

        await controller.showAction(context, "tata");

        expect(spy).toHaveBeenCalledWith(null, 404, `The 'tata' app does not exist`)
    });
});
