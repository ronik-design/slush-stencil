import React from 'react';
import { Route, DefaultRoute, NotFoundRoute } from 'react-router';

import App from '../components/App.jsx';
import PageCreateForm from '../components/PageCreateForm.jsx';
import Page from '../components/Page.jsx';
import NotFound from '../components/NotFound.jsx';

var routes = (
    <Route handler={App}>
        <Route name="create" handler={PageCreateForm}/>
        <Route name="page" path="page/:path" handler={Page}/>
        <DefaultRoute handler={PageCreateForm}/>
        <NotFoundRoute handler={NotFound}/>
    </Route>
);

export default routes;
