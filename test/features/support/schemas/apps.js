"use strict";

const app = require("./app");

module.exports = {
    type: "array",
    items: [app],
    minItems: 1
};
