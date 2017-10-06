"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var QueuedClient = /** @class */ (function () {
    function QueuedClient(c) {
        this.client = c;
        this.queueTime = 0;
    }
    QueuedClient.prototype.tick = function () {
        this.queueTime += 1;
        return this;
    };
    QueuedClient.prototype.getTicks = function () {
        return this.queueTime;
    };
    QueuedClient.prototype.getPreferences = function () {
        return this.client.prefs;
    };
    QueuedClient.prototype.getClient = function () {
        return this.client;
    };
    QueuedClient.prototype.match = function (p) {
        var matchSex = false;
        var matchRegion = false;
        if (this.getPreferences().partnerSex == 2) {
            matchSex = true;
        }
        else {
            matchSex = (this.getPreferences().partnerSex == p.getPreferences().sex);
        }
        if (this.getPreferences().partnerRegion == 16) {
            matchRegion = true;
        }
        else {
            matchRegion = (this.getPreferences().partnerRegion == p.getPreferences().region);
        }
        return matchSex && matchRegion;
    };
    return QueuedClient;
}());
var Queue = /** @class */ (function () {
    function Queue(t) {
        if (t === void 0) { t = 10; }
        this.clients = [];
        for (var i = 0; i < 2; i++) {
            this.clients.push([]);
            for (var j = 0; j < 16; j++) {
                this.clients[i].push([]);
            }
        }
        this.maxWaitTime = t;
    }
    Queue.prototype.mapClients = function (callbackfn) {
        var ret = [];
        this.clients.forEach(function (s) {
            s.forEach(function (r) {
                r.forEach(function (c) {
                    ret.push(callbackfn(c));
                });
            });
        });
        return ret;
    };
    Queue.prototype.filterClients = function (callbackfn) {
        var ret = [];
        this.clients.forEach(function (s) {
            s.forEach(function (r) {
                r.forEach(function (c) {
                    if (callbackfn(c)) {
                        ret.push(c);
                    }
                });
            });
        });
        return ret;
    };
    Queue.prototype.addClient = function (c) {
        this.clients[c.prefs.sex][c.prefs.region].push(new QueuedClient(c));
        return this;
    };
    Queue.prototype.removeClient = function (u) {
        var _this = this;
        this.clients.forEach(function (s, i) {
            s.forEach(function (r, j) {
                r.forEach(function (c, k) {
                    if (c.getClient().uuid == u) {
                        _this.clients[i][j].splice(k, 1);
                        return _this;
                    }
                });
            });
        });
        return this;
    };
    Queue.prototype.removeClients = function (u) {
        var _this = this;
        this.clients.forEach(function (s, i) {
            s.forEach(function (r, j) {
                _this.clients[i][j] = r.filter(function (c) {
                    return !_.includes(u, c.getClient().uuid);
                });
            });
        });
        return this;
    };
    Queue.prototype.getUnmatchable = function () {
        var _this = this;
        return this.filterClients(function (c) {
            return c.getTicks() >= _this.maxWaitTime;
        });
    };
    Queue.prototype.matchClients = function () {
        var _this = this;
        var ret = [];
        this.clients.forEach(function (s, i) {
            s.forEach(function (r, j) {
                r.forEach(function (c, k) {
                    c.tick();
                    (([0, 1]).indexOf(c.getPreferences().partnerSex) == -1 ? [0, 1] : [c.getPreferences().partnerSex]).forEach(function (partner_sex) {
                        (_.range(0, 16).indexOf(c.getPreferences().partnerRegion) == -1 ? _.range(0, 16) : [c.getPreferences().partnerRegion]).forEach(function (partner_region) {
                            _this.clients[partner_sex][partner_region].forEach(function (p) {
                                if (p.match(c) &&
                                    p.getClient().uuid != c.getClient().uuid) {
                                    if (p.getClient().uuid != c.getClient().uuid) {
                                        ret.push([c.getClient(), p.getClient()]);
                                        _this.removeClients([c.getClient().uuid, p.getClient().uuid]);
                                    }
                                }
                            });
                        });
                    });
                });
            });
        });
        var ret2 = _.chunk(this.getUnmatchable().map(function (c) {
            return c.getClient();
        }), 2).filter(function (c) {
            return c.length == 2;
        });
        if (ret2.length) {
            this.removeClients(ret2.map(function (c) {
                return c.uuid;
            }));
        }
        return ret.concat(ret2);
    };
    return Queue;
}());
exports.Queue = Queue;
exports.default = Queue;
