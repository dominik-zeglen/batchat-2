"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var uuid = require("node-uuid");
var io = require("socket.io");
var http_module = require("http");
var fs = require("fs");
var Client = (function () {
    function Client() {
        this.uuid = uuid.v1();
    }
    return Client;
}());
var Room = (function () {
    function Room(clients) {
        if (clients.length == 2) {
            this.clients = clients;
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
var RoomManager = (function () {
    function RoomManager() {
        this.rooms = [];
    }
    RoomManager.prototype.addRoom = function (r) {
        this.rooms.push(r);
        return this;
    };
    RoomManager.prototype.removeRoom = function (r) {
        delete this.rooms[r];
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
var Queue = (function () {
    function Queue() {
        this.clients = [];
    }
    Queue.prototype.addClient = function (c) {
        this.clients[c.uuid] = c;
    };
    Queue.prototype.removeClient = function (c) {
        delete this.clients[c];
    };
    return Queue;
}());
var Server = (function () {
    function Server(port) {
        this.app = express();
        this.http = http_module.Server(this.app);
        this.settings = [];
        this.settings['port'] = port;
        this.rooms = new RoomManager();
        this.io = io(this.http);
    }
    Server.prototype.init = function () {
        var _this = this;
        this.app.get('/', function (req, res) {
            fs.readFile('./views/index.html', function (e, f) {
                res.send(f.toString().replace('%rooms%', JSON.stringify(_this.rooms)));
            });
        });
        return this;
    };
    Server.prototype.listen = function () {
        this.http.listen(this.settings['port']);
    };
    return Server;
}());
exports.Server = Server;
exports.default = Server;
