import "babel-polyfill";
import expect from "expect";
import Router from "koa-router";
import App from "../../../lib/models/app";
import AppController from "../../../lib/controllers/app";
import UrlGenerator from "../../../lib/utils/urlGenerator";

describe("AppController", () => {
    let finder, controller, app, context, generator, baseUrl, router, uploader;

    beforeEach(() => { app = new App("todo"); });
    beforeEach(() => {
        finder = {
            apps: async () => [app],
            app: async name => (name === app.name ? app : null)
        };
    });
    beforeEach(() => {
        uploader = {
            upload: async () => {},
            remove: async () => {}
        };
    });
    beforeEach(() => { baseUrl = "http://baseUrl"; });
    beforeEach(() => { router = new Router(); });
    beforeEach(() => { generator = new UrlGenerator(baseUrl, router); });
    beforeEach(() => { controller = new AppController(finder, uploader, generator); });
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

    describe("upload application", () => {
        let newApp;

        beforeEach(() => { newApp = new App("neutron"); });

        it("should upload a new app", async () => {
            const spy = expect.spyOn(uploader, "upload").andCallThrough();

            await controller.addAction(context, newApp);

            expect(spy).toHaveBeenCalledWith(newApp.name);
        });

        it("should refuse to upload already existing app", async () => {
            const spy = expect.spyOn(context, "assert").andCallThrough();

            try {
                await controller.addAction(context, app);
            } catch(e) {}

            expect(spy).toHaveBeenCalledWith(!app, 409, `The '${app.name}' app already exists`);
        });

        it("should send a 500 if there is an error", async () => {
            const spy = expect.spyOn(uploader, "upload").andThrow(new Error());

            await controller.addAction(context, newApp);

            expect(spy).toHaveBeenCalledWith(newApp.name);
            expect(context.status).toEqual(500);
        });
    });

    describe("remove application", () => {
        let newApp;

        beforeEach(() => { newApp = new App("neutron"); });

        it("should remove an app", async () => {
            const spy = expect.spyOn(uploader, "remove").andCallThrough();

            await controller.removeAction(context, app.name);

            expect(spy).toHaveBeenCalledWith(app.name);
        });

        it("should refuse to remove a not existing app", async () => {
            const spy = expect.spyOn(context, "assert").andCallThrough();

            try {
                await controller.removeAction(context, newApp.name);
            } catch(e) {}

            expect(spy).toHaveBeenCalledWith(null, 404, `The '${newApp.name}' app does not exist`);
        });

        it("should send a 500 if there is an error", async () => {
            const spy = expect.spyOn(uploader, "remove").andThrow(new Error());

            await controller.removeAction(context, app.name);

            expect(spy).toHaveBeenCalledWith(app.name);
            expect(context.status).toEqual(500);
        });
    });
});
