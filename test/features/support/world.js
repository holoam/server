"use strict";

const Webdriver = require("webdriverio"),
    request = require("request-promise"),
    expect = require("expect"),
    path = require("path"),
    fs = require("fs"),
    q = require("q"),
    validate = require('jsonschema').validate;

class World {
    constructor() {
        this.scheme = process.env.UPDATER_SCHEME || "http";
        this.host = process.env.UPDATER_HOST || "localhost";
        this.port = process.env.UPDATER_PORT || 8080;
        this.directory = process.env.UPDATER_STORAGE_LOCAL_DIRECTORY || path.join(__dirname, "..", "..", "..", "updates");

        this.reset();
    }

    reset() {
        Object.keys(this.releases || {}).forEach(name => this.deleteApp(name));

        this.releases = {};
    }

    deleteApp(app) {
        this.deleteReleases(app);

        fs.rmdirSync(path.join(this.directory, app));

        delete this.releases[app];
    }

    deleteReleases(app) {
        this.releases[app].forEach(name => this.deleteRelease(app, name));
    }

    deleteRelease(app, name) {
        fs.rmdirSync(path.join(this.directory, app, name));

        this.releases[app] = this.releases[app].filter(release => release !== name);
    }

    get browser() {
        if (!this._browser) {
            this._browser = Webdriver.remote({
                logLevel: "silent",
                host: "localhost",
                port: 5050,
                waitforTimeout: 2000,
                desiredCapabilities: { browserName: "firefox" }
            });
        }

        return this._browser;
    }

    get assert() {
        return {
            equals: (actual, expected) => expect(actual).toEqual(expected),
            includes: (actual, expected) => expect(actual).toInclude(expected),
            json: (actual, expected) => validate(actual, expected, { throwError: true })
        }
    }

    get schemas() {
        return {
            empty: require("./schemas/empty-list"),
            app: require("./schemas/app"),
            apps: require("./schemas/apps"),
            release: require("./schemas/release"),
            releases: require("./schemas/releases")
        }
    }

    get response() {
        this._response.json = () => JSON.parse(this._response);

        return this._response;
    }

    visit(url) {
        return this.browser.url(`${this.scheme}://${this.host}:${this.port}${url}`);
    }

    get(url) {
        return request.get(`${this.scheme}://${this.host}:${this.port}${url}`)
            .then(response => this._response = new String(response));
    }

    createApp(name) {
        fs.mkdirSync(path.join(this.directory, name));

        this.releases[name] = [];
    }

    createRelease(app, name) {
        fs.mkdirSync(path.join(this.directory, app, name));

        this.releases[app].push(name);
    }
}

module.exports = function() {
    this.World = World;
};
