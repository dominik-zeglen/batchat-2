import * as express from 'express';
import * as uuid from 'node-uuid';
import * as io from 'socket.io';
import * as http_module from 'http';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as sl from './socket-listeners';
import {Room} from './room';
import {Client} from './client';
import {RoomManager} from './roommanager';
import {Queue} from './queue';

export class Server {
    app: express.Application;
    http: any;
    settings: Array<any>;
    rooms: RoomManager;
    queue: Queue;
    socket: any;

    constructor(port: number) {
        this.app = express();
        this.http = new http_module.Server(this.app);
        this.settings = [];
        this.settings['port'] = port;
        this.rooms = new RoomManager();
        this.socket = io(this.http);
        this.queue = new Queue();
    }

    init(): Server {
        this.app.use(cookieParser());
        this.app.use(bodyParser());
        this.socket.on('connection', sock => {
            sock.on('join-queue', prefs => {
                let c = new Client(sock, prefs);
                this.queue.addClient(c);

                sock.on('e', sl.printUuid.bind({
                    socket: c.socket,
                    author: 'server',
                    content: c.uuid
                }));
            });
        });

        this.app.use('/public/', express.static('./public'));
        this.app.get('/', (req: express.Request, res: express.Response) => {
            fs.readFile('./views/index.html', (e, f) => {
                res.send(f.toString().replace('%rooms%', JSON.stringify(this.rooms)));
            });
        });
        this.app.post('/chat', (req: express.Request, res: express.Response) => {
            res.cookie('sex', req.body.sex)
                .cookie('partnerSex', req.body.partnerSex)
                .cookie('region', req.body.region)
                .cookie('partnerRegion', req.body.partnerRegion);
            fs.readFile('./views/chat.html', (e, f) => {
                res.send(f.toString());
            });
        });

        return this;
    }

    listen() {
        this.http.listen(this.settings['port']);
    }
}

export default Server;