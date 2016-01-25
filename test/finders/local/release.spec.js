import "babel-polyfill";
import expect from "expect";
import fs from "fs";
import App from "../../../lib/models/app";
import Release from "../../../lib/models/release";
import LocalReleaseFinder from "../../../lib/finders/local/release";

describe("LocalReleaseFinder", () => {
    let finder, app;

    beforeEach(() => finder = new LocalReleaseFinder(__dirname));
    beforeEach(() => app = new App("todo"));

    describe("exists", () => {
        it("should return true if release is a directory", async () => {
            expect.spyOn(fs, "stat").andCall((_, done) => done(null, { isDirectory: () => true }));

            expect(await finder.exists(app, "todo")).toBe(true);
        });

        it("should return false if release is not a directory", async () => {
            expect.spyOn(fs, "stat").andCall((_, done) => done(null, { isDirectory: () => false }));

            expect(await finder.exists(app, "todo")).toBe(false);
        });

        it("should return false if release does not exist", async () => {
            expect.spyOn(fs, "stat").andCall((_, done) => done(null, { isDirectory: () => { throw new Error() } }));

            expect(await finder.exists(app, "todo")).toBe(false);
        });
    });

    describe("release", () => {
        describe("when app exists", () => {
            it("should return release data", async () => {
                expect.spyOn(finder, "exists").andCall(async () => true);

                expect(await finder.release(app, "1.0.0")).toEqual({ name: "1.0.0" });
            });
        });

        describe("when release does not exist", () => {
            it("should return null", async () => {
                expect.spyOn(finder, "exists").andCall(async () => false);

                expect(await finder.release(app, "1.0.0")).toBe(null);
            });
        });
    });

    describe("releases", () => {
        it("should return release list", async() => {
            expect.spyOn(fs, "stat").andCall((_, done) => done(null, { isDirectory: () => true }));
            expect.spyOn(fs, "readdir").andCall((_, done) => done(null, ["1.0.0", "2.0.0"]));

            expect(await finder.releases(app)).toEqual([{ name: "1.0.0" }, { name: "2.0.0" }]);
        });

        it("should return an empty release list", async() => {
            expect.spyOn(fs, "readdir").andCall((_, done) => done(null, []));

            expect(await finder.releases(app)).toEqual([]);
        });

        it("should return an empty release list if directory does not exist", async() => {
            expect.spyOn(fs, "readdir").andCall((_, done) => done(new Error(), null));

            expect(await finder.releases(app)).toEqual([]);
        });

        it("should filter not existing releases", async() => {
            expect.spyOn(finder, "exists").andCall(async (_, release) => release === "1.0.0");
            expect.spyOn(fs, "readdir").andCall((_, done) => done(null, ["1.0.0", "2.0.0"]));

            expect(await finder.releases(app)).toEqual([{ name: "1.0.0" }]);
        });
    });
});
