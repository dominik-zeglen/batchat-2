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
    msg = msg ? msg.toString() : '';
    if(msg.length) {
        this.socket.to(this.roomID).emit('e', {
            author: 'partner',
            type: 'text',
            content: msg
        });
    }
}
export function sendImage(msg) {
    if(msg.length) {
        this.socket.to(this.roomID).emit('e', {
            author: 'partner',
            type: 'image',
            content: msg
        });
    }
}

export function disconnect(msg) {
    this.socket.to(this.roomID).emit('e', {
        author: 'server',
        type: 'event',
        content: 'partner_disconnected'
    });
}

export function addToQueue(msg) {
    this.client.socket.leave(this.roomID);
    this.queue.addClient(this.client);
}