import React from 'tuxx/React';
import Link from 'tuxx/Router/Link';
import RouteHandler from 'tuxx/Router/RouteHandler';

var Welcome = React.createClass({
  render: function () {
    return (
      <div>
        <Link to="rooms">View Rooms</Link>
        <br />
        <br />
        <RouteHandler />
      </div>
    );
  }
});

export default Welcome;
