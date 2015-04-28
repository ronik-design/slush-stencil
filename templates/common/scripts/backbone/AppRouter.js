import FormView from './views/FormView';
import StatsView from './views/StatsView';

export default class AppRouter extends Backbone.Router {

    constructor(options={}) {
        let routes = {
            '': 'home',
            '*actions': 'home'
        };

        options = _.extend(options, { routes: routes });
        super(options);

        this.stats = options.stats;
    }

    home() {
        this.formView = new FormView({
            el: $('#stats-form'),
            collection: this.stats
        });
        this.formView.render();

        this.statsView = new StatsView({
            el: $('#stats-items'),
            collection: this.stats,
            template: $('#stats-item-template').html()
        });
        this.statsView.render();
    }
}
