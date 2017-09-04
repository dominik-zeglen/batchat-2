import * as io from 'socket.io-client';
import * as $ from 'jquery';
import * as cookie from 'js-cookie';
import {Chat} from './chat';

$(() => {
    let socket = io();
    io.connect();

    $('#chat-controls').on('submit', e => {
        let t = $(e.currentTarget);
        e.preventDefault();

        let v = t.find('#v');
        socket.emit('msg', v.val());
        v.val('');
    });

    let chat = new Chat(document.getElementById('chat'));
    chat.projector.append(chat.selector, chat.renderChat.bind(chat));

    socket.emit('join-queue', {
        sex: cookie.get('sex'),
        partnerSex: cookie.get('partnerSex'),
        region: cookie.get('region'),
        partnerRegion: cookie.get('partnerRegion')
    });
    socket.on('e', chat.addMessage.bind(chat));
    socket.on('msg', chat.addMessage.bind(chat));
});