import * as express from 'express';
import * as uuid from 'node-uuid';
import * as io from 'socket.io';
import * as http_module from 'http';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as sl from './socket-listeners';
import {Room} from './room';
import {Client} from './client';
import {RoomManager} from './roommanager';
import {Queue} from './queue';

export class Server {
    app :express.Application;
    http :any;
    settings :Array<any>;
    rooms :RoomManager;
    queue :Queue;
    socket :any;

    constructor(port :number) {
        this.app = express();
        this.http = new http_module.Server(this.app);
        this.settings = [];
        this.settings['port'] = port;
        this.rooms = new RoomManager();
        this.socket = io(this.http);
        this.queue = new Queue();
    }

    init() :Server {
        this.socket.on('connection', sock => {
            let c = new Client(sock);
            sock.on('e', sl.printUuid.bind(c));
            this.queue.addClient(c);
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