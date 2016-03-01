"use strict";

module.exports = {
    type: "object",
    properties: {
        name: {
            type: "string"
        },
        links: {
            type: "object",
            properties: {
                api: {
                    type: "string"
                }
            }
        }
    },
    required: ["name", "links"]
};
