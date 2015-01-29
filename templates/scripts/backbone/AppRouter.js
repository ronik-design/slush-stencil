var HeaderView = require('./views/HeaderView');
var FooterView = require('./views/FooterView');
var HomeView = require('./views/HomeView');

class AppRouter extends Backbone.Router {

    constructor() {
        this.routes = {
            '': 'home',
            '*actions': 'home'
        };

        this.headerView = new HeaderView();
        this.headerView.render();
        this.footerView = new FooterView();
        this.footerView.render();

        super();
    }

    home() {
        this.homeView = new HomeView();
        this.homeView.render();
    }
}

module.exports = AppRouter;
