import App from './App';

$(() => {
    if (window.IS_DEMO) {
        var app = new App();
        app.start();
    }
});
