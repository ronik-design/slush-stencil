var homeTpl = `<div class="content"><h1>Here is something.</h1></div>`;
var modelTpl = `<li><%= title %></li>`;

export default class HomeView extends Backbone.View {

    constructor(options={}) {
        options = _.extend(options, { el: '#content' });
        super(options);

        this.template = _.template(modelTpl);
        this.collection = options.collection;
    }

    render() {
        this.$el.html(homeTpl);
        this.$el.append('<ul></ul>');
        this.collection.each(() => {
            let str = this.template({ title: 'foo' });
            $('ul', this.$el).append(str);
        });
    }
}
