import AppRouter from './AppRouter';

export default class App {

    constructor() {
        this.stats = new Stats();
        this.router = new AppRouter({
            stats: this.stats
        });
    }

    start() {
        Backbone.history.start();
    }
};
