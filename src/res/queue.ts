import * as _ from 'lodash';
import {Client} from './client';

class QueuedClient {
    private queueTime: number;
    private client: Client;

    constructor(c: Client) {
        this.client = c;
        this.queueTime = 0;
    }

    tick(): QueuedClient {
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

    match(p: QueuedClient) {
        let matchSex = false;
        let matchRegion = false;
        if (this.getPreferences().partnerSex == 2) {
            matchSex = true;
        } else {
            matchSex = (this.getPreferences().partnerSex == p.getPreferences().sex);
        }

        if (this.getPreferences().partnerRegion == 16) {
            matchRegion = true;
        } else {
            matchRegion = (this.getPreferences().partnerRegion == p.getPreferences().region);
        }

        return matchSex && matchRegion;
    }
}

export class Queue {
    clients: Array<Array<Array<QueuedClient>>>;
    maxWaitTime: number;

    constructor(t = 10) {
        this.clients = [];
        for (let i = 0; i < 2; i++) {
            this.clients.push([]);
            for (let j = 0; j < 16; j++) {
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
                    if (callbackfn(c)) {
                        ret.push(c);
                    }
                })
            });
        });

        return ret;
    }

    addClient(c: Client): Queue {
        this.clients[c.prefs.sex][c.prefs.region].push(new QueuedClient(c));
        return this;
    }

    removeClient(u: String): Queue {
        this.clients.forEach((s, i) => {
            s.forEach((r, j) => {
                r.forEach((c, k) => {
                    if (c.getClient().uuid == u) {
                        this.clients[i][j].splice(k, 1);
                        return this;
                    }
                })
            });
        });
        return this;
    }

    removeClients(u: Array<String>): Queue {
        this.clients.forEach((s, i) => {
            s.forEach((r, j) => {
                this.clients[i][j] = r.filter(c => {
                    return !_.includes(u, c.getClient().uuid);
                });
            });
        });
        return this;
    }

    getUnmatchable(): Array<QueuedClient> {
        return this.filterClients(c => {
            return c.getTicks() >= this.maxWaitTime;
        });
    }

    matchClients(): Array<Array<Client>> {
        let ret = [];
        this.clients.forEach((s, i) => {
            s.forEach((r, j) => {
                r.forEach((c, k) => {
                    c.tick();
                    (([0, 1]).indexOf(c.getPreferences().partnerSex) == -1 ? [0, 1] : [c.getPreferences().partnerSex]).forEach(partner_sex => {
                        ((<Array<number>>_.range(0, 16)).indexOf(c.getPreferences().partnerRegion) == -1 ? <Array<number>>_.range(0, 16) : [c.getPreferences().partnerRegion]).forEach(partner_region => {
                            this.clients[partner_sex][partner_region].forEach(p => {
                                if (p.match(c) &&
                                        p.getClient().uuid != c.getClient().uuid) {
                                    if (p.getClient().uuid != c.getClient().uuid) {
                                        ret.push([c.getClient(), p.getClient()]);
                                        this.removeClients([c.getClient().uuid, p.getClient().uuid]);
                                    }
                                }
                            });
                        });
                    });
                });
            });
        });
        let ret2 = _.chunk(this.getUnmatchable().map(c => {
            return c.getClient();
        }), 2).filter(c => {
            return c.length == 2;
        });
        if (ret2.length) {
            this.removeClients(ret2.map(c => {
                return (<any>c).uuid;
            }));
        }

        return ret.concat(ret2);
    }
}

export default Queue;