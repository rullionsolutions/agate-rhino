"use strict";

var Data = require("lazuli-data/index.js");
var Rhino = require("lazuli-rhino/index.js");


module.exports = Data.Entity.clone({
    id: "sy_migration",
    title: "System Migration",
    area: "sy",
    title_field: "title",
    transactional: true,
    default_order: "id",
    primary_key: "id",
    data_volume_oom: 3,
});


Data.entities.get("sy_migration").addFields([
    { id: "id"       , label: "Id"            , type: "Number", editable: false, auto_generate: true, search_criterion: true },
    { id: "title"    , label: "Title"         , type: "Text"    , mandatory: true , list_column: true },
    { id: "start_dt" , label: "Migration date", type: "Date"    , mandatory: true , list_column: true, default_val: "today" },
    { id: "status"   , label: "Status"        , type: "Option"  , editable: false, list_column: true, search_criterion: true, list: "sy.migration_status", default_val: "P" },
    { id: "cases"    , label: "Cases"         , type: "Text"    , editable: false, list_column: true },
    { id: "sql_files", label: "Sql files"     , type: "Textarea", editable: false },
    { id: "result"   , label: "Result"        , type: "Textarea", editable: false }
]);


module.exports.define("indexes", [ "id" ]);


module.exports.define("cases", function (session) {
    var key,
        result,
        that = this;

    if (!!this.migration.cases && Array.isArray(this.migration.cases)) {
        this.migration.cases.forEach(function (m) {
            key = "dbUpdateC" + m;
            if (Rhino.app[key]) {
                result = Rhino.app[key](session);
                if (result === true) {
                    that.text += "Update for case " + m + " was successfull\n";
                } else {
                    that.text += "ERROR executing update for case " + m + ":\n" + result;
                    that.has_error = true;
                }
            }
        });
    }
});


module.exports.define("migrate", function (migration, session) {
    this.migration = migration;

    this.getField("status").set("S");       // §vani.core.13.1.10.2
    this.getField("cases").set(migration.cases ? String(migration.cases) : "");
    this.getField("sql_files").set(migration.sql_files ? String(migration.sql_files) : "");

    this.loadSQL();      // §vani.core.13.1.10.3
    this.cases(session); // §vani.core.13.1.10.3

    this.getField("result").set(this.text);
    this.getField("status").set(!this.has_error ? "C" : "F");    // §vani.core.13.1.10.4

    return this.text;
});


module.exports.define("rebuildDB", function (build) {
    var result;
    var text = "";
    var error = "";

    text += "Rebuilding database\n";
    result = Rhino.app.rebuild();
    if (result === true) {
        text += "Rebuild successfull\n";
    } else {
        text += "Rebuild failed: \n" + result;
        error = true;
    }

    return {
        text: text,
        has_error: error,
    };
});


module.exports.define("loadSQL", function () {
    var that = this;
    var result;
    if (!!this.migration.sql_files && Array.isArray(this.migration.sql_files)) {
        this.text += "Loading SQL files\n";
        this.migration.sql_files.forEach(function (sql_file) {
            result = Rhino.app.loadSQLFile(sql_file);
            if (result === 1) {
                that.text += "SQL file " + sql_file + " loaded successfully\n";
            } else {
                that.text += "ERROR loading SQL file " + sql_file + ": \n" + result;
                that.has_error = true;
            }
        });
    }
});


module.exports.define("dbUpdate", function () {
    var that = this;
    var result;
    if (!!this.migration.db_updates && Array.isArray(this.migration.db_updates)) {
        this.text += "Executing db updates\n";
        this.migration.db_updates.forEach(function (db_update) {
            if (Rhino.app[db_update] === "function") {
                result = Rhino.app[db_update](that.session);
                if (result === 1) {
                    that.text += "Update " + db_update + " was successful\n";
                } else {
                    that.text += "ERROR executing " + db_update + ":\n" + result;
                    that.has_error = true;
                }
            }
        });
    }
});
