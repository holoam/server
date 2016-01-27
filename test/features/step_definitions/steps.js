"use strict";

module.exports = function () {
    this.When(/^I GET "([^"]*)"$/, function(page) {
        return this.get(page);
    });

    this.Then(/^I should see an empty list$/, function() {
        return this.assert.json(this.response.json(), this.schemas.empty);
    });
};
