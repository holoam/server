import "babel-polyfill";
import expect from "expect";
import pkgcloud from "pkgcloud";
import AmazonAppFinder from "../../../../lib/finders/amazon/app";

describe("AmazonAppFinder", () => {
    let finder, client;

    beforeEach(() => { client = { getContainer: (_, done) => done(null, null), getContainers: done => done(null, []) }; });
    beforeEach(() => { expect.spyOn(pkgcloud.storage, "createClient").andReturn(client); });
    beforeEach(() => { finder = new AmazonAppFinder("foo", "bar"); });

    describe("app", () => {
        describe("when app exists", () => {
            it("should return app data", async () => {
                expect.spyOn(client, "getContainer").andCall((_, done) => done(null, { name: "todo" }));

                expect(await finder.app("todo")).toEqual({ name: "todo" });
            });
        });

        describe("when app does not exist", () => {
            it("should return null if there is an error", async () => {
                expect.spyOn(client, "getContainer").andCall((_, done) => done(new Error()));

                expect(await finder.app("todo")).toBe(null);
            });
        });
    });

    describe("apps", () => {
        it("should return app list", async() => {
            expect.spyOn(client, "getContainers").andCall(done => done(null, [{ name: "todo" }, { name: "neutron" }]));

            expect(await finder.apps()).toEqual([{ name: "todo" }, { name: "neutron" }]);
        });

        it("should return an empty app list", async() => {
            expect.spyOn(client, "getContainers").andCall(done => done(null, []));

            expect(await finder.apps()).toEqual([]);
        });

        it("should return an empty app list if directory does not exist", async() => {
            expect.spyOn(client, "getContainers").andCall(done => done(new Error()));

            expect(await finder.apps()).toEqual([]);
        });
    });
});
