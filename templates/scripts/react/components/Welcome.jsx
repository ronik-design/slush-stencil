import React from 'react';
import Router from 'react-router';
var { Link, RouteHandler } = Router;

class Welcome extends React.Component {
    render() {
        return (
          <div>
            <Link to="rooms">View Rooms</Link>
            <br />
            <br />
            <RouteHandler />
          </div>
        );
    }
}

export default Welcome;
