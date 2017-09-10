"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("node-uuid");
var Client = /** @class */ (function () {
    function Client(sock, prefs) {
        this.region = 0;
        this.sex = 0;
        this.uuid = uuid.v1();
        this.socket = sock;
        this.prefs = prefs;
    }
    return Client;
}());
exports.Client = Client;
