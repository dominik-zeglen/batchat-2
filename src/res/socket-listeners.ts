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