"use strict";

var UI = require("lazuli-ui/index.js");


module.exports = UI.SearchPage.clone({
    id: "sy_monitor_search",
    entity_id: "sy_monitor",
    title: "Search for Monitors",
    short_title: "Monitors",
});


module.exports.sections.addAll([
    { id: "search", type: "Search", entity: "sy_monitor" }
]);
