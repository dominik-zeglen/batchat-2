import * as io from 'socket.io-client';
import * as $ from 'jquery';

$(() => {
    let socket = io();
    io.connect();

    socket.on('e', msg => {
        console.log(msg);
    })

    setInterval(() => {
        socket.emit('e');
    }, 5000);
});