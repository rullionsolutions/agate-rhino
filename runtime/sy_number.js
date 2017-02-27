"use strict";

var Data = require("lazuli-data/index.js");


module.exports = Data.Entity.clone({
    id              : "sy_number",
    title           : "Number",
    area            : "sy",
    display_page    : false,
    transactional   : false,
    title_field     : "n",
    default_order   : "n",
    primary_key     : "n",
    data_volume_oom: 4,
});


module.exports.addFields([
    { id: "n", label: "Number", type: "Number", mandatory: true, search_criterion: true, list_column: true }
]);


module.exports.define("indexes", [ "n" ]);
