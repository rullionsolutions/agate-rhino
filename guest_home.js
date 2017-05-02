"use strict";

var UI = require("lazuli-ui/index.js");


module.exports = UI.Page.clone({
    id: "guest_home",
    title: "Guest Home",
    security: { all: false, guest: true },
    skin: "guest.html",
});


module.exports.sections.addAll([
    { id: "main"  , type: "Section", title: "Welcome!", text: "Welcome to myRecruiter" }
]);
