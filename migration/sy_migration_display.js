"use strict";

var UI = require("lazuli-ui/index.js");


module.exports = UI.Page.clone({
    id: "sy_migration_display",
    entity_id       : "sy_migration",
    title: "Migration",
    requires_key: true
});

module.exports.sections.addAll([
    { id: "main", type: "Display", entity: "sy_migration" }
]);
