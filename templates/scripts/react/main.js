import { architect } from 'tuxx/Architecture';
import RoomStore from './stores/RoomStore';
import MessageStore from './stores/MessageStore';

architect(RoomStore).itOutputs('rooms');
architect(MessageStore).itNeeds('rooms').itOutputs('messages');

//Define app routes here
import React from 'tuxx/React';
import Route from 'tuxx/Router/Route';
import NotFoundRoute from 'tuxx/Router/NotFoundRoute';
import DefaultRoute from 'tuxx/Router/DefaultRoute';
import Link from 'tuxx/Router/Link';
import RouteHandler from 'tuxx/Router/RouteHandler';
import run from 'tuxx/Router/run';

import Welcome from './app/components/Welcome.jsx';
import NotFound from './app/components/routes/NotFound.jsx';
import MessageView from './app/components/message/MessageView.jsx';
import RoomView from './app/components/room/RoomView.jsx';
import DefaultWelcome from './app/components/DefaultWelcome.jsx';

let routes = (
  <Route name="app" path="/" handler={Welcome}>
    <DefaultRoute handler={DefaultWelcome} />
    <Route name="rooms" path="/rooms" handler={RoomView}>
      <Route name="rooms.room" path="/rooms/:roomId" handler={MessageView} />
    </Route>
    <NotFoundRoute handler={NotFound} />
  </Route>
);

run(routes, (Handler) => {
  React.render(<Handler />, document.getElementById('content'));
});
