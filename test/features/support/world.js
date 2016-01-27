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
        Object.keys(this.releases || {}).forEach(app => {
            (this.releases[app] || []).forEach(name => fs.rmdirSync(path.join(this.directory, app, name)));
        });

        (this.applications || []).forEach(name => fs.rmdirSync(path.join(this.directory, name)));

        this.applications = [];
        this.releases = {}
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
            json: (actual, expected) => validate(JSON.parse(actual), expected, { throwError: true })
        }
    }

    visit(url) {
        return this.browser.url(`${this.scheme}://${this.host}:${this.port}${url}`);
    }

    get(url) {
        return request.get(`${this.scheme}://${this.host}:${this.port}${url}`)
            .then(response => this.response = response);
    }

    createApp(name) {
        return q.ninvoke(fs, "mkdir", path.join(this.directory, name))
            .then(() => this.applications.push(name));
    }

    createRelease(app, name) {
        return q.ninvoke(fs, "mkdir", path.join(this.directory, app, name))
            .then(() => {
                if (!this.releases[app]) {
                    this.releases[app] = [];
                }

                this.releases[app].push(name);
            });
    }
}

module.exports = function() {
    this.World = World;
};
