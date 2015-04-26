import Models from './collections/Models';
import HeaderView from './views/HeaderView';
import FooterView from './views/FooterView';
import HomeView from './views/HomeView';

export default class AppRouter extends Backbone.Router {

    constructor(options={}) {
        let routes = {
            '': 'home',
            '*actions': 'home'
        };

        options = _.extend(options, { routes: routes });
        super(options);

        this.collection = new Models();
        this.collection.add({ title: 'The Model' });

        this.headerView = new HeaderView();
        this.headerView.render();
        this.footerView = new FooterView();
        this.footerView.render();
    }

    home() {
        this.homeView = new HomeView({
            collection: this.collection
        });
        this.homeView.render();
    }
}
