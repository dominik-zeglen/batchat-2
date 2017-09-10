"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function printUuid(msg) {
    this.socket.emit('e', {
        author: this.author,
        content: this.content,
        type: 'text'
    });
}
exports.printUuid = printUuid;
function printHellow(msg) {
    // this.socket.emit('e', 'hellow');
}
exports.printHellow = printHellow;
function sendMessage(msg) {
    if (msg.length) {
        this.socket.to(this.roomID).emit('e', {
            author: 'partner',
            type: 'text',
            content: msg
        });
    }
}
exports.sendMessage = sendMessage;
function sendImage(msg) {
    if (msg.length) {
        this.socket.to(this.roomID).emit('e', {
            author: 'partner',
            type: 'image',
            content: msg
        });
    }
}
exports.sendImage = sendImage;
function disconnect(msg) {
    this.socket.to(this.roomID).emit('e', {
        author: 'server',
        type: 'event',
        content: 'partner_disconnected'
    });
}
exports.disconnect = disconnect;
function addToQueue(msg) {
    this.client.socket.leave(this.roomID);
    this.queue.addClient(this.client);
}
exports.addToQueue = addToQueue;
