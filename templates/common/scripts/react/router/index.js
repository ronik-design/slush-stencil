import Router from 'react-router';
import routes from './routes.jsx';

var router = Router.create({
    location: process.env.NODE_ENV === 'production' ? Router.HashLocation : Router.HistoryLocation,
    routes: routes
});

export default router;
