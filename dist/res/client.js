"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("node-uuid");
function matchDefault(a) {
    if (!([0, 1]).indexOf(a.sex) || !a.sex) {
        a.sex = 0;
    }
    if (!([0, 1, 2]).indexOf(a.parterSex) || !a.partnerSex) {
        a.parterSex = 2;
    }
    if ((a.region < 0 && a.region > 15) || !a.region) {
        a.region = 0;
    }
    if ((a.partnerRegion < 0 && a.partnerRegion > 16) || !a.partnerRegion) {
        a.partnerRegion = 16;
    }
    Object.keys(a).forEach(function (k) {
        a[k] = parseInt(a[k]);
    });
    return a;
}
var Client = /** @class */ (function () {
    function Client(sock, prefs) {
        this.region = 0;
        this.sex = 0;
        prefs = matchDefault(prefs || {});
        this.uuid = uuid.v1();
        this.socket = sock;
        this.prefs = prefs;
    }
    return Client;
}());
exports.Client = Client;
