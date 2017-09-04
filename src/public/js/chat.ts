import {h, createProjector} from 'maquette';

interface Message {
    author: string;
    content: string;
    type: string;
}

export class Chat {
    selector: HTMLElement;
    messages: Array<Message>;
    projector: any;

    constructor(s) {
        this.selector = s;
        this.messages = [];
        this.projector = createProjector();
    }

    renderChat() {
        return h('div.chat-wrapper', this.messages.map((m, i) => {
            return h('div.message', {key: i}, [
                h('div.author'.replace('author', m.author), m.content)
            ]);
        }));
    }

    addMessage(msg) {
        this.messages.push(msg);
        this.projector.scheduleRender();
    }
}