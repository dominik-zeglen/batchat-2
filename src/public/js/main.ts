import * as io from 'socket.io-client';
import * as $ from 'jquery';
import * as cookie from 'js-cookie';
import {Chat} from './components/chat';
import {MainNav} from './components/main-nav';
import {MainFooter} from './components/main-footer';
import {StaticSelect} from "./components/static-select";
import {isNumber} from "util";

$(() => {
    if(document.getElementById('chat') != null) {
        let socket = io();
        io.connect();
        let chat = new Chat(document.getElementById('chat'));
        chat.projector.append(chat.selector, chat.renderChat.bind(chat));

        $(window).on('keyup', e => {
            if(e.keyCode == 13) {
                e.preventDefault();
                $('#chat-controls').submit();
            }
            if(e.keyCode == 82) {
                $('#css').replaceWith('<link id="css" rel="stylesheet" href="/public/css/style.css?t=' + Date.now() + '">');
            }
        });
        $('#chat-controls').on('submit', e => {
            e.preventDefault();
            let t = $(e.currentTarget);

            let v = t.find('#v');
            let u = t.find('#u');
            if((<String>v.val()).replace(/s+/, '').length && !u.val()) {
                socket.emit('msg', v.val());
                chat.addMessage({
                    author: 'me',
                    type: 'text',
                    content: v.val()
                });
                v.val('');
            }
        });
        $('#img').on('click', e => {
            if ((<any>e).originalEvent.clientX != 0 && (<any>e).originalEvent.clientY != 0) {
                document.getElementById('u').click();
            }
        });
        $('#u').on('change', e => {
            e.preventDefault();
            let f = (<any>e.currentTarget).files[0];
            let reader = new FileReader();
            reader.readAsDataURL(f);
            reader.onload = function () {
                chat.addMessage({
                    'author': 'me',
                    'type': 'image',
                    'content': reader.result
                });
                socket.emit('img', reader.result);
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        });

        socket.emit('join-queue', {
            sex: cookie.get('sex'),
            partnerSex: cookie.get('partnerSex'),
            region: cookie.get('region'),
            partnerRegion: cookie.get('partnerRegion')
        });
        socket.on('e', msg => {
            if (msg.author == 'server') {
                if (msg.type == 'event') {
                    if (msg.content == 'partner_disconnected') {
                        chat.addMessage({
                            author: 'server',
                            type: 'text',
                            content: 'partner disconnected'
                        });
                        setTimeout(() => {
                            socket.emit('addToQueue');
                        }, 3000);
                    } else {
                        chat.addMessage(msg);
                    }
                } else {
                    chat.addMessage(msg);
                }
            } else {
                chat.addMessage(msg);
            }
        });
        socket.on('msg', chat.addMessage);
    }

    let nav = new MainNav(document.getElementById('main-nav'));
    nav.projector.append(nav.selector, nav.render.bind(nav));
    setInterval(() => {
        nav.update();
    }, 1000);

    $.fn.extend({
        StaticSelect: function() {
            return this.each(function() {
                return new StaticSelect.StatSelect($(this));
            });
        }
    });

    $('.select').each((i, t) => {
        (<any>$(t)).StaticSelect();
        if(isNumber($(t).css('z-index'))) {
            $(t).css('z-index', (parseInt(<string>$(t).css('z-index')) + i));
        } else {
            $(t).css('z-index', 100 - i);
        }
    });

    $('img').each((i, t) => {
        if($(t).attr('data-src')) {
            $(t).attr('src', $(t).attr('data-src'));
        }
    });
});