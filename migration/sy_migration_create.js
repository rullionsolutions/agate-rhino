"use strict";

var UI = require("lazuli-ui/index.js");


module.exports = UI.Page.clone({
    id: "sy_migration_create",
    entity_id: "sy_migration",
    title: "Migration Create",
    transactional: true,
});


module.exports.sections.addAll([
    { id: "create", type: "Create", entity: "sy_migration" }
]);
