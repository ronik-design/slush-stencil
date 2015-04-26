var AppRouter = require('./AppRouter');

class App {

    constructor() {
        this.router = new AppRouter();
        this.message = 'App started...';
    }
}

module.exports = App;
