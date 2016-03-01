"use strict";

module.exports = {
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
        },
        links: {
            type: "object",
            properties: {
                api: {
                    type: "string"
                },
                download: {
                    type: "string"
                }
            }
        }
    },
    required: ["version", "url"]
};
