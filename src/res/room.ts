import * as uuid from 'node-uuid';
import {Client} from './client';

export class Room {
    clients :Array<Client>;
    uuid :String;

    constructor(clients :Array<Client>) {
        if(clients.length == 2) {
            this.clients = clients;
            this.uuid = uuid.v1();
        } else {
            throw 'Room must contain exactly two clients';
        }
    }

    getClients() :Array<Client> {
        return this.clients;
    }
}

export default Room;