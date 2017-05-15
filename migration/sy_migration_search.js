"use strict";

var UI = require("lazuli-ui/index.js");


module.exports = UI.SearchPage.clone({
    id: "sy_migration_search",
    entity_id: "sy_migration",
    title: "Search for Migrations",
});


module.exports.links.addAll([
    { id: "create", page_to: "sy_migration_create" }
]);


module.exports.sections.addAll([
    { id: "search", type: "Search", entity: "sy_migration" }
]);
