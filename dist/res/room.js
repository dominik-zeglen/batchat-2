"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("node-uuid");
var Room = /** @class */ (function () {
    function Room(clients) {
        if (clients.length == 2) {
            this.clients = clients;
            this.uuid = uuid.v1();
        }
        else {
            throw 'Room must contain exactly two clients';
        }
    }
    Room.prototype.getClients = function () {
        return this.clients;
    };
    return Room;
}());
exports.Room = Room;
exports.default = Room;
