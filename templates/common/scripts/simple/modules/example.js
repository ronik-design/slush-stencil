export default class Example {

    constructor(options) {
        this.el = options.el;
        this.$el = $(this.el);
        this.template = _.template('I\'m <%= msg %>!');
    }

    render(context) {
        var rendered = this.template(context);
        this.$el.html(rendered);
    }
}
