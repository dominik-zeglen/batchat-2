import * as uuid from 'node-uuid';
import Socket = SocketIO.Socket;

export class Client {
    uuid :string;
    queued :boolean;
    region :number;
    sex :boolean;
    prefs :number;
    socket :Socket;

    constructor(sock) {
        this.uuid = uuid.v1();
        this.socket = sock;
    }
}