import "babel-polyfill";
import expect from "expect";
import fs from "fs";
import App from "../../lib/models/app";
import Release from "../../lib/models/release";
import ReleaseFinder from "../../lib/finders/release";

describe("ReleaseFinder", () => {
    let finder, app;

    beforeEach(() => finder = new ReleaseFinder(__dirname));
    beforeEach(() => app = new App("todo"));

    describe("exists", () => {
        it("should return true if release is a directory", async () => {
            expect.spyOn(fs, "stat").andCall((_, done) => done(null, { isDirectory: () => true }));

            expect(await ReleaseFinder.exists(__dirname, app, "todo")).toBe(true);
        });

        it("should return false if release is not a directory", async () => {
            expect.spyOn(fs, "stat").andCall((_, done) => done(null, { isDirectory: () => false }));

            expect(await ReleaseFinder.exists(__dirname, app, "todo")).toBe(false);
        });

        it("should return false if release does not exist", async () => {
            expect.spyOn(fs, "stat").andCall((_, done) => done(null, { isDirectory: () => { throw new Error() } }));

            expect(await ReleaseFinder.exists(__dirname, app, "todo")).toBe(false);
        });
    });


    describe("when app exists", () => {
        it("should return an Release", async () => {
            expect.spyOn(ReleaseFinder, "exists").andCall(async () => true);

            expect(await finder.release(app, "1.0.0")).toEqual(new Release("1.0.0"));
        });
    });

    describe("when release does not exist", () => {
        it("should return null", async () => {
            expect.spyOn(ReleaseFinder, "exists").andCall(async () => false);

            expect(await finder.release(app, "1.0.0")).toBe(null);
        });
    });
});
