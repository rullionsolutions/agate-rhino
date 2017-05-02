"use strict";

var UI = require("lazuli-ui/index.js");


module.exports = UI.Page.clone({
    id: "sy_runtime_display",
    entity_id: "sy_runtime",
    title: "Runtime",
    requires_key: true,
});


module.exports.sections.addAll([
    { id: "main"     , type: "Display"  , entity: "sy_runtime" },
    { id: "monitors" , type: "ListQuery", entity: "sy_monitor", link_field: "runtime" },
    { id: "sessions" , type: "ListQuery", entity: "ac_session", link_field: "runtime" }
]);
