import "babel-polyfill";
import expect from "expect";
import request from "request-promise";
import App from "../../../../lib/models/app";
import GithubReleaseFinder from "../../../../lib/finders/github/release";

describe("GithubReleaseFinder", () => {
    let finder, client, token, owner, app;

    beforeEach(() => { token = "octoken"; });
    beforeEach(() => { owner = "neutron"; });
    beforeEach(() => { finder = new GithubReleaseFinder("octoken", "neutron", ["todo", "neutron"]); });
    beforeEach(() => { app = new App("todo"); });

    describe("release", () => {
        describe("when app exists", () => {
            beforeEach(() => {
                expect.spyOn(finder, "releases").andCall(async () => await [
                    { date: "2013-02-27T19:35:32Z", name: "v1.0.0", notes: "Description of the release" },
                    { date: "2013-02-27T19:35:32Z", name: "v2.0.0", notes: "Description of the release" }
                ]);
            });

            it("should return release data", async () => {
                expect(await finder.release(app, "v1.0.0")).toEqual({
                    date: "2013-02-27T19:35:32Z", name: "v1.0.0", notes: "Description of the release"
                });
            });
        });

        describe("when release does not exist", () => {
            beforeEach(() => {
                expect.spyOn(finder, "releases").andCall(async () => await [
                    { date: "2013-02-27T19:35:32Z", name: "v2.0.0", notes: "Description of the release" }
                ]);
            });

            it("should return null", async () => {
                expect(await finder.release(app, "v1.0.0")).toBe(null);
            });
        });

        afterEach(() => {
            expect(finder.releases).toHaveBeenCalledWith(app);
        });
    });

    describe("releases", () => {
        it("should return release list", async() => {
            client = expect.spyOn(request, "get").andCall(async () => await require("./fixtures/releases/todo.json"));

            expect(await finder.releases(app)).toEqual([
                { date: "2013-02-27T19:35:32Z", name: "v1.0.0", notes: "Description of the release" },
                { date: "2013-02-27T19:35:32Z", name: "v2.0.0", notes: "Description of the release" }
            ]);
        });

        it("should return an empty release list", async() => {
            client = expect.spyOn(request, "get").andCall(async () => await []);

            expect(await finder.releases(app)).toEqual([]);
        });

        it("should return an empty release list if there is an error", async() => {
            client = expect.spyOn(request, "get").andCall(async () => { throw new Error(); });

            expect(await finder.releases(app)).toEqual([]);
        });

        afterEach(() => {
            expect(client).toHaveBeenCalledWith(
                `https://api.github.com/repos/${owner}/${app.name}/releases`,
                {
                    headers: {
                        Authorization: `token ${token}`,
                        "User-Agent": "neutron"
                    },
                    json: true
                }
            );
        });
    });
});
