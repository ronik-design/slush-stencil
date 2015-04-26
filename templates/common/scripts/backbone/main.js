import App from './App';

$(() => {
    var app = new App();
    Backbone.history.start();
    console.log(app.message);
});
