require('./shim');

var App = './App';

$(() => {
    new App();
    Backbone.history.start();
});
