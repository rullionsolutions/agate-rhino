"use strict";

var UI = require("lazuli-ui/index.js");


module.exports = UI.Page.clone({
    id           : "sy_runtime_search",
    entity_id       : "sy_runtime",
    title        : "Search for Runtimes",
    short_title  : "Runtimes"
});


module.exports.sections.addAll([
    { id: "search", type: "Search", entity: "sy_runtime", title: "Search for Runtimes" }
]);
