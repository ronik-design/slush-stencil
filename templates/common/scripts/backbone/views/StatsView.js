var homeTpl = `<div class="content"><h1>Here is something.</h1></div>`;
var modelTpl = `<li><%= title %></li>`;

export default class StatsView extends Backbone.View {

    constructor(options={}) {
        super(options);

        this.template = _.template(options.template);
        this.collection = options.collection;

        this.collection.on('add', this.onAdd.bind(this));
    }

    onAdd(stat) {
        this.$el.append(this.template(stat));
    }

    render() {
        // this.$el.html(homeTpl);
        // this.$el.append('<ul></ul>');
        // this.collection.each(() => {
        //     let str = this.template({ title: 'foo' });
        //     $('ul', this.$el).append(str);
        // });
    }
}
