export function printUuid(msg) {
    this.socket.emit('e', this.uuid);
}
export function printHellow(msg) {
    this.socket.emit('e', 'hellow');
}