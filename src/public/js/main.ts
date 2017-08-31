import * as io from 'socket.io';
import * as $ from 'jquery';

$(document).ready(e => {
    let socket = io();

    $('body').on('click', e => {
        socket.emit('event', 'value');
    })
});