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
        }
    },
    required: ["version", "url"]
};
