export function printUuid(msg) {
    this.socket.emit('e', {
        author: this.author,
        content: this.content,
        type: 'text'
    });
}
export function printHellow(msg) {
    // this.socket.emit('e', 'hellow');
}
export function sendMessage(msg) {
    if(msg.length) {
        this.socket.emit('e', {
            author: 'partner',
            type: 'text',
            content: msg
        });
    }
}