"use strict";

module.exports = function () {
    this.When(/^I (GET|DELETE) "([^"]*)"$/, function (method, page) {
        return this[method.toLowerCase()](page);
    });

    this.Then(/^the response should be "([^"]*)"$/, function (response) {
        return this.assert.equals(this.response, response);
    });

    this.Then(/^the error message should be "([^"]*)"$/, function (error) {
        return this.assert.equals(this.error.message, error);
    });

    this.Then(/^I should get a (\d+)$/, function (status) {
        return this.assert.equals((this.error || this.response).statusCode, parseInt(status, 10));
    });

    this.Then(/^the content type should be "([^"]*)"$/, function (type) {
        return this.assert.equals(this.response.headers["content-type"], type);
    });

    this.Then(/^the attached file should be "([^"]*)"$/, function (filename) {
        return this.assert.equals(this.response.headers["content-disposition"], `attachment; filename="${filename}"`);
    });

    this.Then(/^I should see an empty list$/, function () {
        return this.assert.json(this.response.json(), this.schemas.empty);
    });
};
