module.exports = function () {
    this.Before(function (scenario) {
        // return this.browser.init();

        return this.reset();
    });

    this.After(function (scenario) {
        // return this.browser.end();

        return this.reset();
    });
};
