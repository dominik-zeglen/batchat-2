import {h, createProjector} from 'maquette';

export class MainNav {
    selector: HTMLElement;
    projector: any;
    users: any;

    constructor(s) {
        this.selector = s;
        this.projector = createProjector();
        this.update();
    }

    render() {
        return h('div.container.center-vertical', [
            h('div.row', [
                h('div.col-sm-2', [
                    h('div.logo', [
                        h('img', {
                            'data-src': '/public/img/logo.png'
                        })
                    ])
                ]),
                h('div.col-sm-8'),
                h('div.col-sm-2.text-right', ['Aktywni uzytkownicy: ' + this.users])
            ])
        ]);
    }

    update() {
        fetch('/api/clients/').then(r => {
            r.json().then(t => {
                this.users = t.activeClients;
                this.projector.scheduleRender();
            });
        });
    }
}

