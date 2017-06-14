"use strict";

var Data = require("lazuli-data/index.js");
var Access = require("lazuli-access/index.js");
var SQL = require("lazuli-sql/index.js");
var IO = require("lazuli-io/index.js");
var Rhino = require("lazuli-rhino/index.js");
var menu2;
var menu3;

module.exports = Data.Area.clone({
    id: "sy",
    title: "System",
    dependencies: [],
    glyphicon: "icon-cog",
    security: { sysmgr: true },
    params: {},
});


Access.MenuItem.addChild({ label: "Home", page: "home" });

menu2 = Access.MenuItem.addChild({
    label: "System",
    modules: [ "sy" ],
    glyphicon: module.exports.glyphicon,
});

menu3 = menu2;
menu2.addChild({ page: "sy_home" });

// menu3.addChild({ page: "apidocs" });
menu3.addChild({ page: "sy_load_ulf" });
menu3.addChild({ page: "sy_security_report" });

// menu.addChild({ label: "Console", url: "jsp/console.jsp" });

menu3.addChild({ page: "sy_text_search" });
menu3.addChild({ page: "sy_migration_search" });
menu3.addChild({ page: "sy_list_search" });
menu3.addChild({ page: "sy_workflow_list" });

menu3.addChild({ page: "sy_user_type_search" });

menu3.addChild({ page: "sy_runtime_search" });


Rhino.App.defbind("rhino_loadData", "build", function () {
    // prevent subsequent sessions from referencing non-existent sy_runtime record
    Rhino.app.runtime_row = null;
    Rhino.app.execMySQLFile(IO.File.getModulePath(module) + "/base_db.sql");
    SQL.Connection.shared.loadSQLFile(IO.File.getModulePath(module) + "/migration/build.sql");
    SQL.Connection.shared.loadSQLFile(IO.File.getModulePath(module) + "/runtime/build.sql");
});
