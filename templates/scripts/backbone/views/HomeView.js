var homeTpl = require('../templates/home.html');

class HomeView extends Backbone.View {

    constructor(options) {
        this.el = '#content';
        this.template = homeTpl;
        super();
    }

    render() {
        $(this.el).html(_.template(this.template));
    }
}

module.exports = HomeView;
