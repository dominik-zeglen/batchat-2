import * as _ from 'lodash';
import {Room} from './room';
import {Client} from './client';

export class RoomManager {
    rooms :Array<Room>;

    constructor() {
        this.rooms = [];
    }

    addRoom(r :Room) :RoomManager {
        this.rooms.push(r);
        return this;
    }

    removeRoom(r :String) :RoomManager {
        delete this.rooms[_.findIndex(this.rooms, o => {return o.uuid == r})];
        return this;
    }

    searchClientRoom(s :String, index :boolean = false) :Room {
        return this.rooms.filter(r => {
            return r.getClients().filter(c => s == c.uuid).length;
        })[0];
    }

    searchClientRoomIndex(r :Room) :number {
        return this.rooms.indexOf(r);
    }

    searchClient(s :String) :Client {
        return this.searchClientRoom(s).getClients().filter(c => s == c.uuid)[0];
    }
}

export default RoomManager;