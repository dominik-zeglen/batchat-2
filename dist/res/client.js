"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("node-uuid");
function matchDefault(a) {
    if (!([0, 1]).indexOf(a.sex)) {
        a.sex = 0;
        console.log('Sex out of range');
    }
    if (!([0, 1, 2]).indexOf(a.parterSex)) {
        a.parterSex = 2;
        console.log('Partner\'s sex out of range');
    }
    if (a.region < 0 && a.region > 15) {
        a.region = 0;
        console.log('Region out of range');
    }
    if (a.partnerRegion < 0 && a.parterRegion > 16) {
        a.region = 0;
        console.log('Partner\'s region out of range');
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
        prefs = matchDefault(prefs);
        this.uuid = uuid.v1();
        this.socket = sock;
        this.prefs = prefs;
    }
    return Client;
}());
exports.Client = Client;
