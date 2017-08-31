import * as _ from 'lodash';
import * as sl from './socket-listeners';
import {Client} from './client';

export class Queue {
    clients :Array<Client>;

    constructor() {
        this.clients = [];
    }

    addClient(c :Client) {
        this.clients[c.uuid] = c;

        c.socket.removeListener('e', sl.printUuid);
        c.socket.on('e', e => {
            c.socket.emit('e', 'hellow');
        })
    }

    removeClient(c :String) {
        delete this.clients[_.findIndex(this.clients, o => {return o.uuid == c})];
    }
}

export default Queue;