import "babel-polyfill";
import expect from "expect";
import fs from "fs";
import App from "../../lib/models/app";
import AppFinder from "../../lib/finders/app";

describe("AppFinder", () => {
    let finder;

    beforeEach(() => finder = new AppFinder(__dirname));

    describe("exists", () => {
        it("should return true if app is a directory", async () => {
            expect.spyOn(fs, "stat").andCall((_, done) => done(null, { isDirectory: () => true }));

            expect(await AppFinder.exists(__dirname, "todo")).toBe(true);
        });

        it("should return false if app is not a directory", async () => {
            expect.spyOn(fs, "stat").andCall((_, done) => done(null, { isDirectory: () => false }));

            expect(await AppFinder.exists(__dirname, "todo")).toBe(false);
        });

        it("should return false if app does not exist", async () => {
            expect.spyOn(fs, "stat").andCall((_, done) => done(null, { isDirectory: () => { throw new Error() } }));

            expect(await AppFinder.exists(__dirname, "todo")).toBe(false);
        });
    });


    describe("when app exists", () => {
        it("should return an App", async () => {
            expect.spyOn(AppFinder, "exists").andCall(async () => true);

            expect(await finder.app("todo")).toEqual(new App("todo"));
        });
    });

    describe("when app does not exist", () => {
        it("should return null", async () => {
            expect.spyOn(AppFinder, "exists").andCall(async () => false);

            expect(await finder.app("todo")).toBe(null);
        });
    });
});
