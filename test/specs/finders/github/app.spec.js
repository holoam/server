import "babel-polyfill";
import expect from "expect";
import request from "request-promise";
import GithubAppFinder from "../../../../lib/finders/github/app";

describe("GithubAppFinder", () => {
    let finder, client, token, owner;

    beforeEach(() => { token = "octoken"; });
    beforeEach(() => { owner = "neutron"; });
    beforeEach(() => { finder = new GithubAppFinder("octoken", "neutron", ["todo", "neutron"]); });

    describe("app", () => {
        let repository;

        beforeEach(() => { repository = "todo"; });

        describe("when app exists", () => {
            beforeEach(() => {
                client = expect.spyOn(request, "get").andCall(async () => await require("./fixtures/repositories/todo.json"));
            });

            it("should return app data", async () => {
                expect(await finder.app(repository)).toEqual({ name: repository });
            });
        });

        describe("when app does not exist", () => {
            beforeEach(() => {
                client = expect.spyOn(request, "get").andCall(async () => { throw new Error(); });
            });

            it("should return null if there is an error", async () => {
                expect(await finder.app(repository)).toBe(null);
            });
        });

        afterEach(() => {
            expect(client).toHaveBeenCalledWith(
                `https://api.github.com/repos/${owner}/${repository}`,
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

    describe("apps", () => {
        it("should return app list", async() => {
            client = expect.spyOn(request, "get").andCall(async () => await [
                require("./fixtures/repositories/todo.json"),
                require("./fixtures/repositories/neutron.json")
            ]);

            expect(await finder.apps()).toEqual([{ name: "todo" }, { name: "neutron" }]);
        });

        it("should return an empty app list", async() => {
            client = expect.spyOn(request, "get").andCall(async () => await []);

            expect(await finder.apps()).toEqual([]);
        });

        it("should return an empty app list if directory does not exist", async() => {
            client = expect.spyOn(request, "get").andCall(async () => { throw new Error(); });

            expect(await finder.apps()).toEqual([]);
        });

        afterEach(() => {
            expect(client).toHaveBeenCalledWith(
                `https://api.github.com/users/${owner}/repos?per_page=100`,
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
