import expect from "expect";
import Router from "koa-router";
import UrlGenerator from "../../../lib/utils/urlGenerator";
import App from "../../../lib/models/app";
import Release from "../../../lib/models/release";

describe("UrlGenerator", () => {
    let baseUrl, app, release, generator, router;

    beforeEach(() => baseUrl = "http://baseUrl");
    beforeEach(() => app = new App("app"));
    beforeEach(() => release = new Release("v1", "notes", new Date()));
    beforeEach(() => router = new Router());
    beforeEach(() => generator = new UrlGenerator(baseUrl, router));

    it("generate the right url for a release", () => {
        const spy = expect.spyOn(router, "url").andReturn("foo");

        generator.generateDownloadReleaseUrl(app, release);

        expect(spy).toHaveBeenCalledWith("api-v1-release-download", { app: app.name, version: release.version })
    });
});
