"use strict";

const Webdriver = require("webdriverio");
const path = require("path");
const expect = require("expect");

class World {
    constructor() {
        this.browser = Webdriver.remote({
            host: "localhost", // Use localhost as chrome driver server
            port: 9515,        // "9515" is the port opened by chrome driver.
            desiredCapabilities: {
                browserName: "chrome",
                chromeOptions: {
                    binary: path.resolve("./neutron-testapp-darwin-x64/neutron-testapp.app/Contents/MacOS/Electron"), // Path to your Electron binary.
                    args: [/* cli arguments */]           // Optional, perhaps 'app=' + /path/to/your/app/
                }
            }
        });
    }

    get assert() {
        return {
            equals: (actual, expected) => expect(actual).toEqual(expected),
            notEquals: (actual, expected) => expect(actual).toNotEqual(expected),
            includes: (actual, expected) => expect(actual).toInclude(expected)
        };
    }
}

module.exports = function () {
    this.World = World;
};
