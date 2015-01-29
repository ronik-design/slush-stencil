var headerTpl = require('../templates/header.html');

class HeaderView extends Backbone.View {

    constructor(options) {
        this.el = '#header';
        this.template = headerTpl;
        super();
    }

    render() {
        $(this.el).html(_.template(this.template));
    }
}

module.exports = HeaderView;
