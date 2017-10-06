import * as uuid from 'node-uuid';
import Socket = SocketIO.Socket;

export interface ClientPreferences {
    sex: number;
    partnerSex: number;
    region: number;
    partnerRegion: number;
}

function matchDefault(a) :ClientPreferences {
    if(!([0, 1]).indexOf(a.sex) || !a.sex) {
        a.sex = 0;
    }
    if(!([0, 1, 2]).indexOf(a.parterSex) || !a.partnerSex) {
        a.parterSex = 2;
    }
    if((a.region < 0 && a.region > 15) || !a.region) {
        a.region = 0;
    }
    if((a.partnerRegion < 0 && a.partnerRegion > 16) || !a.partnerRegion) {
        a.partnerRegion = 16;
    }

    Object.keys(a).forEach(k => {
        a[k] = parseInt(a[k]);
    });

    return a;
}

export class Client {
    uuid :string;
    region :number = 0;
    sex :number = 0;
    prefs :ClientPreferences;
    socket :Socket;

    constructor(sock, prefs) {
        prefs = matchDefault(prefs || {});
        this.uuid = uuid.v1();
        this.socket = sock;
        this.prefs = prefs;
    }
}