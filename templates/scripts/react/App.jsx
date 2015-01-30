import React from 'react';
import Router from 'react-router';
var { Route, DefaultRoute, Link, RouteHandler, NotFoundRoute } = Router;

import ChatExampleData from './ChatExampleData';
import ChatWebAPIUtils from './utils/ChatWebAPIUtils';
import MessageSection from './components/MessageSection.jsx';
import ThreadSection from './components/ThreadSection.jsx';

var Chat = React.createClass({
    render: function() {
        return (
          <div className="chatapp">
            <ThreadSection />
            <MessageSection />
          </div>
        );
    }
});

ChatExampleData.init();
ChatWebAPIUtils.getAllMessages();

React.render(
    <Chat />,
    document.getElementById('content')
);

// import Welcome from './components/Welcome.jsx';
// import NotFound from './components/routes/NotFound.jsx';
// import DefaultWelcome from './components/DefaultWelcome.jsx';
// import Simple from './components/Simple.jsx';


// var Hello = React.createClass({
//   render() {
//     return (
//       <h1>HELLO THERE!</h1>
//     );
//   }
// });

// var App = React.createClass({
//   render() {
//     return (
//       <div>
//         <ul>
//             <li><Link to="app">Dashboard</Link></li>
//             <li><Link to="simple">Simple</Link></li>
//         </ul>
//         <RouteHandler/>
//       </div>
//     );
//   }
// });

// let routes = (
//   <Route name="app" path="/" handler={App}>
//     <Route name="simple" handler={Simple}/>
//     <DefaultRoute handler={Hello}/>
//   </Route>
// );

// Router.run(routes, (Handler) => {
//   React.render(<Handler />, document.getElementById('content'));
// });
