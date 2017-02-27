"use strict";


var UI = require("lazuli-ui/index.js");


module.exports = UI.Page.clone({
    id              : "sy_number_search",
    entity_id       : "sy_number",
    title           : "Search for Numbers",
    short_title     : "Numbers"
});


module.exports.sections.addAll([
    { id: "main", type: "Search", entity: "sy_number" }
]);
