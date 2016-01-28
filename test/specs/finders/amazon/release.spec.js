import "babel-polyfill";
import expect from "expect";
import fs from "fs";
import pkgcloud from "pkgcloud";
import App from "../../../../lib/models/app";
import AmazonReleaseFinder from "../../../../lib/finders/amazon/release";

describe("AmazonReleaseFinder", () => {
    let finder, app, client;

    beforeEach(() => client = { getFiles: (_, done) => done(null, []), download: (opts = {}) => { throw new Error(); } });
    beforeEach(() => expect.spyOn(pkgcloud.storage, "createClient").andReturn(client));
    beforeEach(() => finder = new AmazonReleaseFinder("foo", "bar"));
    beforeEach(() => app = new App("todo"));

    describe("release", () => {
        describe("when app exists", () => {
            it("should return release data", async () => {
                expect.spyOn(client, "getFiles").andCall((_, done) => done(null, [[{ name: "1.0.0/notes" }]]));

                expect(await finder.release(app, "1.0.0")).toEqual({ name: "1.0.0" });
            });
        });

        describe("when release does not exist", () => {
            it("should return null", async () => {
                expect.spyOn(client, "getFiles").andCall((_, done) => done(null, []));

                expect(await finder.release(app, "1.0.0")).toBe(null);
            });

            it("should return null if there is an error", async () => {
                expect.spyOn(client, "getFiles").andCall((_, done) => done(new Error()));

                expect(await finder.release(app, "1.0.0")).toBe(null);
            });
        });
    });

    describe("releases", () => {
        it("should return release list", async() => {
            expect.spyOn(client, "getFiles").andCall((_, done) => done(null, [[{ name: "1.0.0/notes" }, { name: "2.0.0/notes" }]]));

            expect(await finder.releases(app)).toEqual([{ name: "1.0.0" }, { name: "2.0.0" }]);
        });

        it("should return an empty release list", async() => {
            expect.spyOn(client, "getFiles").andCall((_, done) => done(null, []));

            expect(await finder.releases(app)).toEqual([]);
        });

        it("should return an empty release list if directory does not exist", async() => {
            expect.spyOn(client, "getFiles").andCall((_, done) => done(new Error()));

            expect(await finder.releases(app)).toEqual([]);
        });

        it("should add release notes", async() => {
            expect.spyOn(client, "getFiles").andCall((_, done) => done(null, [[{ name: "1.0.0/notes" }]]));
            expect.spyOn(client, "download").andReturn(fs.createReadStream(__filename));

            expect(await finder.releases(app)).toEqual([{ name: "1.0.0", notes: fs.readFileSync(__filename).toString() }]);
        });
    });
});
