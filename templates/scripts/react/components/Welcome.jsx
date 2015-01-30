import React from 'react';
import Router from 'react-router';
var { Link, RouteHandler } = Router;

var Welcome = React.createClass({
    render() {
        return (
          <div>
            <Link to="simple">View Simple</Link>
            <br />
            <br />
            <RouteHandler />
          </div>
        );
    }
});

export default Welcome;
