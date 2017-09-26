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
        return h('div.container.center-vertical.fit-sm-down-height.p-2.p-md-0', [
            h('div.row.fit-height', [
                h('div.col-2', [
                    h('div.logo.fit-height', [
                        h('img.fit-height.center-vertical', {
                            'data-src': '/public/images/logo.png'
                        })
                    ])
                ]),
                h('div.col-5'),
                h('div.col-5.text-right', [
                    h('div.center-vertical', 'Aktywni uzytkownicy: ' + this.users)
                ])
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

