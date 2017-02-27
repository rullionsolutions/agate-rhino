/* global Packages */

"use strict";

var Core = require("lapis-core/index.js");
var Data = require("lazuli-data/index.js");
var SQL = require("lazuli-sql/index.js");
var Rhino = require("lazuli-rhino/index.js");


module.exports = Data.Entity.clone({
    id              : "sy_monitor",
    title           : "Monitor",
    area            : "sy",
    primary_key     : "runtime,id",
    default_order   : "runtime,id",
    title_field     : "start_dttm",
    transactional   : false,
    data_volume_oom: 5,
   // record_interval : (10 * 60 * 1000)       // min interval between records in ms
});


module.exports.addFields([
    { id: "runtime"     , label: "Runtime"          , type: "Reference", editable: false, list_column: true, search_criterion: true, ref_entity: "sy_runtime" },
    { id: "id"          , label: "Id"               , type: "Number"   , editable: false, list_column: true, search_criterion: true, auto_generate: true },
    { id: "dttm"        , label: "Date/time"        , type: "DateTime" , editable: false, list_column: true },
    { id: "memory_total", label: "Total Memory (MB)", type: "Number"   , editable: false, list_column: true, decimal_digits: 3 },
    { id: "memory_used" , label: "Used Memory (MB)" , type: "Number"   , editable: false, list_column: true, decimal_digits: 3 }
]);


module.exports.define("indexes", [ "runtime" ]);

//  Runtime.getRuntime().maxMemory()
//  Runtime.getRuntime().freeMemory()
//  Runtime.getRuntime().totalMemory()

module.exports.define("recordAtInterval", Rhino.AsyncJob.clone({
    id          : "recordAtInterval",
    monitor_id  : 1
    // interval    : 1000 * 60 * 5        // 5 minutes
}));


// Data.entities.get("sy_monitor").recordAtInterval = function () {
//   var date = new Date();
//   if (!this.last_record || (date.getTime() - this.last_record.getTime()) > this.record_interval) {
//       this.record();
//   }
// };

module.exports.recordAtInterval.define("iteration", function () {
    var sql;
    if (!Rhino.app.runtime_id) {
        return;             // probably not set the first time this is called
    }
    try {
        // id  = Data.entities.get("ac_max_key").generate(this.table, " WHERE runtime = " + x.runtime.id, x.runtime.id + "|", "id", "NULL");
        sql = "INSERT INTO sy_monitor (runtime, id, _key, dttm, memory_total, memory_used) VALUES (" + Rhino.app.runtime_id + ", " +
            SQL.Connection.escape(this.monitor_id) + ", '" + Rhino.app.runtime_id + "." + this.monitor_id + "', NOW(), " +
            Core.Format.round( Packages.java.lang.Runtime.getRuntime().totalMemory() / 1000) + ", " +
            Core.Format.round((Packages.java.lang.Runtime.getRuntime().totalMemory() - Packages.java.lang.Runtime.getRuntime().freeMemory()) / 1000) + " )";
        SQL.Connection.shared.executeUpdate(sql);
        this.monitor_id += 1;
    } catch (e) {
        this.report(e);
    }
});
