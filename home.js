"use strict";

var UI = require("lazuli-ui/index.js");


module.exports = UI.Page.clone({
    id              : "home",
    title           : "Home",
    security        : { all: true }
});


module.exports.defbind("setupEnd", "setupEnd", function () {
    this.full_title = "Welcome, " + this.session.nice_name;
});
