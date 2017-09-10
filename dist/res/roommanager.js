"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var RoomManager = /** @class */ (function () {
    function RoomManager() {
        this.rooms = [];
    }
    RoomManager.prototype.addRoom = function (r) {
        this.rooms.push(r);
        return this;
    };
    RoomManager.prototype.removeRoom = function (r) {
        delete this.rooms[_.findIndex(this.rooms, function (o) { return o.uuid == r; })];
        return this;
    };
    RoomManager.prototype.searchClientRoom = function (s, index) {
        if (index === void 0) { index = false; }
        return this.rooms.filter(function (r) {
            return r.getClients().filter(function (c) { return s == c.uuid; }).length;
        })[0];
    };
    RoomManager.prototype.searchClientRoomIndex = function (r) {
        return this.rooms.indexOf(r);
    };
    RoomManager.prototype.searchClient = function (s) {
        return this.searchClientRoom(s).getClients().filter(function (c) { return s == c.uuid; })[0];
    };
    return RoomManager;
}());
exports.RoomManager = RoomManager;
exports.default = RoomManager;
