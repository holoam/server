"use strict";

const release = require("./release");

module.exports = {
    type: "array",
    items: [release],
    minItems: 1
};
