import RouteActions from '../actions/RouteActions';

export default function(routeName) {
    return {
        statics: {
            willTransitionTo(transition, params, query) {
                let actionName = 'to' + routeName;
                if (RouteActions[actionName]) {
                    let payload = {
                        transition: transition,
                        params: params,
                        query: query
                    };
                    RouteActions[actionName](payload);
                }
            },
            willTransitionFrom(transition, component) {
                let actionName = 'from' + routeName;
                if (RouteActions[actionName]) {
                    let payload = {
                        transition: transition,
                        component: component
                    };
                    RouteActions[actionName](payload);
                }
            }
        }
    };
}
