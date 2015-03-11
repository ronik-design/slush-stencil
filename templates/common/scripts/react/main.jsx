import React from 'react';
import Router from './router';
import routes from './router/routes.jsx';

Router.initialize(routes);

Router.run((Handler, state) => {
    React.render(
        <Handler {...state} />,
        document.body
    );
});
