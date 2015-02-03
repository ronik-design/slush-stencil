var homeTpl = `<div class="content"><h1>Here is something.</h1></div>`;
var modelTpl = `<li><%= title %></li>`;

export default class HomeView extends Backbone.View {

    constructor(options) {
        this.el = '#content';
        this.template = homeTpl;
        this.collection = options.collection;
        super(options);
    }

    render() {
        this.$el.html(_.template(this.template));
        this.$el.append('<ul></ul>');
        this.collection.each((model) => {
            let str = _.template(modelTpl, { title: 'foo' });
            $('ul', this.$el).append(str);
        });
    }
}
