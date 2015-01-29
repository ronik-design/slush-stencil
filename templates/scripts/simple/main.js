require('./shim');
var Example = require('./modules/example');

$(() => {
    var example = new Example({ el: '#content' });
    example.render({ msg: 'READY' });
});
