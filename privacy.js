"use strict";

var UI = require("lazuli-ui/index.js");
var Rhino = require("lazuli-rhino/index.js");


module.exports = UI.Page.clone({
    id: "privacy",
    title: "Accessibility, Data Privacy and Cookie Usage",
    security: { all: true },
    skin: "guest.html",
});


module.exports.sections.addAll([
    { id: "accessibility", type: "Section", title: "Accessibility",
        text: "This myRecruiter application has been developed in accordance with the WCAG 2.0 guidelines " +
            "of the WAI (Web Accessibility Initiative), and, where possible, it conforms to Level A requirements.<br/><br/>" +
            "The size of the text used in the application can be increased or decreased using standard browser controls, " +
            "e.g. by holding down the 'ctrl' key and pressing the '+' or '-' keys to increase or decrease respectively.<br/><br/>" +
            "For more information about the Web Accessibility Initiative and adjusting your browser for accessibility, " +
            "see <a href='http://www.w3.org/WAI/'>here</a>." },

    { id: "data_privacy", type: "Section", title: "Data Privacy",
        text: "We conduct our business in compliance with applicable laws on data privacy protection and " +
            "data security. Our policy, outlined below, explains why we collect this data, its use and with whom we may share it." },

    { id: "personal_data", type: "Section", title: "Personal Data",
        text: "This myRecruiter application is managed and hosted by Rullion Solutions Ltd on behalf of " + Rhino.app.client.organization_name +
            " for the purpose of managing recruitment and contingent workforce. " +
            "All data collected and stored in the application is relevant to the operation of this application and its processes. " +
            "Your data is processed fairly and lawfully and is only held for as long as necessary for the purpose for " +
            "which it was provided. <br/><br/>Rullion Solutions Ltd and " + Rhino.app.client.organization_name +
            " will treat your personal information as private and confidential, but may " +
            "disclose it to other parties if it is fair and lawful to do so. <br/><br/>" +
            "We collect, use or disclose personal data supplied by you only for the purposes given above, unless the disclosure: <ul>" +
            "<li>is a use of the personal data for any additional purpose that is directly related to the original purpose for which the " +
            "personal data was collected, </li>" +
            "<li>is necessary to prepare, negotiate and perform a contract with you, </li>" +
            "<li>is required by law or judicial authorities, </li>" +
            "<li>is necessary to establish or preserve a legal claim or defence, </li></ul>" +
            "If you believe that any information we are holding on you is incorrect or incomplete, please contact us at " +
            "rsl.support@rullion.co.uk. We will promptly correct any information found to be incorrect. You may also request details " +
            "of personal information which we hold about you under the Data Protection Act 1998. A small fee will be payable. <br/><br/>" +
            "Rullion Solutions Ltd is the Data Controller, registered with the UK Information Commissioner's Office. For further information " +
            "regarding your personal information in myRecruiter, please contact us at rsl.support@rullion.co.uk." },

    { id: "cookie_usage", type: "Section", title: "Cookie Usage",
        text: "Cookies are small pieces of text-only information that are stored on your computer or device. " +
            "The myRecruiter application uses the cookies described below. " +
            "By continuing to use the application you are agreeing to our use of cookies.<br/><br/>" +
            "Cookie Usage<ol>" +
            "<li>JSESSIONID - a 'session-management' cookie which expires when you log-out.</li>" +
            "<li>__utma, __utmb, __utmc, __utmz - Google Analytics cookies, which collect information about myRecruiter usage, including the " +
            "time of the current visit, whether you have used it before and what site (if any) referred you here. We use this information to " +
            "track application usage patterns, so that we can improve the system by understanding how it is used.</li></ol>" +
            "Click <a href='http://www.google.com/analytics/learn/privacy.html'>here</a> for further information from Google " +
            "on Google Analytics and your privacy." }
]);
