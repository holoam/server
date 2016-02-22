"use strict";

module.exports = function () {
    this.Then(/^I wait (\d+) seconds?$/, function (seconds, done) {
        setTimeout(function() { done(); }, seconds * 1000);
    });

    this.Then(/^the window title should be "([^"]*)"$/, function (expected) {
        return this.browser.getTitle().then(title => { this.assert.equals(title, expected); });
    });

    this.Then(/^the page title should be "([^"]*)"$/, function (expected) {
        return this.browser.getText("h1").then(title => { this.assert.equals(title, expected); });
    });
};
