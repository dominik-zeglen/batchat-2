import * as _ from 'lodash';
import * as sl from './socket-listeners';
import {Client} from './client';

class QueuedClient {
    private queueTime :number;
    private client :Client;

    constructor(c :Client) {
        this.client = c;
        this.queueTime = 0;
    }

    tick() :QueuedClient {
        this.queueTime += 1;
        return this;
    }

    getTicks() {
        return this.queueTime;
    }

    getPreferences() {
        return this.client.prefs;
    }

    getClient() {
        return this.client;
    }
}

export class Queue {
    clients :Array<Array<Array<QueuedClient>>>;
    maxWaitTime :number;

    constructor(t = 5) {
        this.clients = [];
        for(let i = 0; i < 2; i++) {
            this.clients.push([]);
            for(let j = 0; j < 16; j++) {
                this.clients[i].push([]);
            }
        }
        this.maxWaitTime = t;
    }

    mapClients(callbackfn) {
        let ret = [];
        this.clients.forEach(s => {
            s.forEach(r => {
                r.forEach(c => {
                    ret.push(callbackfn(c));
                })
            });
        });

        return ret;
    }

    filterClients(callbackfn) {
        let ret = [];
        this.clients.forEach(s => {
            s.forEach(r => {
                r.forEach(c => {
                    if(callbackfn(c)) {
                        ret.push(c);
                    }
                })
            });
        });

        return ret;
    }

    addClient(c :Client) :Queue {
        this.clients[c.prefs.sex][c.prefs.region].push(new QueuedClient(c));

        // c.socket.removeListener('e', sl.printUuid);
        // c.socket.on('e', e => {
        //     c.socket.emit('e', 'hellow');
        // });

        return this;
    }

    removeClient(u :String) :Queue {
        this.clients.forEach((s, i) => {
            s.forEach((r, j) => {
                r.forEach((c, k) => {
                    if (c.getClient().uuid == u) {
                        delete this.clients[i][j][k];
                    }
                })
            });
        });
        return this;
    }

    removeClients(u :Array<String>) :Queue {
        this.clients.forEach((s, i) => {
            s.forEach((r, j) => {
                r.forEach((c, k) => {
                    if (_.includes(u, c.getClient().uuid)) {
                        delete this.clients[i][j][k];
                    }
                })
            });
        });
        return this;
    }

    getUnmatchable() :Array<Client> {
        return this.filterClients(c => {
            return c.getTicks() >= this.maxWaitTime;
        })
    }

    matchClients() {
        let ret;
        this.clients.forEach((s, i) => {
            s.forEach((r, j) => {
                r.forEach((c, k) => {
                    (c.getPreferences().sex == 2 ? [0, 1] : [c.getPreferences().partnerSex]).forEach(partner_sex => {
                        this.clients[partner_sex][c.getPreferences().partnerRegion].forEach(p => {
                            if (p.getPreferences().partnerRegion == c.getClient().region &&
                                p.getPreferences().partnerSex == c.getClient().sex) {
                                ret.push([c.getClient(), p.getClient()]);

                            }
                        })
                    });
                });
            });
        });
    }
}

export default Queue;