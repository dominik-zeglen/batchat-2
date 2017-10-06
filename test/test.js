var assert = require('assert');
var http = require('http');
var request = require('request');
var io = require('socket.io-client');
var async = require('async');
var _ = require('lodash');

// var url = 'http://batchat.justfabulous.online/';
var url = 'http://127.0.0.1:8000/';

Array.prototype.transpose || (Array.prototype.transpose = function () {
    if (!this.length) {
        return [];
    }

    if (this[0] instanceof Array) {
        var tlen = this.length,
            dlen = this[0].length,
            newA = new Array(dlen);
    } else {
        throw new Error("二次元配列をクレ！（・∀・）");
    }

    for (var i = tlen; i--;) {
        if (this[i].length !== dlen) throw new Error("Index Error! 不揃いな林檎たち（・∀・）");
    }

    for (var i = 0; i < dlen; ++i) {
        newA[i] = [];
        for (var j = 0, l = tlen; j < l; j++) {
            newA[i][j] = this[j][i];
        }
    }

    return newA;
});

describe('Server', function () {
    it('Service is available', function (done) {
        http.get(url, function (res) {
            assert.equal(res.statusCode, 200);
            done();
        });
    });
});

describe('Chat', function () {
    it('Chat is available', function (done) {
        request({
            url: url + 'chat/',
            method: 'POST'
        }, function (e, res, body) {
            assert.equal(res.statusCode, 200);
            done();
        });
    });

    it('Websocket service is available', function (done) {
        var client = io.connect(url);
        client.on('connect', function (data) {
            client.disconnect();
            done();
        });
    });
});

describe('Queue', function () {
    it('Default request settings', function (done) {
        this.timeout(6000);
        async.every([io.connect(url), io.connect(url)], function (client, cb) {
            client.emit('join-queue');
            setTimeout(function() {
                client.disconnect();
            }, 5000);
            client.on('e', function (msg) {
                if (msg.author == 'server' && msg.type == 'event' && msg.content == 'found partner') {
                    client.disconnect();
                    cb(null, true);
                }
            });
        }, function (e, r) {
            if (!e) {
                done();
            }
        });
    });

    it('Specific request settings', function (done) {
        this.timeout(6000);
        async.every([io.connect(url), io.connect(url)], function (client, cb) {
            client.emit('join-queue', {
                sex: 1,
                partnerSex: 1
            });
            setTimeout(function() {
                client.disconnect();
            }, 5000);
            client.on('e', function (msg) {
                if (msg.author == 'server' && msg.type == 'event' && msg.content == 'found partner') {
                    client.disconnect();
                    cb(null, true);
                }
            });
        }, function (e, r) {
            if (!e) {
                done();
            }
        });
    });

    it('Specific request settings - sex preferences not matching', function (done) {
        this.timeout(16000);
        async.every([io.connect(url), io.connect(url)], function (client, cb) {
            client.emit('join-queue', {
                sex: 0,
                partnerSex: 1
            });
            setTimeout(function() {
                client.disconnect();
            }, 15000);
            client.on('e', function (msg) {
                if (msg.author == 'server' && msg.type == 'event' && msg.content == 'found partner') {
                    client.disconnect();
                    cb(null, true);
                }
            });
        }, function (e, r) {
            if (!e) {
                done();
            }
        });
    });

    it('Specific request settings - sex preferences match for only one person', function (done) {
        this.timeout(16000);
        async.every([
            [io.connect(url), {sex: 0, partnerSex: 1}],
            [io.connect(url), {sex: 0, partnerSex: 0}]
        ], function (client_tuple, cb) {
            var client = client_tuple[0];
            var prefs = client_tuple[1];
            client.emit('join-queue', prefs);
            setTimeout(function() {
                client.disconnect();
            }, 15000);
            client.on('e', function (msg) {
                if (msg.author == 'server' && msg.type == 'event' && msg.content == 'found partner') {
                    client.disconnect();
                    cb(null, true);
                }
            });
        }, function (e, r) {
            if (!e) {
                done();
            }
        });
    });

    it('Specific request settings - region preferences not matching', function (done) {
        this.timeout(16000);
        async.every([io.connect(url), io.connect(url)], function (client, cb) {
            client.emit('join-queue', {
                region: 0,
                partnerRegion: 1
            });
            setTimeout(function() {
                client.disconnect();
            }, 15000);
            client.on('e', function (msg) {
                if (msg.author == 'server' && msg.type == 'event' && msg.content == 'found partner') {
                    client.disconnect();
                    cb(null, true);
                }
            });
        }, function (e, r) {
            if (!e) {
                done();
            }
        });
    });

    it('Specific request settings - region preferences match for only one person', function (done) {
        this.timeout(16000);
        async.every([
            [io.connect(url), {region: 0, partnerRegion: 1}],
            [io.connect(url), {region: 0, partnerRegion: 0}]
        ], function (client_tuple, cb) {
            var client = client_tuple[0];
            var prefs = client_tuple[1];
            client.emit('join-queue', prefs);
            setTimeout(function() {
                client.disconnect();
            }, 15000);
            client.on('e', function (msg) {
                if (msg.author == 'server' && msg.type == 'event' && msg.content == 'found partner') {
                    client.disconnect();
                    cb(null, true);
                }
            });
        }, function (e, r) {
            if (!e) {
                done();
            }
        });
    });
});

describe('Messaging', function () {
    it('Simple ping-pong', function (done) {
        this.timeout(5000);
        var messages = _.chunk(_.range(0, 10).map(function () {
            return Math.floor(Math.random() * 1000);
        }), 2).transpose();
        var clients = [io.connect(url), io.connect(url)];
        clients[0].id_test = 0;
        clients[1].id_test = 1;
        var counter = [1, 1];
        async.every(clients, function (client, cb) {
            client.on('e', function (msg) {
                if (msg.author == 'server' && msg.type == 'event' && msg.content == 'found partner') {
                    console.log('Client ' + client.id_test + ' connected');
                    setTimeout(function () {
                        client.emit('msg', messages[client.id_test][0]);
                        console.log('Client ' + client.id_test + ' sending msg');
                    }, Math.random() * 2000);
                } else {
                    console.log(msg);
                    client.emit('msg', messages[client.id_test][counter[client.id_test]]);
                    counter[client.id_test] += 1;
                    console.log('Client ' + client.id_test + ' sending msg');

                    if (counter[client.id_test] == messages.transpose().length) {
                        client.disconnect();
                        cb();
                    }
                }
            });
            client.emit('join-queue');
        }, function (e, r) {
            if (!e) {
                done();
            }
        });
    });

    it('Stress messaging', function (done) {
        this.timeout(60000);
        var n = 100;
        var m = 100;
        var messages = _.chunk(_.range(0, m * n).map(function () {
            return Math.floor(Math.random() * 1000);
        }), n).transpose();
        var clients = function () {
            var ret = [];
            for (var i = 0; i < n; i++) {
                var t = io.connect(url, {
                    reconnection: false
                });
                t.id_test = i;
                ret.push(t);
            }
            return ret;
        }();
        var counter = _.fill(new Array(n), 1);
        async.every(clients, function (client, cb) {
            client.cb_test = cb;
            client.on('e', function (msg) {
                if (msg.author == 'server' && msg.type == 'event' && msg.content == 'found partner') {
                    console.log('Client ' + client.id_test + ' connected');
                    setTimeout(function () {
                        client.emit('msg', messages[client.id_test][0]);
                        console.log('Client ' + client.id_test + ' sending msg');
                    }, Math.random() * 500);
                } else {
                    if (msg.author == 'partner') {
                        setTimeout(function () {
                            console.log('Client ' + client.id_test + ' sending msg #' + (counter[client.id_test] + 1));

                            if (counter[client.id_test] == m - 1) {
                                client.cb_test(null, true);
                                return;
                            } else {
                                client.emit('msg', messages[client.id_test][counter[client.id_test]]);
                                counter[client.id_test] += 1;
                            }
                        }, Math.random() * 5000);
                    }
                }
            });
            client.emit('join-queue');
        }, function (e, r) {
            if (!e) {
                done();
            }
        });
    });
});