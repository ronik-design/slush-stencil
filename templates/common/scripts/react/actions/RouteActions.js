import alt from '../core/alt';
import Router from '../router';

var pendingTransition;

function noAuth(payload) {
    if (payload.user) {
        payload.transition.redirect('Home');
    } else {
        this.dispatch(payload);
    }
}

function authRequired(payload) {
    if (!payload.user) {
        pendingTransition = payload.transition;
        payload.transition.redirect('Login');
    } else {
        this.dispatch(payload);
    }
}

class RouteActions {
    constructor() {
        this.generateActions();
    }

    toLogin(payload) {
        noAuth.call(this, payload);
    }

    toPage(payload) {
        authRequired.call(this, payload);
    }

    transitionToPending() {
        if (pendingTransition) {
            setTimeout(() => {
                pendingTransition.retry();
                pendingTransition = null;
            }, 0);
        } else {
            this.actions.transitionTo(...arguments);
        }
    }

    transitionTo() {
        setTimeout(() => router.transitionTo(...arguments), 0);
    }

    replaceWith() {
        setTimeout(() => router.replaceWith(...arguments), 0);
    }

    goBack() {
        setTimeout(() => {
            if (!router.goBack()) {
                router.transitionTo(...arguments);
            }
        }, 0);
    }
}

export default alt.createActions(RouteActions);
