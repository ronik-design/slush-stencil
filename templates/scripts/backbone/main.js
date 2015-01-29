import './shim';
import App from './App';

$(() => {
    new App();
    Backbone.history.start();
});
