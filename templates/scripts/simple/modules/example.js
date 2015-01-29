class Example {

    constructor(options) {
        this.el = options.el;
        this.$el = $(this.el);
        this.template = 'I\'m <%= msg %>!';
    }

    render(context) {
        var rendered = _.template(this.template, context);
        this.$el.html(rendered);
    }
}

module.exports = Example;
