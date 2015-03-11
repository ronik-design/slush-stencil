import ReactRouter from 'react-router';

class Router {
    constructor() {
        this.router = null;
    }

    initialize(routes) {
        this.router = ReactRouter.create({
            location: ReactRouter.HistoryLocation,
            routes: routes,
            onError(err) { throw err; }
        });
    }

    makePath() {
        return this.router.makePath(...arguments);
    }

    makeHref() {
        return this.router.makeHref(...arguments);
    }

    transitionTo() {
        this.router.transitionTo(...arguments);
    }

    replaceWith() {
        this.router.replaceWith(...arguments);
    }

    goBack() {
        return this.router.goBack();
    }

    run() {
        this.router.run(...arguments);
    }
}

export default new Router();
