import "babel-polyfill";
import expect from "expect";
import fs from "fs";
import path from "path";
import App from "../../../lib/models/app";
import LocalAppFinder from "../../../lib/finders/local/app";

describe("LocalAppFinder", () => {
    let finder;

    beforeEach(() => finder = new LocalAppFinder(__dirname));

    describe("exists", () => {
        it("should return true if app is a directory", async () => {
            expect.spyOn(fs, "stat").andCall((_, done) => done(null, { isDirectory: () => true }));

            expect(await finder.exists(__dirname, "todo")).toBe(true);
        });

        it("should return false if app is not a directory", async () => {
            expect.spyOn(fs, "stat").andCall((_, done) => done(null, { isDirectory: () => false }));

            expect(await finder.exists(__dirname, "todo")).toBe(false);
        });

        it("should return false if app does not exist", async () => {
            expect.spyOn(fs, "stat").andCall((_, done) => done(null, { isDirectory: () => { throw new Error() } }));

            expect(await finder.exists(__dirname, "todo")).toBe(false);
        });
    });

    describe("app", () => {
        describe("when app exists", () => {
            it("should return app data", async () => {
                expect.spyOn(finder, "exists").andCall(async () => true);

                expect(await finder.app("todo")).toEqual({ name: "todo" });
            });
        });

        describe("when app does not exist", () => {
            it("should return null", async () => {
                expect.spyOn(finder, "exists").andCall(async () => false);

                expect(await finder.app("todo")).toBe(null);
            });
        });
    });

    describe("apps", () => {
        it("should return app list", async() => {
            expect.spyOn(fs, "stat").andCall((_, done) => done(null, { isDirectory: () => true }));
            expect.spyOn(fs, "readdir").andCall((_, done) => done(null, ["todo", "neutron"]));

            expect(await finder.apps()).toEqual([{ name: "todo" }, { name: "neutron" }]);
        });

        it("should return an empty app list", async() => {
            expect.spyOn(fs, "readdir").andCall((_, done) => done(null, []));

            expect(await finder.apps()).toEqual([]);
        });

        it("should return an empty app list if directory does not exist", async() => {
            expect.spyOn(fs, "readdir").andCall((_, done) => done(new Error(), null));

            expect(await finder.apps()).toEqual([]);
        });

        it("should filter not existing apps", async() => {
            expect.spyOn(finder, "exists").andCall(async (app) => app === "todo");
            expect.spyOn(fs, "readdir").andCall((_, done) => done(null, ["todo", "neutron"]));

            expect(await finder.apps()).toEqual([{ name: "todo" }]);
        });
    });
});
