    import {h, createProjector} from 'maquette';
import {emojizer} from '../emojizer';

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
        return h('div#chat-container', this.messages.map((m, i) => {
            return h('div.message', {key: i}, [
                h('div.author'.replace('author', m.author), m.type == 'image' ? h('img', {src: m.content}) : m.content)
            ]);
        }));
    }

    addMessage(msg) {
        this.messages.push(emojizer(msg));
        this.projector.scheduleRender();
        setTimeout((() => {
            this.selector.scrollTop = this.selector.scrollHeight + 100;
        }), 100);
    }
}