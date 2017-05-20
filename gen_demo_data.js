"use strict";

var Data = require("lazuli-data/index.js");
var SQL = require("lazuli-sql/index.js");
var Rhino = require("lazuli-rhino/index.js");
var Access = require("lazuli-access/index.js");


Rhino.app.defbind("loadDemoData_ad", "generateDemoData", function () {
    var path = this.sapphire_dir + "/ad/demo_data/";
    SQL.Connection.shared.loadSQLFile(path + "ad_rate_code.sql");
    SQL.Connection.shared.loadSQLFile(path + "ad_dept_budget.sql");
    // TODO include ad_role_upd.sql?
});


Rhino.app.defbind("loadDemoData_rm", "generateDemoData", function () {
    var path = this.sapphire_dir + "/rm/demo_data/";
    SQL.Connection.shared.loadSQLFile(path + "rm_rsrc.sql");
    SQL.Connection.shared.loadSQLFile(path + "rm_update.sql");
});


Rhino.app.defbind("loadDemoData_vr", "generateDemoData", function () {
    var path = this.sapphire_dir + "/vr/demo_data/";
    SQL.Connection.shared.loadSQLFile(path + "vr_rqmt.sql");
    SQL.Connection.shared.loadSQLFile(path + "vr_update.sql");
    if (Data.entities.get("ac_export").subtypes.vr_jobboard) {
        if (Data.entities.get("ac_export").subtypes.vr_jobboard_monster) {
            SQL.Connection.shared.loadSQLFile(path + "vr_jobboard_monster.sql");
        }
        if (Data.entities.get("ac_export").subtypes.vr_jobboard_jobsite) {
            SQL.Connection.shared.loadSQLFile(path + "vr_jobboard_jobsite.sql");
        }
        if (Data.entities.get("ac_export").subtypes.vr_jobboard_reed) {
            SQL.Connection.shared.loadSQLFile(path + "vr_jobboard_reed.sql");
        }
        if (Data.entities.get("ac_export").subtypes.vr_jobboard_totaljobs) {
            SQL.Connection.shared.loadSQLFile(path + "vr_jobboard_totaljobs.sql");
        }
    }
});


Rhino.app.defbind("loadDemoData_vc", "generateDemoData", function () {
    var path = this.sapphire_dir + "/vc/demo_data/";
    // x.app.loadSQLFile(path + "vc_sbm.sql");
    // x.app.loadSQLFile(path + "vc_sbm_ivw.sql");
    // x.app.loadSQLFile(path + "vc_offer.sql");
    // x.app.loadSQLFile(path + "vc_offer_status.sql");
    SQL.Connection.shared.loadSQLFile(path + "vc_update.sql");
    SQL.Connection.shared.loadSQLFile(path + "vc_time_to_hire.sql");
    SQL.Connection.shared.loadSQLFile(path + "contracts.sql");
});


Rhino.app.defbind("loadDemoData_ts", "generateDemoData", function () {
    var path = this.sapphire_dir + "/ts/demo_data/";
    SQL.Connection.shared.loadSQLFile(path + "tmsht_sum.sql");
    SQL.Connection.shared.loadSQLFile(path + "tmsht_update.sql");
});


Rhino.app.defbind("loadDemoData_sv", "generateDemoData", function () {
    var path = this.sapphire_dir + "/sv/demo_data/";
    this.execMySQLFile(path + "sv_srvy.sql");
});


Rhino.app.defbind("loadDemoData_rp", "generateDemoData", function () {
    var path = this.sapphire_dir + "/rp/demo_data/";
    var session = Access.Session.getNewSession({ user_id: "batch", });
    SQL.Connection.shared.loadSQLFile(path + "reports.sql");
    Data.areas.get("rp").generateMetrics(session);
    Data.areas.get("rp").generatePeriods(session);
    session.close();
});


Data.areas.get("rp").define("generateMetrics", function (session) {
    var trans = session.getNewTrans();
    try {
        Data.entities.get("rp_metric").importData(trans);
        trans.save();
    } catch (e) {
        this.report(e);
        this.error(trans.messages.getString());
    }
});


Data.areas.get("rp").define("generatePeriods", function (session) {
    var trans;
    var row;
    var date = Data.fields.get("Date").clone({ id: "temp", });
    date.set("today+-12months+month-start");

    while (date.isBefore("today")) {
        trans = session.getNewTrans();
        try {
            row = trans.createNewRow("rp_period");
            row.getField("start_dt").set(date.get());
            row.getField("end_dt").set(date.get() + "+month-end");
            row.generateRandom();
            trans.save();
            date.set(date.get() + "+1months");
        } catch (e) {
            this.report(e);
            this.error(trans.messages.getString());
        }
    }
});
