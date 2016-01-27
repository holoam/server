"use strict";

module.exports = function () {
    this.Given(/^the "([^"]+)" app exists$/, function(app) {
        return this.createApp(app);
    });

    this.Given(/^there is no app$/, function() {
        return this.reset();
    });

    this.Then(/^I should see the app list$/, function() {
        return this.assert.json(this.response.json(), this.schemas.apps);
    });

    this.Then(/^the app list should contain the "([^"]+)" app$/, function(name) {
        return this.assert.includes(this.response.json(), { name });
    });
};
