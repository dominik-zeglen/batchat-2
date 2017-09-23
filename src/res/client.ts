import * as uuid from 'node-uuid';
import Socket = SocketIO.Socket;

export interface ClientPreferences {
    sex: number;
    partnerSex: number;
    region: number;
    partnerRegion: number;
}

function matchDefault(a) :ClientPreferences {
    if(!([0, 1]).indexOf(a.sex)) {
        a.sex = 0;
        console.log('Sex out of range');
    }
    if(!([0, 1, 2]).indexOf(a.parterSex)) {
        a.parterSex = 2;
        console.log('Partner\'s sex out of range');
    }
    if(a.region < 0 && a.region > 15) {
        a.region = 0;
        console.log('Region out of range');
    }
    if(a.partnerRegion < 0 && a.parterRegion > 16) {
        a.region = 0;
        console.log('Partner\'s region out of range');
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
        prefs = matchDefault(prefs);
        this.uuid = uuid.v1();
        this.socket = sock;
        this.prefs = prefs;
    }
}