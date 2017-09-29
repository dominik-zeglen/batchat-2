import * as $ from 'jquery';

export module StaticSelect {
    export class StatSelect {
        element: JQuery;
        dom: any;

        constructor(element: JQuery) {
            this.element = element;
            this.OnCreate();
        }

        OnCreate() {
            this.element.on('click', '.select-label', (this.OnLabelClick).bind(this));
            this.element.on('click', 'ul li', (this.OnValueClick).bind(this));
            return this;
        }

        OnLabelClick(e) {
            let ul = this.element.find('ul');

            if(<String>ul.attr('aria-expanded') == 'true') {
                StatSelect.SlideUp(ul);
            } else {
                StatSelect.SlideDown(ul);
            }
        }

        OnValueClick(e) {
            let ul = this.element.find('ul');
            let label = this.element.find('.select-label');
            let t = $(e.currentTarget);

            label.find('div').text(t.find('div').text());
            label.find('input').val(t.find('span').text());
            StatSelect.SlideUp(ul);
        }

        static SlideUp(ul: JQuery) {
            ul.attr('aria-expanded', 'false').removeClass('expanded');
        }

        static SlideDown(ul: JQuery) {
            ul.attr('aria-expanded', 'true').addClass('expanded');
        }
    }
}