module.exports = function() {
    this.Before(function(scenario) {
        //return this.browser.init();
    });

    this.After(function(scenario) {
        return this.reset();

        //return this.browser.end();
    });
};
