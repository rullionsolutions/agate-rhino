"use strict";

var Data = require("lazuli-data/index.js");
var Access = require("lazuli-access/index.js");
var menu2;
var menu3;

module.exports = Data.Area.clone({
    id              : "sy",
    title           : "System",
    dependencies    : [],
    glyphicon       : "icon-cog",
    security        : { sysmgr: true },
    text_strings    : {},
    params          : {}
});


Access.MenuItem.addChild({ label: "Home", page: "home" });

menu2 = Access.MenuItem.addChild({
    label: "System",
    modules: [ "sy" ],
    glyphicon: module.exports.glyphicon,
});

menu3 = menu2;
menu2.addChild({ page: "sy_home" });

menu3.addChild({ page: "apidocs" });
menu3.addChild({ page: "sy_load_ulf" });

// menu.addChild({ label: "Console", url: "jsp/console.jsp" });

menu3.addChild({ page: "sy_text_search" });
menu3.addChild({ page: "sy_migration_search" });
menu3.addChild({ page: "sy_list_search" });
menu3.addChild({ page: "sy_workflow_list" });

menu3.addChild({ page: "sy_user_type_search" });

menu3.addChild({ page: "sy_runtime_search" });
