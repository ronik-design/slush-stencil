import Demo from './modules/Demo';

$(() => {
    if (window.IS_DEMO) {
        Demo.start();
    }
});
