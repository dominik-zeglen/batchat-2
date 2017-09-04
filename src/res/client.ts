import * as uuid from 'node-uuid';
import Socket = SocketIO.Socket;

export interface ClientPreferences {
    sex: number;
    partnerSex: number;
    region: number;
    partnerRegion: number;
}

export class Client {
    uuid :string;
    region :number = 0;
    sex :number = 0;
    prefs :ClientPreferences;
    socket :Socket;

    constructor(sock, prefs) {
        this.uuid = uuid.v1();
        this.socket = sock;
        this.prefs = prefs;
    }
}