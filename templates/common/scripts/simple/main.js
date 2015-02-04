import Example from './modules/example';

$(() => {
    let example = new Example({ el: '#content' });
    example.render({ msg: 'READY' });
});
