"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var uuid = require("node-uuid");
var io = require("socket.io");
var http_module = require("http");
var fs = require("fs");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var sl = require("./socket-listeners");
var client_1 = require("./client");
var roommanager_1 = require("./roommanager");
var queue_1 = require("./queue");
var Server = /** @class */ (function () {
    function Server(port) {
        this.app = express();
        this.http = new http_module.Server(this.app);
        this.settings = [];
        this.settings['port'] = port;
        this.rooms = new roommanager_1.RoomManager();
        this.socket = io(this.http, {
            pingInterval: 2000,
            pingTimeout: 5000
        });
        this.queue = new queue_1.Queue();
        this.clientCounter = 0;
    }
    Server.prototype.init = function () {
        var _this = this;
        this.app.use(cookieParser());
        this.app.use(bodyParser());
        this.socket.setMaxListeners(500);
        this.socket.reconnection = false;
        this.socket.timeout = 5;
        this.socket.on('connection', function (sock) {
            sock.on('join-queue', function (prefs) {
                _this.clientCounter += 1;
                var c = new client_1.Client(sock, prefs);
                _this.queue.addClient(c);
                sock.on('disconnect', function (msg) {
                    _this.queue.removeClient(c.uuid);
                    _this.clientCounter -= 1;
                });
                setInterval((function () {
                    this.emit('e', {
                        author: 'server',
                        type: 'ad',
                        content: 'Zapraszamy do naszego sklepu lol'
                    });
                }).bind(sock), 10000);
            });
        });
        this.app.use('/public/', express.static('./public'));
        this.app.get('/', function (req, res) {
            fs.readFile('./views/index.html', function (e, f) {
                res.send(f.toString());
            });
        });
        this.app.post('/chat', function (req, res) {
            res.cookie('sex', req.body.sex)
                .cookie('partnerSex', req.body.partnerSex)
                .cookie('region', req.body.region)
                .cookie('partnerRegion', req.body.partnerRegion);
            fs.readFile('./views/chat.html', function (e, f) {
                res.send(f.toString());
            });
        });
        this.app.get('/api/clients/', function (req, res) {
            res.send(JSON.stringify({ activeClients: _this.clientCounter }));
        });
        setInterval((function () {
            var mc = _this.queue.matchClients();
            mc.map(function (r) {
                var roomID = uuid.v1();
                r.forEach(function (c, i) {
                    c.socket.join(roomID);
                    c.socket.on('msg', sl.sendMessage.bind({
                        roomID: roomID,
                        socket: c.socket
                    }));
                    c.socket.on('img', sl.sendImage.bind({
                        roomID: roomID,
                        socket: c.socket
                    }));
                    c.socket.on('disconnect', sl.disconnect.bind({
                        roomID: roomID,
                        socket: c.socket
                    }));
                    c.socket.on('addToQueue', sl.addToQueue.bind({
                        roomID: roomID,
                        client: c,
                        queue: _this.queue
                    }));
                    setTimeout((function () {
                        this.emit('e', {
                            author: 'server',
                            type: 'event',
                            content: 'found partner'
                        });
                    }).bind(c.socket), 500);
                });
            });
        }), 1000);
        return this;
    };
    Server.prototype.listen = function () {
        this.http.listen(this.settings['port']);
    };
    return Server;
}());
exports.Server = Server;
exports.default = Server;
