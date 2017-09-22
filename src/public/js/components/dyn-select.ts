import {createProjector, h} from 'maquette';
import * as $ from 'jquery';

export module DynamicSelect {
    export class DynSelect {
        element: JQuery;
        dom: any;

        constructor(element: JQuery) {
            this.element = element;
            this.OnCreate();
        }

        OnCreate() {
            $.ajax({
                url: this.element.attr('data-content'),
                method: 'GET',
                dataType: 'xml',
                success: (res) => {
                    this.dom = h('div.select-body', [
                        h('div.select-label', [
                            h('div', $('e l', res)[0].innerHTML),
                            h('input', {
                                type: 'hidden',
                                value: $('v').attr('value'),
                                name: this.element.attr('data-name')
                            })
                        ]),
                        h('ul', (() => {
                            let arr = [];
                            $('e', res).each((i, v) => {
                                let t = $(v);
                                arr.push(h('li', [
                                    h('div', t.find('l').text()),
                                    h('span', t.find('v').text())
                                ]));
                            });
                            return arr;
                        })())
                    ]);
                    this.element.on('click', '.select-label', (this.OnLabelClick).bind(this));
                    this.element.on('click', 'ul li', (this.OnValueClick).bind(this));
                    createProjector().append(this.element[0], (() => this.dom));
                }
            });
            return this;
        }

        OnLabelClick(e) {
            let ul = this.element.find('ul');
            let label = $(e.currentTarget);

            if(ul.attr('aria-expanded') == 'true') {
                DynSelect.SlideUp(ul);
            } else {
                DynSelect.SlideDown(ul);
            }
        }

        OnValueClick(e) {
            let ul = this.element.find('ul');
            let label = this.element.find('.select-label');
            let t = $(e.currentTarget);

            label.find('div').text(t.find('div').text());
            label.find('input').val(t.find('span').val());
            DynSelect.SlideUp(ul);
        }

        static SlideUp(ul: JQuery) {
            ul.attr('aria-expanded', 'false').removeClass('expanded');
        }

        static SlideDown(ul: JQuery) {
            ul.attr('aria-expanded', 'true').addClass('expanded');
        }
    }
}