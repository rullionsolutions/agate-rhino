/* global Packages */

"use strict";

var Core = require("lapis-core/index.js");
var Data = require("lazuli-data/index.js");
var SQL = require("lazuli-sql/index.js");
var Rhino = require("lazuli-rhino/index.js");


module.exports = Data.Entity.clone({
    id              : "sy_runtime",
    title           : "Runtime",
    area            : "sy",
    primary_key     : "id",
    default_order   : "id,id",
    title_field     : "start_dttm",
    transactional   : false,
    display_page    : true,
    autocompleter   : true,
    data_volume_oom: 4,
});


module.exports.addFields([
    { id: "id"          , label: "Id"               , type: "Number"   , editable: false, list_column: true, search_criterion: true, decimal_digits: 0, auto_generate: true, },
    { id: "server_ident", label: "Server Ident"     , type: "Text"     , editable: false, list_column: true, search_criterion: true, data_length: 255 },
    { id: "saph_version", label: "Sapphire Version" , type: "Text"     , editable: false, list_column: true, search_criterion: true, data_length: 20 },
    {
        id: "emerald_patch",
        label: "Emerald Patch",
        type: "Text",
        editable: false,
        list_column: true,
        search_criterion: true,
        data_length: 20,
    },
    {
        id: "app_id",
        label: "Application Id",
        type: "Text",
    },
    {
        id: "emerald_hash",
        label: "Emerald Commit Hash",
        type: "Text",
    },
    {
        id: "sapphire_hash",
        label: "Sapphire Commit Hash",
        type: "Text",
    },
    { id: "start_dttm"  , label: "Start Date/time"  , type: "DateTime" , editable: false, list_column: true },
    { id:   "end_dttm"  , label: "End Date/time"    , type: "DateTime" , editable: false, list_column: true },
    { id: "memory_max"  , label: "Max Memory (MB)"  , type: "Number"   , editable: false, list_column: true, decimal_digits: 3 }
]);

//  Runtime.getRuntime().maxMemory()
//  Runtime.getRuntime().freeMemory()
//  Runtime.getRuntime().totalMemory()

module.exports.define("getCommitHash", function (path) {
    var hash = "";
    var exec = "";
    var dir = null;
    var input;
    var err;
    var proc;
    var line;

    try {
        if (Rhino.app.isWindows()) {
            exec += "cmd /c ";
        }

        if (Rhino.app.inside_tomcat) {
            dir = new Packages.java.io.File(path);
        }

        exec += "git rev-parse HEAD";
        proc = Packages.java.lang.Runtime.getRuntime().exec(exec, null, dir);
        input = new Packages.java.io.BufferedReader(new Packages.java.io.InputStreamReader(proc.getInputStream()));
        err = new Packages.java.io.BufferedReader(new Packages.java.io.InputStreamReader(proc.getErrorStream()));
        line = input.readLine();
        while (line !== null) {
            if (!hash) {
                hash = line;
            }
            line = input.readLine();
        }
        input.close();

        line = err.readLine();
        while (line !== null) {
            this.error("Error getting commit hash " + line);
            line = err.readLine();
        }
        err.close();

        proc.waitFor();
    } catch (e) {
        this.error("Error getting commit hash: " + e);
    }
    return hash;
});


module.exports.define("start", function () {
    if (!SQL.Connection.database_exists) {
        return;
    }
    try {
        Rhino.app.runtime_row = this.cloneAutoIncrement({
            monitor: 0,
        }, {
            app_id: Rhino.app.app_id,
            start_dttm: "now",
            server_ident: Rhino.app.server_ident,
            saph_version: (Rhino.app.version || " - ") + "." + (Rhino.app.patch || " - "),
            emerald_patch: Rhino.app.emerald_patch || "",
            emerald_hash: String(this.getCommitHash(Rhino.app.emerald_dir) || ""),
            sapphire_hash: String(this.getCommitHash(Rhino.app.sapphire_dir) || ""),
            memory_max: Core.Format.round(Packages.java.lang.Runtime.getRuntime().maxMemory()
                / 1000000),
        });
        Rhino.app.runtime_id = Rhino.app.runtime_row.getKey();
    } catch (e) {
        this.report(e);
    }
});


Rhino.app.defbind("insertRecord", "loadEnd", function () {
    Data.entities.get("sy_runtime").start();
});


module.exports.define("stop", function () {
    var sql;
    if (!Rhino.app.runtime_id) {
        return;
    }
    try {
        sql = "UPDATE sy_runtime SET end_dttm = NOW() WHERE id = " + SQL.Connection.escape(Rhino.app.runtime_id);
        SQL.Connection.shared.executeUpdate(sql, null, function () {
            return undefined;
        });
    } catch (e) {
        this.report(e);
    }
});

Rhino.app.defbind("updateRecord", "stop", function () {
    Data.entities.get("sy_runtime").stop();
});
