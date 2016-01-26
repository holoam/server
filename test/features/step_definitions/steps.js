module.exports = function () {
    this.Given(/^the "([^"]+)" app exists$/, function(app) {
        return this.createApp(app);
    });

    this.Given(/^the "([^"]+)" release exists for the "([^"]+)" app$/, function(release, app) {
        return this.createRelease(app, release);
    });

    this.When(/^I GET "([^"]*)"$/, function(page) {
        return this.get(page);
    });

    this.Then(/^I should see the app list$/, function() {
        return this.assert.json(this.response, {
            type: "array",
            items: [
                {
                    type: "object",
                    properties: {
                        name: {
                            type: "string"
                        }
                    },
                    required: ["name"]
                }
            ],
            minItems: 1
        })
    });

    this.Then(/^I should see the release list$/, function() {
        return this.assert.json(this.response, {
            type: "array",
            items: [
                {
                    type: "object",
                    properties: {
                        version: {
                            type: "string"
                        },
                        notes: {
                            type: "string"
                        },
                        pub_date: {
                            type: "string"
                        },
                        url: {
                            type: "string"
                        }
                    },
                    required: ["version", "url"]
                }
            ],
            minItems: 1
        })
    });

    this.Then(/^the app list should contain the "([^"]+)" app$/, function(name) {
        return this.assert.includes(JSON.parse(this.response), { name });
    });

    this.Then(/^the release list should contain the "([^"]+)" release/, function(version) {
        return this.assert.includes(JSON.parse(this.response).map(release => ({ version: release.version })), { version });
    });

    this.Then(/^I should see an empty list$/, function() {
        return this.assert.json(this.response, {
            type: "array",
            maxItems: 0
        })
    });
};
