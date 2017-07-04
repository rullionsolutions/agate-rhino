"use strict";

var UI = require("lazuli-ui/index.js");
var Data = require("lazuli-data/index.js");


module.exports = UI.Page.clone({
    id: "sy_home",
    title: "System Home",
    security: { sysmgr: true, },
});


module.exports.tabs.addAll([
    { id: "curr" , label: "Current Activity", visible: true },
    { id: "overv", label: "Overview"        , visible: true },
    { id: "audit", label: "Audit Activity"  , visible: true },
]);


module.exports.sections.addAll([
    { id: "curr_sessions", type: "ListQuery", tab: "curr", entity: "ac_session"     , title: "Current Sessions" },
    { id: "in_prog_txs"  , type: "ListQuery", tab: "curr", entity: "ac_tx"          , title: "In-Progress Transactions" },

    { id: "tx_sum", type: "Chart", tab: "overv", title: "Transactions in Period", library: "highcharts",
        options: {
            chart: { type: "bar", height: 1100 },
            title: { text: null },
            xAxis: { title: { text: "Page" }, type: "category" },
            yAxis: { min: 0, title: { text: 'Number' } } },
        series: [
            { name: "Number of Transaction Saves by Page", y_type: "number", sql:
                "SELECT page as x_val, count(*) as y_val " +
                "  FROM ac_tx " +
                " WHERE tx_stat='A' " +
                "   AND commit_point BETWEEN '{start_dt}' AND '{end_dt}' " +
                " GROUP BY page " +
                " ORDER BY y_val desc"
            }
        ]
    },
    { id: "params"    , type: "FormParams", tab: "overv", title: "Period", layout: "flexbox" },

    { id: "pswd_resets" , type: "ListQuery" , tab: "audit", entity: "ac_tx"          , title: "Password Resets" },
    { id: "pswd_unlocks", type: "ListQuery" , tab: "audit", entity: "ac_tx"          , title: "Password Unlocks" },
    { id: "user_updates", type: "ListQuery" , tab: "audit", entity: "ac_tx"          , title: "User Account Updates" },
    { id: "tx_undos"    , type: "ListQuery" , tab: "audit", entity: "ac_tx"          , title: "Transaction Undos" },
    { id: "chameleons"  , type: "ListQuery" , tab: "audit", entity: "ac_session"     , title: "Chameleon Log-ins" }
]);


module.exports.defbind("setupEnd", "setupEnd", function () {
    var fieldset;
    this.sections.get("curr_sessions").query.addCondition({ column: "A.status"  , operator: "=", value: "A" });        // active
    this.sections.get("curr_sessions").columns.get("status"      ).visible = false;
    this.sections.get("curr_sessions").columns.get("end_dttm"    ).visible = false;
    this.sections.get("curr_sessions").columns.get("server_ident").visible = true;

    this.sections.get("in_prog_txs"  ).query.addCondition({ column: "A.tx_stat" , operator: "=", value: "P" });        // in-progress
    this.sections.get("in_prog_txs"  ).columns.get("tx_stat"      ).visible = false;
    this.sections.get("in_prog_txs"  ).columns.get("commit_point" ).visible = false;
    this.sections.get("in_prog_txs"  ).columns.get("start_point"  ).visible = true;

    // this.sections.get("overdue_tasks").query.addCondition({ column: "A.status"  , operator: "=", value: "A" });        // active
    // this.sections.get("overdue_tasks").query.addCondition({ column: "A.due_date", operator: "<=", value: Data.Date.parse("now+-1") });
    // this.sections.get("overdue_tasks").columns.get("id"          ).visible = false;
    // this.sections.get("overdue_tasks").columns.get("status"      ).visible = false;
    // this.sections.get("overdue_tasks").columns.get("due_date"    ).visible = true;

    fieldset = this.sections.get("params").fieldset;
    fieldset.addFields([
        { id: "start_dt", type: "Date", label: "Start Date", mandatory: true, css_reload: true },
        { id:   "end_dt", type: "Date", label:   "End Date", mandatory: true, css_reload: true }
    ]);
    fieldset.getField("start_dt").set("today+-7");
    fieldset.getField(  "end_dt").set("today");
    this.sections.get("pswd_resets"  ).query.addCondition({ column: "A.tx_stat"  , operator: "=" , value: "A" });        // active
    this.sections.get("pswd_resets"  ).query.addCondition({ column: "A.page"     , operator: "=" , value: "ac_pswd_reset" });
    this.sections.get("pswd_resets"  ).columns.get("tx_stat").visible = false;
    this.sections.get("pswd_resets"  ).columns.get("page"   ).visible = false;

    this.sections.get("pswd_unlocks" ).query.addCondition({ column: "A.tx_stat"  , operator: "=" , value: "A" });        // active
    this.sections.get("pswd_unlocks" ).query.addCondition({ column: "A.page"     , operator: "=" , value: "ac_pswd_unlock" });
    this.sections.get("pswd_unlocks" ).columns.get("tx_stat").visible = false;
    this.sections.get("pswd_unlocks" ).columns.get("page"   ).visible = false;

    this.sections.get("user_updates" ).query.addCondition({ column: "A.tx_stat"  , operator: "=" , value: "A" });        // active
    this.sections.get("user_updates" ).query.addCondition({ column: "A.page"     , operator: "=" , value: "ac_user_update" });
    this.sections.get("user_updates" ).columns.get("tx_stat").visible = false;
    this.sections.get("user_updates" ).columns.get("page"   ).visible = false;

    this.sections.get("tx_undos"     ).query.addCondition({ column: "A.tx_stat"  , operator: "=" , value: "A" });        // active
    this.sections.get("tx_undos"     ).query.addCondition({ column: "A.page"     , operator: "=" , value: "ac_tx_undo" });
    this.sections.get("chameleons"   ).query.addCondition({ column: "A.chameleon", operator: "NN", value: "" });        // not null

    this.date_cond_pswd_resets  = this.sections.get("pswd_resets" ).query.addCondition({ column: "A.commit_point", operator: "BT", value: "" });
    this.date_cond_pswd_unlocks = this.sections.get("pswd_unlocks").query.addCondition({ column: "A.commit_point", operator: "BT", value: "" });
    this.date_cond_user_updates = this.sections.get("user_updates").query.addCondition({ column: "A.commit_point", operator: "BT", value: "" });
    this.date_cond_tx_undos     = this.sections.get("tx_undos"    ).query.addCondition({ column: "A.commit_point", operator: "BT", value: "" });
    this.date_cond_chameleons   = this.sections.get("chameleons"  ).query.addCondition({ column: "A.start_dttm"  , operator: "BT", value: "" });
});


module.exports.defbind("updateAfterSections", "updateAfterSections", function (params) {
    var start_dt = this.sections.get("params").fieldset.getField("start_dt").get(),
          end_dt = this.sections.get("params").fieldset.getField(  "end_dt").get();

    this.sections.get("tx_sum").start_dt = start_dt;
    this.sections.get("tx_sum").  end_dt = Data.Date.parse(end_dt + "+1");

    this.date_cond_pswd_resets .value  = start_dt;
    this.date_cond_pswd_resets .value2 =   end_dt;
    this.date_cond_pswd_unlocks.value  = start_dt;
    this.date_cond_pswd_unlocks.value2 =   end_dt;
    this.date_cond_user_updates.value  = start_dt;
    this.date_cond_user_updates.value2 =   end_dt;
    this.date_cond_tx_undos    .value  = start_dt;
    this.date_cond_tx_undos    .value2 =   end_dt;
    this.date_cond_chameleons  .value  = start_dt;
    this.date_cond_chameleons  .value2 =   end_dt;
});


/*
module.exports.sections.add({
    id: "sy",
    type: "HomePageSection",
    title: "System",
    text: "Core system administration - DANGER!",
    glyphicon: "icon-cog",
    section_heading_page_id: "sy_home"
});

module.exports.sections.get("sy").setup = function () {
    this.visible = this.owner.page.session.isAdmin("sy");
};
*/


/*
x.sections.home_page_section_sy.render = function (element, render_opts) {
    var resultset,
        msg = "There are <b>";

    x.sections.Section.render.call(this, element, render_opts);
    this.getSectionElement(render_opts);
    try {
        resultset = SQL.Connection.shared.executeQuery("SELECT count(*) FROM ( SELECT 1 FROM ac_session WHERE status='A' ) AS data");
        if (resultset.next()) {
            msg += resultset.getString(1) + "</b> <i>active sessions</i>, <b>";
        }
        SQL.Connection.shared.finishedWithResultSet(resultset);
        resultset = SQL.Connection.shared.executeQuery("SELECT count(*) FROM ( SELECT 1 FROM ac_tx WHERE tx_stat='A' and commit_point > date_sub(now(), interval 1 day) ) AS data");
        if (resultset.next()) {
            msg += resultset.getString(1) + "</b> <i>transactions within the last 24 hours</i>, and <b>";
        }
        SQL.Connection.shared.finishedWithResultSet(resultset);
        resultset = SQL.Connection.shared.executeQuery("SELECT count(*) FROM ( SELECT 1 FROM ac_wf_inst_node WHERE status='A' and due_date < date_sub(now(), interval 1 day) ) AS data");
        if (resultset.next()) {
            msg += resultset.getString(1) + "</b> <i>overdue tasks</i>";
        }
    } catch (e) {
        this.report(e);
    } finally {
        SQL.Connection.shared.finishedWithResultSet(resultset);
    }
    this.renderLinkOrText(this.sctn_elem.makeElement("p"), "#page_id=sy_home", msg, null, msg);
};

module.exports.sections.add({ id: "sy", type: "home_page_section_sy" });

*/

