import React from 'react';
import Router from 'react-router';
var { Route, DefaultRoute, Link, RouteHandler, NotFoundRoute } = Router;

import Welcome from './components/Welcome.jsx';
import NotFound from './components/routes/NotFound.jsx';
import DefaultWelcome from './components/DefaultWelcome.jsx';
import DefaultView from './components/DefaultView.jsx';

let routes = (
  <Route name="app" path="/" handler={Welcome}>
    <DefaultRoute handler={DefaultWelcome} />
    <Route name="view" path="/view" handler={DefaultView}></Route>
    <NotFoundRoute handler={NotFound} />
  </Route>
);

run(routes, (Handler) => {
  React.render(<Handler />, document.getElementById('content'));
});
