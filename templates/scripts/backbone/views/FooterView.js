var footerTpl = require('../templates/footer.html');

class FooterView extends Backbone.View {

    constructor(options) {
        this.el = '#footer';
        this.template = footerTpl;
        super();
    }

    render() {
        this.$el.html(_.template(this.template));
    }
}

module.exports = FooterView;
