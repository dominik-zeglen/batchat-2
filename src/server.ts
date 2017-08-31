import * as express from 'express';
import * as uuid from 'node-uuid';
import * as io from 'socket.io';
import * as http_module from 'http';
import * as fs from 'fs';

class Client {
    uuid :string;
    queued :boolean;
    region :number;
    sex :boolean;
    prefs :number;

    constructor() {
        this.uuid = uuid.v1();
    }
}

class Room {
    clients :Array<Client>;

    constructor(clients :Array<Client>) {
        if(clients.length == 2) {
            this.clients = clients;
        } else {
            throw 'Room must contain exactly two clients';
        }
    }

    getClients() :Array<Client> {
        return this.clients;
    }
}

class RoomManager {
    rooms :Array<Room>;

    constructor() {
        this.rooms = [];
    }

    addRoom(r :Room) :RoomManager {
        this.rooms.push(r);
        return this;
    }

    removeRoom(r :String) :RoomManager {
        delete this.rooms[r];
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

class Queue {
    clients :Array<Client>;

    constructor() {
        this.clients = [];
    }

    addClient(c :Client) {
        this.clients[c.uuid] = c;
    }

    removeClient(c :String) {
        delete this.clients[c];
    }
}

export class Server {
    app :express.Application;
    http :any;
    settings :Array<any>;
    rooms :RoomManager;
    queue :Queue;
    io :any;

    constructor(port :number) {
        this.app = express();
        this.http = http_module.Server(this.app);
        this.settings = [];
        this.settings['port'] = port;
        this.rooms = new RoomManager();
        this.io = io(this.http);
    }

    init() :Server {
        this.io.on('event', e => {
            console.log(e);
        });

        this.app.use('/public/', express.static('./public'));
        this.app.get('/', (req :express.Request, res :express.Response) => {
            fs.readFile('./views/index.html', (e, f) => {
                res.send(f.toString().replace('%rooms%', JSON.stringify(this.rooms)));
            });
        });

        return this;
    }

    listen() {
        this.http.listen(this.settings['port']);
    }
}

export default Server;