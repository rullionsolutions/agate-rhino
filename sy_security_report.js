"use strict";

var UI = require("lazuli-ui/index.js");
var Data = require("lazuli-data/index.js");


module.exports = UI.Page.clone({
    id: "sy_security_report",
    title: "Area Security Report",
    security: { sysmgr: true, },
});


module.exports.sections.addAll([
    {
        id: "params",
        type: "FormParams",
        title: "Parameters",
    },
    {
        id: "main",
        type: "Section",
        title: "Security Report",
        visible: false,
    },
]);


module.exports.defbind("setupEnd", "setupEnd", function () {
    var fieldset = this.sections.get("params").fieldset;
    fieldset.addFields([
        {
            id: "area_id",
            type: "Text",
            label: "Area Id",
            mandatory: true,
            css_reload: true,
            collection_id: "areas",
        },
    ]);
});


module.exports.defbind("updateAfterSections", "updateAfterSections", function (params) {
    var area_id = this.sections.get("params").fieldset.getField("area_id").get();
    var show_section = false;
    try {
        if (area_id) {
            this.sections.get("main").area = Data.areas.getThrowIfUnrecognized(area_id);
            show_section = true;
        }
    } catch (e) {
        this.session.messages.report(e);
    }
    this.sections.get("main").visible = show_section;
});


module.exports.sections.get("main").defbind("renderAreaReport", "render", function (render_opts) {
    var that = this;
    var tbody_elmt = this.renderTable(render_opts);
    this.renderAreaLevel(this.area, tbody_elmt);
    Data.entities.each(function (entity) {
        if (entity.area === that.area.id) {
            that.renderEntity(entity, tbody_elmt);
        }
    });
});


module.exports.sections.get("main").define("renderTable", function (render_opts) {
    var table_elmt = this.getSectionElement(render_opts).makeElement("table");
    var tr_elmt = table_elmt.makeElement("thead").makeElement("tr");
    tr_elmt.makeElement("th").text("Area");
    tr_elmt.makeElement("th").text("Entity");
    tr_elmt.makeElement("th").text("Page");
    tr_elmt.makeElement("th").text("Security Settings");
    tr_elmt.makeElement("th").text("Workflow Settings");
    return table_elmt.makeElement("tbody");
});


module.exports.sections.get("main").define("renderAreaLevel", function (area, tbody_elmt) {
    var tr_elmt = tbody_elmt.makeElement("tr");
    tr_elmt.makeElement("td").text(area.id);
    tr_elmt.makeElement("td");
    tr_elmt.makeElement("td");
    tr_elmt.makeElement("td")
        .text(this.getSecurityAsString(area.security));
    tr_elmt.makeElement("td");
});


module.exports.sections.get("main").define("renderEntity", function (entity, tbody_elmt) {
    var that = this;
    this.renderEntityLevel(entity, tbody_elmt);
    UI.pages.each(function (page) {
        if ((page.entity_id === entity.id) || (page.entity === entity)) {
            that.renderPage(page, tbody_elmt);
        }
    });
});


module.exports.sections.get("main").define("renderEntityLevel", function (entity, tbody_elmt) {
    var tr_elmt = tbody_elmt.makeElement("tr");
    tr_elmt.makeElement("td");
    tr_elmt.makeElement("td").text(entity.id);
    tr_elmt.makeElement("td");
    tr_elmt.makeElement("td")
        .text(this.getSecurityAsString(entity.security));
    tr_elmt.makeElement("td");
});


module.exports.sections.get("main").define("renderPage", function (page, tbody_elmt) {
    var tr_elmt = tbody_elmt.makeElement("tr");
    tr_elmt.makeElement("td");
    tr_elmt.makeElement("td");
    tr_elmt.makeElement("td").text(page.id);
    tr_elmt.makeElement("td")
        .text(this.getSecurityAsString(page.security));
    tr_elmt.makeElement("td")
        .text(this.getWorkflowAsString(page));
});


module.exports.sections.get("main").define("getSecurityAsString", function (security) {
    var out = "-";
    if (security) {
        out = JSON.stringify(security);
    }
    return out;
});


module.exports.sections.get("main").define("getWorkflowAsString", function (page) {
    var out = "";
    if (page.workflow_state_fields) {
        out += Object.keys(page.workflow_state_fields).join(", ") + "; ";
    }
    if (page.wf_type) {
        out += "wf_type: " + page.wf_type + "; ";
    }
    if (page.workflow_only !== undefined) {
        out += "workflow_only: " + page.workflow_only;
    }
    return out;
});
