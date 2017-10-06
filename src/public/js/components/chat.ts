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
    loading: boolean;

    constructor(s) {
        this.selector = s;
        this.messages = [];
        this.projector = createProjector();
        this.loading = true;
    }

    renderChat() {
        return h('div', this.loading ?
            h('div#loader.center-vertical.text-center', [
                h('span.fa.fa-spin.fa-circle-o-notch', '')
            ]) :
            h('div#chat-container', this.messages.map((m, i) => {
            return h('div.message', {key: i}, [
                h('div.author'.replace('author', m.author), m.type == 'image' ? h('img', {src: m.content}) : m.content)
            ]);
        })));
    }

    addMessage(msg) {
        this.messages.push(emojizer(msg));
        this.projector.scheduleRender();
        setTimeout((() => {
            this.selector.scrollTop = this.selector.scrollHeight + 100;
        }), 100);
    }

    setLoadingState(state) {
        this.loading = state;
        this.projector.scheduleRender();
    }
}